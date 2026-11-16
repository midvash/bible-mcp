import { describe, expect, it } from 'vitest';
import { BOOKS } from '../data/books';
import { VERSIONS } from '../data/versions';
import { formatBookList, formatChapter, formatVerse, withAttribution } from './markdown';

const JOHN = BOOKS.find((b) => b.id === 43)!;
const KJV = VERSIONS.find((v) => v.slug === 'kjv')!;
const ONBV = VERSIONS.find((v) => v.slug === 'onbv')!;
const NVA = VERSIONS.find((v) => v.slug === 'nva')!;

describe('attribution', () => {
  it('every Biblica Open version carries the credit its license asks for', () => {
    const ocv = VERSIONS.filter((v) => v.slug.startsWith('ocv-'));
    expect(ocv).toHaveLength(20);
    for (const v of ocv) {
      expect(v.copyright).toContain('CC BY-SA 4.0');
      expect(v.copyright).toContain(
        'Original work available for free at www.biblica.com and open.bible.',
      );
    }
  });

  it('every CC BY-SA version of the eBible batch carries a credit', () => {
    for (const slug of ['irv-hi', 'irv-as', 'bsa', 'ulb-ilo', 'muqeddes']) {
      expect(VERSIONS.find((v) => v.slug === slug)?.copyright).toContain('CC BY-SA 4.0');
    }
  });

  it('CC BY versions carry a credit too', () => {
    expect(VERSIONS.find((v) => v.slug === 'almeida-livre')?.copyright).toContain('Atribuição 4.0');
    expect(VERSIONS.find((v) => v.slug === 'pdt')?.copyright).toContain('CC BY 4.0');
  });

  it('ends the text of a CC BY-SA version with its credit, in italics', () => {
    const text = formatVerse(JOHN, ONBV, 3, 16, 16, ['Porque Deus amou o mundo']);
    expect(text.split('\n').at(-1)).toBe(`_${ONBV.copyright}_`);
  });

  it('adds nothing to a version that does not ask for credit', () => {
    const text = formatChapter(JOHN, KJV, 3, ['In the beginning']);
    expect(text).not.toContain('_');
  });

  it('can be left out, for callers that credit once at the end', () => {
    const text = formatChapter(JOHN, ONBV, 3, ['x'], { attribution: false });
    expect(text).not.toContain(ONBV.copyright!);
  });

  it('prints each credit once, even when a version repeats', () => {
    const text = withAttribution('body', [ONBV, KJV, ONBV, NVA]);
    expect(text).toBe(`body\n\n_${ONBV.copyright}_\n\n_${NVA.copyright}_`);
  });
});

describe('formatBookList', () => {
  it('rotula em inglês quando não vem idioma', () => {
    const text = formatBookList(BOOKS);
    expect(text).toContain('## Books of the Bible');
    expect(text).toContain('### Old Testament (39 books)');
    expect(text).toContain('### New Testament (27 books)');
    expect(text).toContain('**Genesis** (`genesis`, Gen) — 50 chapters');
    expect(text).not.toMatch(/Livros|Testamento|capítulos/);
  });

  it('usa o singular em livro de um capítulo', () => {
    const text = formatBookList(BOOKS);
    expect(text).toMatch(/\*\*Jude\*\*.* — 1 chapter$/m);
  });

  it('rotula no idioma pedido', () => {
    const text = formatBookList(BOOKS, 'pt-br');
    expect(text).toContain('## Livros da Bíblia');
    expect(text).toContain('### Antigo Testamento (39 livros)');
    expect(text).toMatch(/ — 1 capítulo$/m);
    expect(formatBookList(BOOKS, 'es')).toContain('## Libros de la Biblia');
  });
});

describe('link no título do trecho', () => {
  const NVA = VERSIONS.find((v) => v.slug === 'nva')!;
  const PSALMS = BOOKS.find((b) => b.id === 19)!;

  it('formatVerse leva o link canônico do leitor no título', () => {
    expect(formatVerse(PSALMS, NVA, 23, 1, 2, ['a', 'b'])).toContain(
      '**[Salmos 23:1-2](https://midvash.com/pt-br/nva/salmos/23#v=1-2)** (NVA)',
    );
  });

  it('formatChapter também', () => {
    expect(formatChapter(PSALMS, NVA, 23, ['a'])).toContain(
      '## [Salmos 23](https://midvash.com/pt-br/nva/salmos/23) (NVA)',
    );
  });
});
