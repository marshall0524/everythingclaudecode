'use strict';

const KNOWN_PROVIDER_IDS = new Set(['claude', 'openai', 'local', 'mock']);

function createModelProvider(config, options) {
  const providerId = normalizeProviderId(getProviderId(config, options));

  if (providerId === 'claude') {
    const { ClaudeProvider } = require('../../model_providers/claude_provider.ts');
    return new ClaudeProvider({
      model: getModelName(config, options)
    });
  }

  if (providerId === 'openai') {
    const { OpenAIProvider } = require('../../model_providers/openai_provider.ts');
    return new OpenAIProvider({
      model: getModelName(config, options)
    });
  }

  if (providerId === 'local') {
    const { LocalProvider } = require('../../model_providers/local_provider.ts');
    return new LocalProvider({
      model: getModelName(config, options)
    });
  }

  const { MockModelProvider } = require('../../model_providers/mock_provider.ts');
  if (providerId !== 'mock') {
    console.warn(`Unknown model provider "${providerId}". Falling back to "mock".`);
  }
  return new MockModelProvider({
    model: getModelName(config, options)
  });
}

function getProviderId(config, options) {
  if (options && options.providerId) {
    return options.providerId;
  }

  if (process.env.AGENT_MODEL_PROVIDER) {
    return process.env.AGENT_MODEL_PROVIDER;
  }

  return (config && config.model && config.model.provider) || 'mock';
}

function normalizeProviderId(providerId) {
  const normalizedProviderId = String(providerId || 'mock').trim().toLowerCase();
  return KNOWN_PROVIDER_IDS.has(normalizedProviderId) ? normalizedProviderId : normalizedProviderId || 'mock';
}

function getModelName(config, options) {
  if (options && options.modelName) {
    return options.modelName;
  }

  if (process.env.AGENT_MODEL_NAME) {
    return process.env.AGENT_MODEL_NAME;
  }

  return (config && config.model && config.model.name) || 'mock-agent-team';
}

module.exports = {
  createModelProvider
};
