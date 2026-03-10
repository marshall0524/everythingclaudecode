'use strict';

const { cloneValue } = require('./file_utils.ts');

function tryParseJson(rawValue) {
  if (rawValue === null || typeof rawValue === 'undefined') {
    return undefined;
  }

  if (typeof rawValue === 'object') {
    return rawValue;
  }

  const rawText = String(rawValue).trim();
  if (!rawText) {
    return undefined;
  }

  const direct = parseCandidate(rawText);
  if (typeof direct !== 'undefined') {
    return direct;
  }

  const fencedMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fencedMatch) {
    const fenced = parseCandidate(fencedMatch[1].trim());
    if (typeof fenced !== 'undefined') {
      return fenced;
    }
  }

  const firstObjectIndex = rawText.indexOf('{');
  const lastObjectIndex = rawText.lastIndexOf('}');
  if (firstObjectIndex >= 0 && lastObjectIndex > firstObjectIndex) {
    const objectCandidate = parseCandidate(rawText.slice(firstObjectIndex, lastObjectIndex + 1));
    if (typeof objectCandidate !== 'undefined') {
      return objectCandidate;
    }
  }

  const firstArrayIndex = rawText.indexOf('[');
  const lastArrayIndex = rawText.lastIndexOf(']');
  if (firstArrayIndex >= 0 && lastArrayIndex > firstArrayIndex) {
    const arrayCandidate = parseCandidate(rawText.slice(firstArrayIndex, lastArrayIndex + 1));
    if (typeof arrayCandidate !== 'undefined') {
      return arrayCandidate;
    }
  }

  return undefined;
}

function parseCandidate(candidate) {
  try {
    return JSON.parse(candidate);
  } catch (_err) {
    return undefined;
  }
}

function parseJsonWithFallback(rawValue, fallbackValue) {
  const parsed = tryParseJson(rawValue);
  return typeof parsed === 'undefined' ? cloneValue(fallbackValue) : parsed;
}

function safeString(value, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function safeArray(value) {
  return Array.isArray(value) ? [...value] : [];
}

module.exports = {
  parseJsonWithFallback,
  safeArray,
  safeString,
  tryParseJson
};
