'use strict';

const { spawnSync } = require('child_process');

class TerminalInterface {
  constructor(options) {
    const normalizedOptions = options || {};
    this.cwd = normalizedOptions.cwd || process.cwd();
    this.config = normalizedOptions.config || {};
  }

  async runCommand(command) {
    const normalizedCommand = String(command || '').trim();
    if (!normalizedCommand) {
      return {
        ok: false,
        type: 'terminal_command',
        command: normalizedCommand,
        error: 'Command is required.'
      };
    }

    if (!isTerminalAllowed(this.config)) {
      return {
        ok: false,
        type: 'terminal_command',
        command: normalizedCommand,
        error: 'Terminal execution is disabled by tool permissions.'
      };
    }

    if (isBlockedCommand(normalizedCommand, this.config)) {
      return {
        ok: false,
        type: 'terminal_command',
        command: normalizedCommand,
        error: 'Command was blocked by the execution policy.'
      };
    }

    if (isDryRun(this.config)) {
      return {
        ok: true,
        type: 'terminal_command',
        command: normalizedCommand,
        dryRun: true,
        stdout: '[dry-run] Command execution skipped.',
        stderr: '',
        exitCode: 0
      };
    }

    const startedAt = Date.now();
    const result = spawnSync(normalizedCommand, {
      cwd: this.cwd,
      shell: true,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 300000
    });

    return {
      ok: !result.error && result.status === 0,
      type: 'terminal_command',
      command: normalizedCommand,
      stdout: String(result.stdout || '').trim(),
      stderr: String(result.stderr || '').trim(),
      exitCode: typeof result.status === 'number' ? result.status : 1,
      durationMs: Date.now() - startedAt,
      error: result.error ? result.error.message : ''
    };
  }
}

function isTerminalAllowed(config) {
  return !config.tool_permissions || config.tool_permissions.allow_terminal !== false;
}

function isDryRun(config) {
  return Boolean(config.execution_sandbox && config.execution_sandbox.dry_run);
}

function isBlockedCommand(command, config) {
  const blockedCommands = Array.isArray(config.tool_permissions && config.tool_permissions.blocked_commands)
    ? config.tool_permissions.blocked_commands
    : [];

  const commandTokens = normalizeCommandTokens(tokenizeShellCommand(command));
  return blockedCommands.some((blockedCommand) => matchesBlockedPattern(commandTokens, normalizeCommandTokens(tokenizeShellCommand(blockedCommand))));
}

function matchesBlockedPattern(commandTokens, blockedTokens) {
  if (commandTokens.length === 0 || blockedTokens.length === 0) {
    return false;
  }

  if (commandTokens[0] !== blockedTokens[0]) {
    return false;
  }

  const blockedRemainder = blockedTokens.slice(1);
  if (blockedRemainder.length === 0) {
    return true;
  }

  if (blockedRemainder.every(isFlagToken)) {
    const commandFlags = collectLeadingFlags(commandTokens.slice(1));
    const commandFlagSet = new Set(commandFlags);
    return blockedRemainder.every((flag) => commandFlagSet.has(flag));
  }

  if (commandTokens.length < blockedTokens.length) {
    return false;
  }

  return blockedTokens.every((token, index) => commandTokens[index] === token);
}

function collectLeadingFlags(tokens) {
  const flags = [];
  for (const token of tokens) {
    if (!isFlagToken(token)) {
      break;
    }

    flags.push(token);
  }

  return flags;
}

function isFlagToken(token) {
  return typeof token === 'string' && token.startsWith('-');
}

function normalizeCommandTokens(tokens) {
  return stripLeadingEnvAssignments(tokens)
    .map((token) => String(token || '').trim().toLowerCase())
    .filter(Boolean)
    .flatMap(expandShortFlags);
}

function stripLeadingEnvAssignments(tokens) {
  const normalizedTokens = Array.isArray(tokens) ? [...tokens] : [];
  while (normalizedTokens.length > 0 && /^[a-z_][a-z0-9_]*=.*$/i.test(normalizedTokens[0])) {
    normalizedTokens.shift();
  }

  return normalizedTokens;
}

function expandShortFlags(token) {
  if (!/^-[a-zA-Z]{2,}$/.test(token)) {
    return [token];
  }

  return token
    .slice(1)
    .split('')
    .map((flag) => `-${flag.toLowerCase()}`);
}

function tokenizeShellCommand(command) {
  const input = String(command || '');
  const tokens = [];
  let current = '';
  let quote = '';

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];

    if (quote) {
      if (char === '\\' && quote === '"' && index + 1 < input.length) {
        current += input[index + 1];
        index += 1;
        continue;
      }

      if (char === quote) {
        quote = '';
        continue;
      }

      current += char;
      continue;
    }

    if (char === '"' || char === '\'') {
      quote = char;
      continue;
    }

    if (/\s/.test(char)) {
      if (current) {
        tokens.push(current);
        current = '';
      }
      continue;
    }

    if (char === '\\' && index + 1 < input.length) {
      current += input[index + 1];
      index += 1;
      continue;
    }

    current += char;
  }

  if (current) {
    tokens.push(current);
  }

  return tokens;
}

module.exports = {
  TerminalInterface
};
