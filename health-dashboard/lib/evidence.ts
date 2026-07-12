// Evidence library — the coach's "digital brain" for citations.
//
// The coach must ground claims in entries from this list (or equally
// well-established consensus guidelines) rather than inventing sources.
// The data lives in data/evidence-library.json so both the Next.js app
// and the standalone daily-summary script (scripts/daily-whatsapp-summary.mjs)
// read the exact same source of truth. Edit the JSON, not this file.

import evidenceData from '../data/evidence-library.json';

export interface EvidenceEntry {
  topic: string;
  citation: string;
  finding: string;
}

export const EVIDENCE_LIBRARY: EvidenceEntry[] = evidenceData;

export function evidenceLibraryAsPromptBlock(): string {
  return EVIDENCE_LIBRARY
    .map(e => `- **${e.topic}** — ${e.finding} (${e.citation})`)
    .join('\n');
}
