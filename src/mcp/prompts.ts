/**
 * Prompts do MCP: fluxos de estudo prontos, para o usuário não ter de montar
 * na mão a sequência de tools que já existe aqui.
 *
 * Cada prompt devolve uma mensagem de usuário que descreve a tarefa e diz
 * quais tools usar. Ela é sugestão para o modelo do cliente, não instrução
 * para este servidor — o servidor só monta o texto.
 */

export interface PromptArgument {
  name: string;
  description: string;
  required?: boolean;
}

export interface PromptDefinition {
  name: string;
  title: string;
  description: string;
  arguments: PromptArgument[];
  /** Monta a mensagem a partir dos argumentos já validados. */
  build: (args: Record<string, string>) => string;
}

const REFERENCE_ARG: PromptArgument = {
  name: 'reference',
  description: 'The passage to work from, such as "Romans 8:1-11" or "Salmos 23".',
  required: true,
};

export const PROMPTS: PromptDefinition[] = [
  {
    name: 'sermon-prep',
    title: 'Prepare a sermon',
    description:
      'Builds a sermon outline from a passage: context, structure, the thread of the argument, and where it lands.',
    arguments: [
      REFERENCE_ARG,
      {
        name: 'audience',
        description:
          'Who will hear it — "youth group", "Sunday service", "small group". Shapes the tone and the examples.',
      },
    ],
    build: ({ reference, audience }) =>
      [
        `Prepare a sermon on ${reference}.`,
        '',
        'Work in this order:',
        `1. Read the passage with get_passage, and read the surrounding chapter for context.`,
        `2. Call get_commentary on ${reference} for the chapter's background.`,
        `3. Call get_cross_references on the key verse to see what else in Scripture speaks to it.`,
        `4. Where a word carries the weight, check it with get_strongs.`,
        '',
        'Then give me: the context the passage sits in, an outline of three or four movements,',
        'the one idea the passage is actually making, and a closing application.',
        audience
          ? `\nThe audience is ${audience} — pitch the tone and the examples for them.`
          : '',
        '',
        'Quote the text you rely on. Do not invent references.',
      ]
        .filter(Boolean)
        .join('\n'),
  },
  {
    name: 'devotional',
    title: 'Write a devotional',
    description:
      'A short daily reading on a passage: what it says, what it asks, and a prayer.',
    arguments: [REFERENCE_ARG],
    build: ({ reference }) =>
      [
        `Write a short devotional on ${reference}.`,
        '',
        `Read it with get_passage first, and check get_commentary for the chapter's context so the`,
        'reading does not drift from what the passage means.',
        '',
        'Keep it to four short parts: the passage itself, what it is saying, one honest question it',
        'puts to the reader, and a brief prayer. Plain language. No filler.',
      ].join('\n'),
  },
  {
    name: 'word-study',
    title: 'Study a word',
    description:
      'Traces a word through the original language: its Strong\'s entry, its senses, and how the passage uses it.',
    arguments: [
      {
        name: 'word',
        description:
          'The word to study, in any language — "love", "amor", "ἀγάπη", "H430".',
        required: true,
      },
      {
        name: 'reference',
        description: 'Optional passage to ground the study in, such as "1 Coríntios 13:4".',
      },
    ],
    build: ({ word, reference }) =>
      [
        `Study the word "${word}"${reference ? ` as it is used in ${reference}` : ''}.`,
        '',
        `1. Call get_strongs on "${word}" for the lemma, the senses, and how the KJV renders it.`,
        reference
          ? `2. Read ${reference} with get_passage, and compare renderings with compare_passage.`
          : '2. Use search_bible to find passages where the idea appears.',
        '3. Use get_cross_references on the clearest verse to see the wider pattern.',
        '',
        'Then tell me what the word carries that an English translation flattens, and where the',
        'translations you compared actually diverge.',
        '',
        'Note: this server has no word-by-word alignment between a verse and its Strong\'s numbers.',
        'If you are unsure which entry a given word maps to, say so rather than guessing.',
      ].join('\n'),
  },
  {
    name: 'compare-translations',
    title: 'Compare translations',
    description:
      'Puts a passage side by side across versions and reports what actually differs.',
    arguments: [
      REFERENCE_ARG,
      {
        name: 'versions',
        description:
          'Comma-separated version slugs, such as "nvi,ara,kjv". Defaults to the connection versions.',
      },
    ],
    build: ({ reference, versions }) =>
      [
        `Compare how translations render ${reference}.`,
        '',
        `Call compare_passage on ${reference}${
          versions ? ` with versions ${versions}` : ''
        }.`,
        '',
        'Report what actually differs — a word choice, a clause order, a rendering that takes a side',
        'on an ambiguity. Skip the renderings that say the same thing in different words.',
        '',
        'Do not tell me which translation is correct. That is the reader\'s call. Where the',
        'divergence traces to the original wording, check it with get_strongs and say so.',
      ].join('\n'),
  },
];

export const PROMPT_BY_NAME = new Map(PROMPTS.map((p) => [p.name, p]));

/** Forma que `prompts/list` devolve — sem o construtor. */
export function listPrompts() {
  return PROMPTS.map(({ name, title, description, arguments: args }) => ({
    name,
    title,
    description,
    arguments: args,
  }));
}
