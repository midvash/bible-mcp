import { describe, expect, it } from 'vitest';
import { BOOKS } from '../data/books';
import { commentaryDeeplink, studyUrl } from './study-index';

const book = (id: number) => BOOKS.find((b) => b.id === id)!;

const GENESIS = book(1);
const FIRST_SAMUEL = book(9);
const JOHN = book(43);

describe('commentaryDeeplink', () => {
  it('omits the locale prefix for English', () => {
    expect(commentaryDeeplink('en', JOHN, 3)).toBe('/bible-commentary/john/3');
  });

  it('prefixes every other locale', () => {
    expect(commentaryDeeplink('pt-br', GENESIS, 2)).toBe(
      '/pt-br/bible-commentary/genesis/2',
    );
    expect(commentaryDeeplink('ko', JOHN, 3)).toBe(
      '/ko/bible-commentary/john/3',
    );
  });

  it('always uses the English book slug, whatever the locale', () => {
    // O seed grava o segmento em inglês mesmo nas linhas traduzidas.
    expect(commentaryDeeplink('pt-br', JOHN, 1)).toContain('/john/');
    expect(commentaryDeeplink('es', FIRST_SAMUEL, 13)).toBe(
      '/es/bible-commentary/1-samuel/13',
    );
  });
});

describe('studyUrl', () => {
  it('resolves a deeplink against the Midvash site', () => {
    expect(studyUrl('/bible-commentary/john/3')).toBe(
      'https://midvash.com/bible-commentary/john/3',
    );
  });
});
