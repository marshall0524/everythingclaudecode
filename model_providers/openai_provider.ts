'use strict';

class OpenAIProvider {
  constructor(options) {
    const normalizedOptions = options || {};
    this.baseUrl = normalizedOptions.baseUrl || process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
    this.apiKey = normalizedOptions.apiKey || process.env.OPENAI_API_KEY || '';
    this.model = normalizedOptions.model || 'gpt-5.4';
  }

  async complete(request) {
    if (!this.apiKey) {
      throw new Error('OpenAI provider requires OPENAI_API_KEY.');
    }

    const response = await fetch(`${this.baseUrl.replace(/\/$/, '')}/responses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
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
      throw new Error(await formatHttpError('OpenAI provider request failed', response));
    }

    const payload = await parseJsonResponse('OpenAI provider response', response);

    return {
      text: extractResponseText(payload),
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

function extractResponseText(payload) {
  const outputItems = Array.isArray(payload && payload.output) ? payload.output : [];
  const textChunks = [];

  for (const item of outputItems) {
    const contentItems = Array.isArray(item && item.content) ? item.content : [];
    for (const content of contentItems) {
      if (content && content.type === 'output_text' && typeof content.text === 'string') {
        textChunks.push(content.text);
      }
    }
  }

  if (textChunks.length > 0) {
    return textChunks.join('\n').trim();
  }

  return '';
}

module.exports = {
  OpenAIProvider
};
