// Generates Starlight pages from the canonical README.md.
// README.md and images/ are READ ONLY — never modified. Output is git-ignored.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(__dirname, '..');
const ROOT = path.resolve(SITE, '..');
const README = path.join(ROOT, 'README.md');
const SRC_IMAGES = path.join(ROOT, 'images');
const DOCS = path.join(SITE, 'src', 'content', 'docs');
const PUB_IMAGES = path.join(SITE, 'public', 'images');
const BASE = '/new-signbox-guide';

// README H2 section number -> stable slug (matches sidebar in astro.config.mjs)
const SLUG = {
  1: 'concepts',
  2: 'before-you-start',
  3: 'login',
  4: 'initiating',
  5: 'templates-contacts',
  6: 'management',
  7: 'signing',
  8: 'tracking',
  9: 'appendix',
};

function rmrf(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}
function ensure(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

// --- read & split README -------------------------------------------------
const md = fs.readFileSync(README, 'utf8').replace(/\r\n/g, '\n');
const lines = md.split('\n');

let h1 = 'TrustLynx SignBox — User Guide';
const intro = []; // lines after H1 before first H2 (incl. "About this guide" blockquote)
const sections = []; // { num, title, body[] }
let cur = null;
let seenH1 = false;

for (const line of lines) {
  if (!seenH1 && /^#\s+/.test(line)) {
    h1 = line.replace(/^#\s+/, '').trim();
    seenH1 = true;
    continue;
  }
  const h2 = line.match(/^##\s+(.*)$/);
  if (h2 && !/^###/.test(line)) {
    const title = h2[1].trim();
    if (/^table of contents/i.test(title)) {
      cur = { num: -1, title, body: [], skip: true };
      sections.push(cur);
      continue;
    }
    const numMatch = title.match(/^(\d+)\.\s+(.*)$/);
    cur = {
      num: numMatch ? parseInt(numMatch[1], 10) : 0,
      title: numMatch ? numMatch[2].trim() : title,
      body: [],
      skip: false,
    };
    sections.push(cur);
    continue;
  }
  if (!cur) {
    if (seenH1) intro.push(line);
    continue;
  }
  cur.body.push(line);
}

// --- transforms ----------------------------------------------------------
function fixImages(s) {
  return s.replaceAll('](images/', `](${BASE}/images/`);
}
function fixCrossLinks(s) {
  // README in-page anchors -> the target section page (robust: links to page root)
  return s.replace(/\]\(#(\d)[\w-]*\)/g, (m, n) => {
    const slug = SLUG[parseInt(n, 10)];
    return slug ? `](${BASE}/${slug}/)` : m;
  });
}
function promoteAndClean(bodyLines) {
  const out = [];
  for (let raw of bodyLines) {
    let line = raw;
    if (/^---\s*$/.test(line)) continue; // drop horizontal rules (section separators)
    if (/^####\s+/.test(line)) line = line.replace(/^####\s+/, '### ');
    else if (/^###\s+/.test(line)) line = line.replace(/^###\s+/, '## ');
    // strip "N." / "N.M" numbering from headings
    line = line.replace(/^(#{2,3})\s+\d+(?:\.\d+)*\.?\s+/, '$1 ');
    out.push(line);
  }
  // trim leading/trailing blank lines
  while (out.length && out[0].trim() === '') out.shift();
  while (out.length && out[out.length - 1].trim() === '') out.pop();
  return out.join('\n');
}
function firstParagraph(text) {
  const m = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#') && !l.startsWith('>') && !l.startsWith('|') && !l.startsWith('!') && !l.startsWith('-'));
  let p = (m[0] || '').replace(/[*_`]/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  if (p.length > 160) p = p.slice(0, 157).replace(/\s+\S*$/, '') + '…';
  return p || 'TrustLynx SignBox user guide.';
}
const yaml = (v) => JSON.stringify(v);

// --- write generated pages ----------------------------------------------
rmrf(DOCS);
ensure(DOCS);

for (const sec of sections) {
  if (sec.skip || !sec.num) continue;
  const slug = SLUG[sec.num];
  if (!slug) continue;
  let body = promoteAndClean(sec.body);
  body = fixCrossLinks(fixImages(body));
  const desc = firstParagraph(body);
  const fm = [
    '---',
    `title: ${yaml(sec.title)}`,
    `description: ${yaml(desc)}`,
    'sidebar:',
    `  order: ${sec.num}`,
    '---',
    '',
  ].join('\n');
  fs.writeFileSync(path.join(DOCS, `${slug}.md`), fm + body + '\n', 'utf8');
}

// --- landing (splash) page ----------------------------------------------
const about = fixCrossLinks(fixImages(intro.join('\n')))
  .split('\n')
  .filter((l) => l.trim().startsWith('>'))
  .join('\n');

const cards = [
  ['concepts', 'Key concepts', 'Glossary: processes, containers, roles, Smart-ID, QES.'],
  ['login', 'Sign in', 'Log in to the internal portal to start signing.'],
  ['initiating', 'Start a process', 'Upload, add signers, roles, due dates, Sign First.'],
  ['signing', 'Sign with Smart-ID', 'Authenticate and sign on the external portal.'],
  ['tracking', 'Track progress', 'History, statuses, Completed vs Finished, drafts.'],
  ['appendix', 'Reference & FAQ', 'Methods by country and frequently asked questions.'],
];

const index = `---
title: TrustLynx SignBox
description: A complete, illustrated guide to the TrustLynx SignBox e-signing portal — sign in, initiate a signing process, and sign documents with Smart-ID.
template: splash
hero:
  tagline: Electronic signing, end&#8209;to&#8209;end — a complete, illustrated guide to initiating and signing documents in SignBox.
  actions:
    - text: Get started
      link: ${BASE}/concepts/
      icon: right-arrow
      variant: primary
    - text: Sign a document
      link: ${BASE}/signing/
      icon: external
      variant: minimal
---

import { Card, CardGrid, LinkCard } from '@astrojs/starlight/components';

<CardGrid>
${cards
  .map(
    ([slug, title, desc]) =>
      `  <LinkCard title=${yaml(title)} href="${BASE}/${slug}/" description=${yaml(desc)} />`
  )
  .join('\n')}
</CardGrid>

${about}
`;
fs.writeFileSync(path.join(DOCS, 'index.mdx'), index, 'utf8');

// --- copy screenshots into the site --------------------------------------
rmrf(PUB_IMAGES);
ensure(PUB_IMAGES);
let copied = 0;
for (const f of fs.readdirSync(SRC_IMAGES)) {
  if (/\.(png|jpe?g|gif|webp|svg)$/i.test(f)) {
    fs.copyFileSync(path.join(SRC_IMAGES, f), path.join(PUB_IMAGES, f));
    copied++;
  }
}

const pages = sections.filter((s) => !s.skip && s.num && SLUG[s.num]).length;
console.log(`[build-content] ${pages} section pages + index, ${copied} images copied.`);
