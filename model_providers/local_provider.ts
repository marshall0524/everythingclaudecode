'use strict';

class LocalProvider {
  constructor(options) {
    const normalizedOptions = options || {};
    this.baseUrl = normalizedOptions.baseUrl || process.env.LOCAL_MODEL_BASE_URL || 'http://127.0.0.1:11434';
    this.model = normalizedOptions.model || process.env.LOCAL_MODEL_NAME || 'llama3.2';
    this.kind = normalizedOptions.kind || process.env.LOCAL_MODEL_KIND || guessKind(this.baseUrl);
  }

  async complete(request) {
    if (this.kind === 'ollama') {
      return this.completeWithOllama(request);
    }

    return this.completeWithOpenAICompatibleApi(request);
  }

  async completeWithOllama(request) {
    const response = await fetch(`${this.baseUrl.replace(/\/$/, '')}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.model,
        prompt: buildPrompt(request),
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(await formatHttpError('Local provider request failed', response));
    }

    const payload = await parseJsonResponse('Local provider response', response);

    return {
      text: String(payload.response || '').trim(),
      model: payload.model || this.model,
      raw: payload
    };
  }

  async completeWithOpenAICompatibleApi(request) {
    const response = await fetch(`${this.baseUrl.replace(/\/$/, '')}/responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.model,
        instructions: request.instructions || undefined,
        input: request.prompt || '',
        temperature: typeof request.temperature === 'number' ? request.temperature : undefined,
        store: false,
        text: {
          format: {
            type: 'text'
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(await formatHttpError('Local provider request failed', response));
    }

    const payload = await parseJsonResponse('Local provider response', response);

    const output = Array.isArray(payload.output) ? payload.output : [];
    const text = output
      .flatMap((item) => Array.isArray(item.content) ? item.content : [])
      .filter((content) => content && content.type === 'output_text')
      .map((content) => content.text)
      .join('\n')
      .trim();

    return {
      text,
      model: payload.model || this.model,
      raw: payload
    };
  }
}

async function formatHttpError(prefix, response) {
  const bodyText = await response.text().catch(() => '');
  const normalizedBody = String(bodyText || '').trim();
  return normalizedBody
    ? `${prefix} (${response.status}): ${normalizedBody}`
    : `${prefix} (${response.status})`;
}

async function parseJsonResponse(prefix, response) {
  const bodyText = await response.text().catch(() => '');
  const normalizedBody = String(bodyText || '').trim();

  if (!normalizedBody) {
    throw new Error(`${prefix} was empty.`);
  }

  try {
    return JSON.parse(normalizedBody);
  } catch (_err) {
    throw new Error(`${prefix} was not valid JSON.`);
  }
}

function buildPrompt(request) {
  return [
    request && request.instructions ? `SYSTEM:\n${request.instructions}\n` : '',
    request && request.prompt ? `USER:\n${request.prompt}` : ''
  ].filter(Boolean).join('\n');
}

function guessKind(baseUrl) {
  return String(baseUrl || '').includes('11434') ? 'ollama' : 'openai-compatible';
}

module.exports = {
  LocalProvider
};
