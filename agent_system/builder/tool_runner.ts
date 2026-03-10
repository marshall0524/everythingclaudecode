'use strict';

class ToolRunner {
  constructor(options) {
    const normalizedOptions = options || {};
    this.terminal = normalizedOptions.terminal;
    this.fileSystem = normalizedOptions.fileSystem;
    this.apiTools = normalizedOptions.apiTools;
  }

  async run(action) {
    const normalizedAction = action || {};
    const type = normalizedAction.type;

    if (type === 'terminal_command') {
      if (!this.terminal || typeof this.terminal.runCommand !== 'function') {
        return missingBackendResult(type, 'terminal');
      }
      return this.terminal.runCommand(normalizedAction.command);
    }

    if (type === 'write_file') {
      if (!this.fileSystem || typeof this.fileSystem.writeFile !== 'function') {
        return missingBackendResult(type, 'fileSystem');
      }
      return this.fileSystem.writeFile(normalizedAction.path, normalizedAction.content);
    }

    if (type === 'append_file') {
      if (!this.fileSystem || typeof this.fileSystem.appendFile !== 'function') {
        return missingBackendResult(type, 'fileSystem');
      }
      return this.fileSystem.appendFile(normalizedAction.path, normalizedAction.content);
    }

    if (type === 'read_file') {
      if (!this.fileSystem || typeof this.fileSystem.readFile !== 'function') {
        return missingBackendResult(type, 'fileSystem');
      }
      return this.fileSystem.readFile(normalizedAction.path);
    }

    if (type === 'replace_in_file') {
      if (!this.fileSystem || typeof this.fileSystem.replaceInFile !== 'function') {
        return missingBackendResult(type, 'fileSystem');
      }
      return this.fileSystem.replaceInFile(
        normalizedAction.path,
        normalizedAction.search,
        normalizedAction.replace
      );
    }

    if (type === 'http_request') {
      if (!this.apiTools || typeof this.apiTools.request !== 'function') {
        return missingBackendResult(type, 'apiTools');
      }
      return this.apiTools.request(normalizedAction);
    }

    if (type === 'web_search') {
      if (!this.apiTools || typeof this.apiTools.webSearch !== 'function') {
        return missingBackendResult(type, 'apiTools');
      }
      return this.apiTools.webSearch(normalizedAction.query);
    }

    if (type === 'finish') {
      return {
        ok: true,
        type: 'finish',
        summary: normalizedAction.summary || ''
      };
    }

    return {
      ok: false,
      type: type || 'unknown',
      error: `Unsupported action type: ${type || 'undefined'}`
    };
  }
}

function missingBackendResult(type, backendName) {
  return {
    ok: false,
    type,
    error: `Action "${type}" is unavailable because the ${backendName} backend was not configured.`
  };
}

module.exports = {
  ToolRunner
};
