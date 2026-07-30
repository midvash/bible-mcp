import { describe, expect, it } from 'vitest';
import { BOOKS } from '../data/books';
import { TOOLS } from '../tools';
import { dualResult, structuredVerse, versionFields } from './structured';
import { VERSIONS } from '../data/versions';

const JOHN = BOOKS.find((b) => b.id === 43)!;
const NVI = VERSIONS.find((v) => v.slug === 'nvi')!;

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
    expect(versionFields(NVI)).toEqual({
      version: 'nvi',
      version_name: 'Nova Versão Internacional',
    });
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
