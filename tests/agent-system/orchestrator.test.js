/**
 * Tests for the self-evolving agent system runtime.
 *
 * Run with: node tests/agent-system/orchestrator.test.js
 */

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

function testResult(name, err) {
  if (!err) {
    console.log(`  \u2713 ${name}`);
    return true;
  }

  console.log(`  \u2717 ${name}`);
  console.log(`    Error: ${err.message}`);
  if (err.stack) {
    console.log(`    Stack: ${err.stack}`);
  }
  return false;
}

async function test(name, fn) {
  try {
    await fn();
    return testResult(name);
  } catch (err) {
    return testResult(name, err);
  }
}

function makeTmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'agent-system-test-'));
}

function loadModule(relativePath) {
  const fullPath = path.join(__dirname, '..', '..', relativePath);
  return require(fullPath);
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf8');
}

async function runTests() {
  console.log('\n=== Testing self-evolving agent system ===\n');

  require.extensions['.ts'] = require.extensions['.js'];

  let passed = 0;
  let failed = 0;

  console.log('Module loading:');

  let modules = null;
  if (await test('core agent system modules load from .ts entrypoints', async () => {
    modules = {
      executorAgent: loadModule('agent_system/builder/executor_agent.ts'),
      jsonUtils: loadModule('agent_system/shared/json_utils.ts'),
      openaiProvider: loadModule('model_providers/openai_provider.ts'),
      localProvider: loadModule('model_providers/local_provider.ts'),
      toolRunner: loadModule('agent_system/builder/tool_runner.ts'),
      episodicMemory: loadModule('agent_system/memory/episodic_memory.ts'),
      plannerAgent: loadModule('agent_system/planner/planner_agent.ts'),
      providerFactory: loadModule('agent_system/shared/provider_factory.ts'),
      taskGraph: loadModule('agent_system/planner/task_graph.ts'),
      terminalInterface: loadModule('agent_system/environment/terminal_interface.ts'),
      skillLibrary: loadModule('agent_system/memory/skill_library.ts'),
      orchestrator: loadModule('agent_system/orchestrator/agent_orchestrator.ts'),
      mockProvider: loadModule('model_providers/mock_provider.ts')
    };

    assert.strictEqual(typeof modules.taskGraph.createTaskGraph, 'function');
      assert.strictEqual(typeof modules.executorAgent.ExecutorAgent, 'function');
    assert.strictEqual(typeof modules.jsonUtils.tryParseJson, 'function');
    assert.strictEqual(typeof modules.openaiProvider.OpenAIProvider, 'function');
    assert.strictEqual(typeof modules.localProvider.LocalProvider, 'function');
    assert.strictEqual(typeof modules.toolRunner.ToolRunner, 'function');
    assert.strictEqual(typeof modules.episodicMemory.EpisodicMemory, 'function');
    assert.strictEqual(typeof modules.plannerAgent.PlannerAgent, 'function');
    assert.strictEqual(typeof modules.providerFactory.createModelProvider, 'function');
    assert.strictEqual(typeof modules.terminalInterface.TerminalInterface, 'function');
    assert.strictEqual(typeof modules.skillLibrary.SkillLibrary, 'function');
    assert.strictEqual(typeof modules.orchestrator.AgentOrchestrator, 'function');
    assert.strictEqual(typeof modules.mockProvider.MockModelProvider, 'function');
  })) passed++; else failed++;

  if (!modules) {
    console.log('\nPassed: 0');
    console.log('Failed: 1');
    process.exit(1);
  }

  console.log('\nTask graph:');

  if (await test('createTaskGraph orders dependent tasks topologically', async () => {
    const graph = modules.taskGraph.createTaskGraph([
      {
        id: 'plan',
        title: 'Plan the task',
        description: 'Gather scope',
        dependencies: []
      },
      {
        id: 'build',
        title: 'Build the slice',
        description: 'Implement the code',
        dependencies: ['plan']
      },
      {
        id: 'eval',
        title: 'Evaluate the slice',
        description: 'Run checks',
        dependencies: ['build']
      }
    ]);

    assert.deepStrictEqual(graph.order, ['plan', 'build', 'eval']);
    assert.deepStrictEqual(graph.missingDependencies, []);
    assert.strictEqual(graph.hasCycle, false);
  })) passed++; else failed++;

  if (await test('createTaskGraph omits edges for missing dependencies while reporting them', async () => {
    const graph = modules.taskGraph.createTaskGraph([
      {
        id: 'build',
        title: 'Build',
        description: 'Implement the feature',
        dependencies: ['missing-plan']
      }
    ]);

    assert.deepStrictEqual(graph.edges, []);
    assert.deepStrictEqual(graph.missingDependencies, [
      {
        taskId: 'build',
        dependency: 'missing-plan'
      }
    ]);
  })) passed++; else failed++;

  console.log('\nExecution semantics:');

  if (await test('ExecutorAgent marks finish actions as completed even with an empty summary', async () => {
    const agent = new modules.executorAgent.ExecutorAgent({
      provider: {
        async complete() {
          return {
            text: JSON.stringify({
              thought: 'Finished cleanly.',
              action: {
                type: 'finish',
                summary: ''
              }
            })
          };
        }
      },
      toolRunner: {
        async run() {
          throw new Error('tool runner should not be called for finish actions');
        }
      },
      maxSteps: 1
    });

    const result = await agent.execute({
      goal: 'Finish immediately',
      architecture: {}
    });

    assert.strictEqual(result.status, 'completed');
    assert.strictEqual(result.summary, 'Finished cleanly.');
    assert.deepStrictEqual(result.steps, []);
  })) passed++; else failed++;

  console.log('\nTool runner:');

  if (await test('ToolRunner returns a structured error when a backend is missing', async () => {
    const runner = new modules.toolRunner.ToolRunner({});
    const result = await runner.run({
      type: 'write_file',
      path: 'README.md',
      content: 'hello'
    });

    assert.strictEqual(result.ok, false);
    assert.ok(result.error.includes('fileSystem backend'));
  })) passed++; else failed++;

  console.log('\nMemory helpers:');

  if (await test('EpisodicMemory generates unique fallback runIds when Date.now collides', async () => {
    const tmpDir = makeTmpDir();
    const originalDateNow = Date.now;
    try {
      const memory = new modules.episodicMemory.EpisodicMemory({
        cwd: tmpDir,
        directory: 'agent_memory/episodic'
      });

      Date.now = () => 1700000000000;
      const firstPath = memory.saveEpisode({ goal: 'first' });
      const secondPath = memory.saveEpisode({ goal: 'second' });

      assert.notStrictEqual(firstPath, secondPath);
      assert.ok(fs.existsSync(firstPath));
      assert.ok(fs.existsSync(secondPath));
    } finally {
      Date.now = originalDateNow;
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  })) passed++; else failed++;

  console.log('\nPlanner prompts:');

  if (await test('PlannerAgent omits undefined semantic hint fields from the prompt', async () => {
    const requests = [];
    const planner = new modules.plannerAgent.PlannerAgent({
      provider: {
        async complete(request) {
          requests.push(request);
          return {
            text: JSON.stringify({
              summary: 'ok',
              tasks: []
            })
          };
        }
      }
    });

    await planner.plan({
      goal: 'Plan with partial semantic hints',
      semanticHints: [
        { topic: 'Caching' },
        { fact: 'Warm the cache before the rollout.' },
        {}
      ]
    });

    assert.strictEqual(requests.length, 1);
    assert.ok(!requests[0].prompt.includes('undefined'));
    assert.ok(requests[0].prompt.includes('Unknown topic'));
    assert.ok(requests[0].prompt.includes('No fact provided.'));
  })) passed++; else failed++;

  console.log('\nSafety helpers:');

  if (await test('tryParseJson preserves a valid JSON null instead of treating it as a parse failure', async () => {
    const parsed = modules.jsonUtils.tryParseJson('null');
    const parsedWithFallback = modules.jsonUtils.parseJsonWithFallback('null', { fallback: true });

    assert.strictEqual(parsed, null);
    assert.strictEqual(parsedWithFallback, null);
  })) passed++; else failed++;

  if (await test('createModelProvider warns before falling back from an unknown provider id', async () => {
    const originalWarn = console.warn;
    const warnings = [];
    try {
      console.warn = (message) => warnings.push(message);
      const provider = modules.providerFactory.createModelProvider({
        model: {
          provider: 'claudee',
          name: 'mock-agent-team'
        }
      });

      assert.strictEqual(provider.constructor.name, 'MockModelProvider');
      assert.strictEqual(warnings.length, 1);
      assert.ok(warnings[0].includes('claudee'));
    } finally {
      console.warn = originalWarn;
    }
  })) passed++; else failed++;

  if (await test('TerminalInterface blocks normalized destructive commands without substring false positives', async () => {
    const terminal = new modules.terminalInterface.TerminalInterface({
      cwd: process.cwd(),
      config: {
        tool_permissions: {
          allow_terminal: true,
          blocked_commands: ['rm -rf', 'git reset --hard']
        }
      }
    });

    const blockedResult = await terminal.runCommand('FOO=1 rm -r -f dist');
    const allowedResult = await terminal.runCommand('echo "rm -rf"');

    assert.strictEqual(blockedResult.ok, false);
    assert.strictEqual(blockedResult.error, 'Command was blocked by the execution policy.');
    assert.strictEqual(allowedResult.ok, true);
  })) passed++; else failed++;

  console.log('\nProvider error handling:');

  if (await test('OpenAIProvider surfaces HTTP status for non-JSON error bodies', async () => {
    const originalFetch = global.fetch;
    try {
      global.fetch = async () => ({
        ok: false,
        status: 502,
        text: async () => '<html>bad gateway</html>'
      });

      const provider = new modules.openaiProvider.OpenAIProvider({
        apiKey: 'test-key'
      });

      await assert.rejects(
        () => provider.complete({ prompt: 'hello' }),
        /OpenAI provider request failed \(502\): <html>bad gateway<\/html>/
      );
    } finally {
      global.fetch = originalFetch;
    }
  })) passed++; else failed++;

  if (await test('LocalProvider surfaces HTTP status for non-JSON error bodies', async () => {
    const originalFetch = global.fetch;
    try {
      global.fetch = async () => ({
        ok: false,
        status: 503,
        text: async () => 'service unavailable'
      });

      const provider = new modules.localProvider.LocalProvider({
        baseUrl: 'http://localhost:9999',
        kind: 'openai-compatible'
      });

      await assert.rejects(
        () => provider.complete({ prompt: 'hello' }),
        /Local provider request failed \(503\): service unavailable/
      );
    } finally {
      global.fetch = originalFetch;
    }
  })) passed++; else failed++;

  console.log('\nSkill library:');

  if (await test('SkillLibrary stores markdown skills and retrieves relevant matches', async () => {
    const tmpDir = makeTmpDir();
    try {
      const library = new modules.skillLibrary.SkillLibrary({
        cwd: tmpDir,
        directory: 'agent_skills'
      });

      const storedSkill = library.storeSkill({
        slug: 'debug_python_dependency',
        title: 'Debug Python dependency conflicts',
        tags: ['python', 'dependencies', 'pip'],
        problem: 'A Python package install fails because dependency versions conflict.',
        steps: [
          'Capture the failing install output.',
          'Inspect pinned and transitive versions.',
          'Adjust constraints and re-run the install.'
        ],
        toolsUsed: ['terminal_command', 'read_file'],
        commonFailures: ['Multiple libraries pin incompatible versions.'],
        reusablePattern: 'Capture the resolver error, isolate the conflicting packages, then re-resolve with explicit constraints.'
      });

      const storedPath = path.join(tmpDir, 'agent_skills', 'debug_python_dependency.md');
      const storedContent = fs.readFileSync(storedPath, 'utf8');
      const matches = library.search('debug python pip dependency issue', 3);

      assert.strictEqual(storedSkill.slug, 'debug_python_dependency');
      assert.ok(storedContent.includes('## Problem'));
      assert.ok(storedContent.includes('## Reusable Pattern'));
      assert.ok(matches.length >= 1);
      assert.strictEqual(matches[0].slug, 'debug_python_dependency');
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  })) passed++; else failed++;

  console.log('\nOrchestration:');

  if (await test('AgentOrchestrator runGoal saves memory, reflections, and extracted skills', async () => {
    const tmpDir = makeTmpDir();
    try {
      const configPath = path.join(tmpDir, 'config', 'agent_config.json');
      writeJson(configPath, {
        model: {
          provider: 'mock',
          name: 'mock-agent-team'
        },
        temperature: 0.2,
        memory_paths: {
          working: 'agent_memory/working',
          episodic: 'agent_memory/episodic',
          semantic: 'agent_memory/semantic'
        },
        skill_library_path: 'agent_skills',
        tool_permissions: {
          allow_terminal: true,
          allow_file_system: true,
          allow_api: false,
          blocked_commands: ['rm -rf', 'git reset --hard']
        },
        execution_sandbox: {
          mode: 'workspace-write',
          dry_run: false,
          max_react_steps: 4
        }
      });

      const seededLibrary = new modules.skillLibrary.SkillLibrary({
        cwd: tmpDir,
        directory: 'agent_skills'
      });

      seededLibrary.storeSkill({
        slug: 'build_fastapi_api',
        title: 'Build a FastAPI API',
        tags: ['python', 'fastapi', 'api'],
        problem: 'Need a repeatable pattern for building a FastAPI service with health checks.',
        steps: [
          'Define the API contract and validation boundaries.',
          'Create the app entrypoint and health route.',
          'Run a smoke test against the route.'
        ],
        toolsUsed: ['terminal_command', 'write_file'],
        commonFailures: ['Import paths break when the app package layout shifts.'],
        reusablePattern: 'Start with the contract, add a health route, then smoke-test the service before expanding.'
      });

      const orchestrator = new modules.orchestrator.AgentOrchestrator({
        configPath,
        cwd: tmpDir,
        provider: new modules.mockProvider.MockModelProvider()
      });

      const report = await orchestrator.runGoal('Build a FastAPI API with a health endpoint');
      const episodicDir = path.join(tmpDir, 'agent_memory', 'episodic');
      const semanticPath = path.join(tmpDir, 'agent_memory', 'semantic', 'semantic_memory.json');
      const createdArtifact = path.join(tmpDir, 'agent-output', 'build-a-fastapi-api-with-a-health-endpoint-run.md');

      assert.ok(report.plan.tasks.length >= 3);
      assert.ok(report.taskGraph.order.length >= 3);
      assert.ok(report.retrievedSkills.some((skill) => skill.slug === 'build_fastapi_api'));
      assert.ok(report.execution.steps.length >= 2);
      assert.strictEqual(report.evaluation.status, 'pass');
      assert.ok(report.reflection.summary.length > 0);
      assert.ok(report.createdSkill);
      assert.ok(fs.existsSync(createdArtifact));
      assert.ok(fs.readdirSync(episodicDir).some((fileName) => fileName.endsWith('.json')));
      assert.ok(fs.existsSync(semanticPath));
      assert.ok(fs.existsSync(path.join(tmpDir, 'agent_skills', `${report.createdSkill.slug}.md`)));
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  })) passed++; else failed++;

  console.log('\nExecute then learn:');

  if (await test('executeGoal persists an episode and learnFromEpisode adds reflection data later', async () => {
    const tmpDir = makeTmpDir();
    try {
      const configPath = path.join(tmpDir, 'config', 'agent_config.json');
      writeJson(configPath, {
        model: {
          provider: 'mock',
          name: 'mock-agent-team'
        },
        temperature: 0.1,
        memory_paths: {
          working: 'agent_memory/working',
          episodic: 'agent_memory/episodic',
          semantic: 'agent_memory/semantic'
        },
        skill_library_path: 'agent_skills',
        tool_permissions: {
          allow_terminal: true,
          allow_file_system: true,
          allow_api: false,
          blocked_commands: ['rm -rf', 'git reset --hard']
        },
        execution_sandbox: {
          mode: 'workspace-write',
          dry_run: false,
          max_react_steps: 4
        }
      });

      const orchestrator = new modules.orchestrator.AgentOrchestrator({
        configPath,
        cwd: tmpDir,
        provider: new modules.mockProvider.MockModelProvider()
      });

      const executionReport = await orchestrator.executeGoal('Debug a Python dependency resolver failure');
      const learnedReport = await orchestrator.learnFromEpisode('latest');

      assert.ok(executionReport.runId);
      assert.strictEqual(executionReport.reflection, null);
      assert.ok(learnedReport.reflection);
      assert.ok(learnedReport.createdSkill);
      assert.ok(fs.existsSync(path.join(tmpDir, 'agent_skills', `${learnedReport.createdSkill.slug}.md`)));
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  })) passed++; else failed++;

  console.log(`\nPassed: ${passed}`);
  console.log(`Failed: ${failed}`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error(err);
  console.log('\nPassed: 0');
  console.log('Failed: 1');
  process.exit(1);
});
