import { describe, expect, it } from 'vitest';
import { BOOKS } from '../data/books';
import type { ConnectionContext } from './context';
import {
  resolveBook,
  resolveChapter,
  resolveVerseRange,
  resolveVersion,
} from './tool-guards';

function ctx(overrides: Partial<ConnectionContext> = {}): ConnectionContext {
  return {
    allowedVersions: null,
    allowedLanguages: null,
    nanoId: 'test',
    env: {} as ConnectionContext['env'],
    ...overrides,
  };
}

const JOHN = BOOKS.find((b) => b.id === 43)!;

function message(guard: { ok: boolean } & Record<string, unknown>): string {
  if (guard.ok) throw new Error('expected a rejection');
  return guard.message as string;
}

describe('resolveVersion', () => {
  it('falls back to NVI with no argument and no connection filter', () => {
    const r = resolveVersion(ctx(), undefined);
    expect(r.ok && r.value.slug).toBe('nvi');
  });

  it('falls back to the first version allowed by the connection', () => {
    const r = resolveVersion(ctx({ allowedVersions: ['kjv', 'esv'] }), undefined);
    expect(r.ok && r.value.slug).toBe('kjv');
  });

  it('accepts a slug in any case, with surrounding space', () => {
    const r = resolveVersion(ctx(), '  KJV ');
    expect(r.ok && r.value.slug).toBe('kjv');
  });

  it('rejects an unknown slug and points at list_versions', () => {
    expect(message(resolveVersion(ctx(), 'nope'))).toContain('list_versions');
  });

  it('rejects a version the connection does not allow', () => {
    const r = resolveVersion(ctx({ allowedVersions: ['nvi'] }), 'kjv');
    expect(message(r)).toContain('not enabled');
  });

  it('rejects a version whose language the connection does not allow', () => {
    const r = resolveVersion(ctx({ allowedLanguages: ['pt-br'] }), 'kjv');
    expect(message(r)).toContain('not enabled');
  });

  it('demands the argument when required', () => {
    expect(message(resolveVersion(ctx(), undefined, { required: true }))).toContain(
      'Missing required parameter: version',
    );
  });
});

describe('resolveBook', () => {
  it('resolves localized names, slugs and abbreviations', () => {
    expect(resolveBook('John').ok).toBe(true);
    expect(resolveBook('João').ok).toBe(true);
    expect(resolveBook('1 Sm').ok).toBe(true);
  });

  it('rejects an unknown book and points at list_books', () => {
    expect(message(resolveBook('Nowhere'))).toContain('list_books');
  });

  it('demands the argument when required', () => {
    expect(message(resolveBook('', { required: true }))).toContain(
      'Missing required parameter: book',
    );
  });
});

describe('resolveChapter', () => {
  it('accepts a chapter inside the book', () => {
    expect(resolveChapter(JOHN, 3).ok).toBe(true);
  });

  it('rejects a chapter past the end of the book', () => {
    expect(message(resolveChapter(JOHN, 99))).toContain('has 21 chapters');
  });

  it('rejects zero, negatives and non-numbers', () => {
    expect(resolveChapter(JOHN, 0).ok).toBe(false);
    expect(resolveChapter(JOHN, -1).ok).toBe(false);
    expect(resolveChapter(JOHN, 'x').ok).toBe(false);
    expect(resolveChapter(JOHN, undefined).ok).toBe(false);
  });
});

describe('resolveVerseRange', () => {
  it('accepts a range inside the chapter', () => {
    const r = resolveVerseRange(JOHN, 3, 36, 16, 18);
    expect(r.ok && r.value).toEqual({ start: 16, end: 18 });
  });

  it('rejects a start past the end of the chapter', () => {
    // O total vem do texto carregado, porque varia entre versões.
    expect(message(resolveVerseRange(JOHN, 3, 36, 99, 99))).toContain(
      'has 36 verses',
    );
  });

  it('rejects an end before the start', () => {
    expect(message(resolveVerseRange(JOHN, 3, 36, 18, 16))).toContain(
      'comes before',
    );
  });

  it('rejects an end past the end of the chapter', () => {
    expect(message(resolveVerseRange(JOHN, 3, 36, 30, 99))).toContain(
      'has 36 verses',
    );
  });
});
