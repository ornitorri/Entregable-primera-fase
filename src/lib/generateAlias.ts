import { query } from '@/lib/db';

function sanitizeAliasBase(value: string): string {
  const base = value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');

  return base.slice(0, 12) || 'lector';
}

async function isAliasTaken(alias: string): Promise<boolean> {
  const existing = await query('SELECT id FROM users WHERE alias = ?', [alias]) as { id: number }[];
  return existing.length > 0;
}

export async function generateUniqueAlias(seed: string): Promise<string> {
  const base = sanitizeAliasBase(seed);

  if (!(await isAliasTaken(base))) {
    return base;
  }

  for (let i = 0; i < 30; i++) {
    const candidate = `${base}${Math.floor(Math.random() * 9999) + 1}`;
    if (!(await isAliasTaken(candidate))) {
      return candidate;
    }
  }

  return `${base}${Date.now().toString().slice(-6)}`;
}
