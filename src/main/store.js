import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { scryptSync, randomBytes, createCipheriv, createDecipheriv, randomUUID } from 'crypto';
import { app } from 'electron';

const filePath = () => join(app.getPath('userData'), 'entries.jsonl.enc');
const key = scryptSync('change-me-passphrase', 'fixed-salt', 32);
const algorithm = 'aes-256-gcm';

function encrypt(text) {
  const iv = randomBytes(12);
  const cipher = createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}

function decrypt(blob) {
  const data = Buffer.from(blob, 'base64');
  const iv = data.subarray(0, 12);
  const tag = data.subarray(12, 28);
  const enc = data.subarray(28);
  const decipher = createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8');
}

function loadEntries() {
  if (!existsSync(filePath())) return [];
  const raw = decrypt(readFileSync(filePath(), 'utf8'));
  return raw.split('\n').filter(Boolean).map(line => JSON.parse(line));
}

function saveEntry(entry) {
  const entries = loadEntries();
  const next = { id: randomUUID(), createdAt: new Date().toISOString(), ...entry };
  entries.push(next);
  const content = entries.map(e => JSON.stringify(e)).join('\n');
  writeFileSync(filePath(), encrypt(content), 'utf8');
  return next;
}

export default { loadEntries, saveEntry };