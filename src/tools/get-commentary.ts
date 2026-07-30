import { parseReference } from '../lib/reference-parser';
import { getCommentary, STUDY_BODY_LIMIT } from '../lib/study-index';
import type { Tool, ToolResult } from '../mcp/types';
import { resolveStudyLocale } from './search-study';

function textResult(text: string, isError = false): ToolResult {
  return { content: [{ type: 'text' as const, text }], isError };
}

export const getCommentaryTool: Tool = {
  definition: {
    name: 'get_commentary',
    description:
      'Fetches the Midvash commentary for the chapter a reference points to — what the chapter is about, its context and its main movements. Every one of the 1,189 Bible chapters has one, in 9 languages. Use this for "what is this chapter about" questions. For the text itself, use get_passage. Returns a summary with a link to the full commentary.',
    inputSchema: {
      type: 'object',
      properties: {
        reference: {
          type: 'string',
          description:
            'Any Bible reference inside the chapter you want commentary on. "John 3", "João 3:16" and "Romans 8:1-11" all resolve to that chapter.',
        },
        language: {
          type: 'string',
          description:
            'Optional language for the commentary: en, pt-br, es, fr, de, it, zh, ru, ko. Defaults to the connection language, or English.',
        },
      },
      required: ['reference'],
    },
    annotations: {
      title: 'Get chapter commentary',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },

  async handler(args, ctx) {
    const referenceInput = String(args.reference ?? '').trim();
    if (!referenceInput) {
      return textResult('Missing required parameter: reference.', true);
    }

    const parsed = parseReference(referenceInput);
    if (!parsed.ok) {
      return textResult(parsed.error, true);
    }

    const resolved = resolveStudyLocale(ctx, args.language);
    if (!resolved.ok) return textResult(resolved.message, true);
    const { locale } = resolved;

    if (!ctx.env.SEARCH_DB) {
      return textResult('The study library is temporarily unavailable.', true);
    }

    const { book, chapter } = parsed.reference;
    const commentary = await getCommentary(ctx.env, locale, book, chapter);

    // Os 9 locales do índice são exatamente os 9 locales dos nomes de livro.
    const bookName = book.names[locale];

    if (!commentary) {
      return textResult(
        `No commentary available for ${bookName} ${chapter} in ${locale}.`,
      );
    }

    return textResult(
      [
        `## ${commentary.title || `${bookName} ${chapter}`}`,
        '',
        commentary.summary,
        '',
        `[Read the full commentary](${commentary.url})`,
        '',
        `_Summary of up to ${STUDY_BODY_LIMIT} characters — follow the link for the complete commentary._`,
      ].join('\n'),
    );
  },
};
