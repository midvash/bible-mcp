import { describe, expect, it } from 'vitest';
import { BOOKS } from '../data/books';
import { TOOLS } from '../tools';
import { dualResult, readerUrl, structuredVerse, versionFields } from './structured';
import { VERSIONS } from '../data/versions';

const JOHN = BOOKS.find((b) => b.id === 43)!;
const KJV = VERSIONS.find((v) => v.slug === 'kjv')!;
const ONBV = VERSIONS.find((v) => v.slug === 'onbv')!;

describe('structuredVerse', () => {
  it('names the book in the requested locale', () => {
    expect(structuredVerse(JOHN, 'pt-br', 3, 16, 'texto').book).toBe('João');
    expect(structuredVerse(JOHN, 'en', 3, 16, 'text').book).toBe('John');
  });

  it('carries the canonical book id alongside the name', () => {
    // O nome muda com o idioma; o id é a chave estável.
    expect(structuredVerse(JOHN, 'ko', 3, 16, 'x').book_id).toBe(43);
  });
});

describe('dualResult', () => {
  it('keeps the text content the spec requires and adds the data', () => {
    const result = dualResult('# markdown', { verses: [] });
    expect(result.content[0].text).toBe('# markdown');
    expect(result.structuredContent).toEqual({ verses: [] });
    expect(result.isError).toBeUndefined();
  });
});

describe('versionFields', () => {
  it('exposes slug and human-readable name', () => {
    expect(versionFields(KJV)).toEqual({
      version: 'kjv',
      version_name: 'King James Version',
    });
  });

  it('carries the attribution the license requires, when there is one', () => {
    expect(versionFields(ONBV).copyright).toContain('CC BY-SA 4.0');
    expect(versionFields(KJV)).not.toHaveProperty('copyright');
  });
});

describe('outputSchema contract', () => {
  const withSchema = TOOLS.filter((t) => t.definition.outputSchema);

  it('is declared by the tools that return data', () => {
    expect(withSchema.map((t) => t.definition.name).sort()).toEqual([
      'get_chapter',
      'get_cross_references',
      'get_passage',
      'get_strongs',
      'get_verse',
      'search_bible',
    ]);
  });

  it('declares an object schema with required fields', () => {
    // Declarar outputSchema é um contrato: a resposta precisa validar contra
    // ele. Um schema vazio ou sem required não é contrato nenhum.
    for (const tool of withSchema) {
      const schema = tool.definition.outputSchema!;
      expect(schema.type, tool.definition.name).toBe('object');
      expect(Object.keys(schema.properties).length, tool.definition.name).toBeGreaterThan(0);
      expect(schema.required?.length, tool.definition.name).toBeGreaterThan(0);
    }
  });

  it('only requires fields it also declares', () => {
    for (const tool of withSchema) {
      const schema = tool.definition.outputSchema!;
      for (const field of schema.required ?? []) {
        expect(schema.properties, `${tool.definition.name}.${field}`).toHaveProperty(
          field,
        );
      }
    }
  });
});

describe('readerUrl', () => {
  const BSB = VERSIONS.find((v) => v.slug === 'bsb')!;
  const SYNODAL = VERSIONS.find((v) => v.slug === 'synodal')!;
  const PSALMS = BOOKS.find((b) => b.id === 19)!;

  it('opens the reader in the version language, as the site publishes it', () => {
    expect(readerUrl(ONBV, JOHN, 3)).toBe('https://midvash.com/pt-br/onbv/joao/3');
    expect(readerUrl(ONBV, JOHN, 3, 16, 18)).toBe('https://midvash.com/pt-br/onbv/joao/3#v=16-18');
  });

  it('keeps English versions unprefixed', () => {
    expect(readerUrl(BSB, JOHN, 3, 16)).toBe('https://midvash.com/bsb/john/3#v=16');
    expect(readerUrl(BSB, JOHN, 3, 16, 16)).toBe('https://midvash.com/bsb/john/3#v=16');
  });

  it('encodes non-Latin book slugs', () => {
    expect(readerUrl(SYNODAL, PSALMS, 23)).toBe(
      'https://midvash.com/ru/synodal/%D0%BF%D1%81%D0%B0%D0%BB%D1%82%D0%B8%D1%80%D1%8C/23',
    );
  });
});
