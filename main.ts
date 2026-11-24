// Funniest Autocorrect Fail — a make.fun entry (Node 22+,
// standard library only, no network, no model calls, fully
// deterministic: the same line every run).
//
// The entry is a single line that reads as a funny autocorrect
// fail and nothing else. It is written to /output/entry.txt.
//
// The line: a text to a date meant to say "can't wait to see you"
// lands as "can't wait to sue you" — one letter flips a romantic
// message into a lawsuit threat. The slip is instantly clear
// (see -> sue), the wrong word is a maximal surprise, and the joke
// lands on first read with no setup needed.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for
// /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const LINE =
  "I meant to text my date 'can't wait to see you' — autocorrect sent 'can't wait to sue you.'";

// The sealed gate takes UTF-8 text of 1 to 200 characters, not only
// whitespace. Count code points (not UTF-16 units or bytes) so the
// check matches the gate exactly, and fail loudly here instead of
// shipping an entry the gate refuses.
function validateLine(line) {
  const chars = [...line].length;
  if (chars < 1 || chars > 200) {
    throw new Error(`entry is ${chars} characters; the gate needs 1-200`);
  }
  if (line.trim().length === 0) {
    throw new Error('entry is only whitespace; the gate needs real text');
  }
  return chars;
}

function writeEntry(line) {
  const chars = validateLine(line);
  // /output is the grader's directory; outside it, MAKEFUN_OUTPUT_DIR
  // stands in so the same code can be run locally for testing.
  const outDir = process.env.MAKEFUN_OUTPUT_DIR?.trim()
    ? process.env.MAKEFUN_OUTPUT_DIR
    : '/output';
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'entry.txt'), line + '\n', 'utf8');
  return chars;
}

const chars = writeEntry(LINE);

console.log(`wrote entry.txt (${chars} characters + newline)`);
