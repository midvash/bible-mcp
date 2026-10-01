/**
 * Traduções da landing page para os 9 idiomas suportados.
 * Inglês é o idioma oficial (rota /); demais locales em /pt-br, /es,
 * /fr, /de, /it, /zh, /ru, /ko. O idioma vem só do caminho da URL: cada
 * idioma tem URL própria e indexável, sem detecção por Accept-Language.
 *
 * Copy de site Midvash: sem travessão (em-dash). Contagens (62 versões,
 * 31 idiomas, 11 tools) são conferidas em page.test.ts contra o código.
 */

export type Locale =
  | 'en'
  | 'es'
  | 'pt-br'
  | 'fr'
  | 'de'
  | 'it'
  | 'zh'
  | 'ru'
  | 'ko';

export const SUPPORTED_LOCALES: readonly Locale[] = [
  'en',
  'pt-br',
  'es',
  'fr',
  'de',
  'it',
  'zh',
  'ru',
  'ko',
] as const;

/** Nome de cada tool MCP, na ordem em que aparece na landing. */
export const LANDING_TOOLS = [
  'get_passage',
  'get_verse',
  'get_chapter',
  'search_bible',
  'compare_passage',
  'get_cross_references',
  'get_commentary',
  'search_study',
  'get_strongs',
  'list_versions',
  'list_books',
] as const;

export type LandingTool = (typeof LANDING_TOOLS)[number];

/**
 * Versão pré-marcada no configurador de cada idioma. A primeira versão do
 * link vira a padrão da conexão, então o link já nasce útil.
 */
export const DEFAULT_VERSION_BY_LOCALE: Record<Locale, string> = {
  en: 'bsb',
  'pt-br': 'onbv',
  es: 'rvr1909',
  fr: 'lsg',
  de: 'luth1912',
  it: 'nri',
  zh: 'cuvs',
  ru: 'synodal',
  ko: 'kor',
};

interface ClientCopy {
  name: string;
  tier: string;
  steps: string[];
}

export interface Translations {
  htmlLang: string;
  meta: {
    title: string;
    description: string;
  };
  nav: {
    skipToContent: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    cta: string;
    ctaSecondary: string;
    facts: string[];
  };
  uses: {
    title: string;
    subtitle: string;
    items: Array<{ who: string; prompt: string }>;
  };
  how: {
    title: string;
    cards: Array<{ num: string; title: string; body: string }>;
  };
  configure: {
    title: string;
    subtitle: string;
    languagesLabel: string;
    versionsLabel: string;
    versionsHelper: string;
    generateBtn: string;
    selectAll: string;
    clearAll: string;
    needSelection: string;
    urlLabel: string;
    urlHelper: string;
    jsonLabel: string;
    geminiLabel: string;
    copyBtn: string;
    copiedBtn: string;
    copyError: string;
  };
  clients: {
    title: string;
    subtitle: string;
    chatgpt: ClientCopy;
    claude: ClientCopy;
    gemini: ClientCopy;
    cursor: ClientCopy;
  };
  tools: {
    title: string;
    subtitle: string;
    items: Record<LandingTool, string>;
    prompts: string;
  };
  versions: {
    title: string;
    body: string;
    creditNote: string;
    creditBadge: string;
    apiCta: string;
  };
  faq: {
    title: string;
    items: Array<{ q: string; a: string }>;
  };
  more: {
    title: string;
    reader: { title: string; body: string };
    api: { title: string; body: string };
    wordpress: { title: string; body: string };
  };
  footer: {
    brandBy: string;
    productsTitle: string;
    productLabels: {
      reader: string;
      api: string;
      mcp: string;
      wordpress: string;
      chrome: string;
      ios: string;
      android: string;
    };
    openSourceTitle: string;
    allReposLabel: string;
    soonBadge: string;
    socialLabel: string;
    instagramLabel: string;
    githubLabel: string;
    tagline: string;
    copyright: string;
    creditPrefix: string;
  };
}

const en: Translations = {
  htmlLang: 'en',
  meta: {
    title: 'Bible MCP for ChatGPT, Claude and Gemini | Midvash',
    description:
      "Free Bible MCP: connect ChatGPT, Claude, Gemini or Cursor to 62 free Bible versions in 31 languages, plus commentary and Strong's. No account, no key.",
  },
  nav: {
    skipToContent: 'Skip to content',
  },
  hero: {
    eyebrow: 'Free · No account · No API key',
    title: 'Connect your AI to the',
    titleAccent: 'Bible',
    subtitle:
      'Your AI stops quoting Scripture from memory. With Midvash it reads the real text in 62 free Bible versions and 31 languages, searches it, compares translations and explains every chapter. Works in ChatGPT, Claude, Gemini and Cursor.',
    cta: 'Create my link',
    ctaSecondary: 'See what you can ask',
    facts: ['62 versions in 31 languages', '11 study tools', 'Commentary on all 1,189 chapters'],
  },
  uses: {
    title: 'Made for people who study the Bible',
    subtitle: 'You do not need to be a developer. Ask in plain words and the AI looks it up for you, with the reference.',
    items: [
      { who: 'Pastors', prompt: '“Help me outline a sermon on Romans 8:28-39 and compare the BSB with the KJV.”' },
      { who: 'Bible class teachers', prompt: '“List cross-references for John 3:16 that I can use in Sunday’s lesson.”' },
      { who: 'Students', prompt: '“What does the Greek word agape mean, and where does it appear in 1 Corinthians 13?”' },
      { who: 'Daily devotion', prompt: '“Read Psalm 23 in the World English Bible and explain what the chapter is about.”' },
    ],
  },
  how: {
    title: 'How it works',
    cards: [
      {
        num: '01',
        title: 'Pick your Bibles',
        body: 'Choose the versions your AI should use, such as BSB, KJV or WEB. Every version is public domain or openly licensed.',
      },
      {
        num: '02',
        title: 'Copy your link',
        body: 'We create a personal link for you. No account, no email, nothing to install.',
      },
      {
        num: '03',
        title: 'Paste it into your AI',
        body: 'Add the link as a connector in ChatGPT, Claude, Gemini or Cursor. From then on, the AI looks up the real text and cites the reference.',
      },
    ],
  },
  configure: {
    title: 'Create your link',
    subtitle: 'Pick the Bible versions your AI should use. The first one you check becomes the default.',
    languagesLabel: '1. Filter by language',
    versionsLabel: '2. Choose your Bible versions',
    versionsHelper: 'Tip: 2 or 3 versions give the cleanest answers.',
    generateBtn: 'Create my link',
    selectAll: 'Select all shown',
    clearAll: 'Clear',
    needSelection: 'Please select at least one Bible version.',
    urlLabel: 'Your connection link',
    urlHelper: 'Paste this link in ChatGPT or Claude. The steps are just below.',
    jsonLabel: 'For Cursor and other editors (mcp.json)',
    geminiLabel: 'For Gemini CLI (run in your terminal)',
    copyBtn: 'Copy',
    copiedBtn: 'Copied!',
    copyError: "Couldn't copy to clipboard.",
  },
  clients: {
    title: 'Add it to your AI',
    subtitle: 'Use the link you created above. It takes about a minute.',
    chatgpt: {
      name: 'ChatGPT',
      tier: 'Plus, Pro, Business, Enterprise or Edu',
      steps: [
        'Go to Settings › Apps and turn on Developer mode (under Advanced settings)',
        'Click Create app, name it Midvash, paste your link and choose no authentication',
        'In a chat, click + and turn on Midvash',
      ],
    },
    claude: {
      name: 'Claude',
      tier: 'Free (1 custom connector), Pro, Max, Team or Enterprise',
      steps: [
        'On claude.ai, go to Customize › Connectors',
        'Click + › Add custom connector and paste your link',
        'In a chat, click + › Connectors and turn on Midvash',
      ],
    },
    gemini: {
      name: 'Gemini',
      tier: 'Gemini CLI, in the terminal',
      steps: [
        'Install Gemini CLI on your computer',
        'Run the command shown under your link',
        'Start gemini and ask about any passage',
      ],
    },
    cursor: {
      name: 'Cursor',
      tier: 'Desktop editor',
      steps: [
        'Open Cursor Settings and go to the MCP section',
        'Add a new MCP server (this opens mcp.json)',
        'Paste the JSON shown under your link and save',
      ],
    },
  },
  tools: {
    title: 'What your AI can do',
    subtitle: 'Eleven tools your AI calls on its own, whenever the question needs them.',
    items: {
      get_passage: 'Reads any passage from a reference such as “John 3:16-18”.',
      get_verse: 'Fetches one verse or a range of verses.',
      get_chapter: 'Reads a whole chapter.',
      search_bible: 'Finds verses by word or exact phrase, in every language of the catalog.',
      compare_passage: 'Shows the same passage side by side in several versions.',
      get_cross_references: 'Lists related passages, with their text, from 343,546 links.',
      get_commentary: 'Explains what a chapter is about. All 1,189 chapters, in 9 languages.',
      search_study: 'Searches commentaries, Bible characters, dictionary entries and theology articles.',
      get_strongs: "Explains Hebrew and Greek words with Strong's lexicon (14,197 entries).",
      list_versions: 'Lists the versions available on your link.',
      list_books: 'Lists the 66 books of the Bible.',
    },
    prompts: 'It also brings four ready-made prompts: sermon preparation, devotional, word study and translation comparison.',
  },
  versions: {
    title: 'Versions and licenses',
    body: 'The catalog has 62 versions in 31 languages, the same one served by the public Midvash API. Only versions in the public domain or under an open license are included, so the AI can quote them freely. Translations with reserved rights are not available here.',
    creditNote: 'Versions marked “credit” use licenses such as Creative Commons. The AI receives the credit line at the end of every text from them.',
    creditBadge: 'credit',
    apiCta: 'Need this text in your own app or site? Use the free Bible API',
  },
  faq: {
    title: 'Frequently asked questions',
    items: [
      {
        q: 'Is it really free?',
        a: 'Yes. No account, no API key and no ads. What may cost something is the AI itself: ChatGPT only accepts custom apps on paid plans, while Claude allows one custom connector on the free plan.',
      },
      {
        q: 'Do I need to know how to code?',
        a: 'No. You copy a link and paste it in your AI settings. The JSON and the terminal command are only for Cursor and Gemini CLI.',
      },
      {
        q: 'Which Bible version does the AI use?',
        a: 'The first version on your link. You can ask for any other version on your link by name. A link with no version uses the Berean Standard Bible (BSB), in English.',
      },
      {
        q: 'Why is my favorite translation missing?',
        a: 'Many popular translations have reserved rights and cannot be redistributed. Here we only include versions in the public domain or under an open license. You can read many more on midvash.com.',
      },
      {
        q: 'Does search work in Hebrew, Greek and Arabic?',
        a: 'Yes. Search works in every language of the catalog, ignores accents and letter case, and finds Hebrew and Arabic words typed without vowel marks.',
      },
      {
        q: 'Do you store what I ask?',
        a: 'No. Your link only says which versions to use. We do not ask who you are and we do not store your questions.',
      },
    ],
  },
  more: {
    title: 'More from Midvash',
    reader: {
      title: 'Midvash: Bible & Devotional',
      body: 'Read the Bible, follow a daily devotional and study with commentary on the web, iPhone and Android.',
    },
    api: {
      title: 'Bible API',
      body: 'The same catalog as JSON, free and with no key, for developers who want Bible text in their own apps.',
    },
    wordpress: {
      title: 'WordPress plugin',
      body: 'Turns Bible references on your church or ministry site into verses readers can open in place.',
    },
  },
  footer: {
    brandBy: 'by Midvash',
    productsTitle: 'Products',
    productLabels: {
      reader: 'Bible reader',
      api: 'Bible API',
      mcp: 'Bible MCP',
      wordpress: 'WordPress plugin',
      chrome: 'Chrome extension',
      ios: 'iOS app',
      android: 'Android app',
    },
    openSourceTitle: 'Open source',
    allReposLabel: 'All repositories →',
    soonBadge: 'Soon',
    socialLabel: 'Follow us',
    instagramLabel: 'Visit our Instagram',
    githubLabel: 'Visit our GitHub',
    tagline: 'Open source · Free forever · No signup',
    copyright: `© 2025-${new Date().getFullYear()} Midvash. All rights reserved.`,
    creditPrefix: 'Developed by',
  },
};

const ptBr: Translations = {
  htmlLang: 'pt-BR',
  meta: {
    title: 'MCP da Bíblia para ChatGPT, Claude e Gemini | Midvash',
    description:
      'MCP da Bíblia grátis: conecte ChatGPT, Claude, Gemini ou Cursor a 62 versões livres em 31 idiomas, com comentários e Strong. Sem conta e sem chave.',
  },
  nav: {
    skipToContent: 'Pular para o conteúdo',
  },
  hero: {
    eyebrow: 'Grátis · Sem conta · Sem chave de API',
    title: 'Conecte sua IA à',
    titleAccent: 'Bíblia',
    subtitle:
      'Sua IA para de citar a Bíblia de memória. Com o Midvash ela lê o texto de verdade em 62 versões bíblicas livres e 31 idiomas, faz buscas, compara traduções e explica cada capítulo. Funciona no ChatGPT, Claude, Gemini e Cursor.',
    cta: 'Criar meu link',
    ctaSecondary: 'Veja o que dá pra pedir',
    facts: ['62 versões em 31 idiomas', '11 ferramentas de estudo', 'Comentário dos 1.189 capítulos'],
  },
  uses: {
    title: 'Feito pra quem estuda a Bíblia',
    subtitle: 'Não precisa ser programador. Peça com suas palavras e a IA busca pra você, com a referência.',
    items: [
      { who: 'Pastores', prompt: '“Me ajude a esboçar um sermão sobre Romanos 8:28-39 e compare a ONBV com a Almeida Livre.”' },
      { who: 'Professores de escola bíblica', prompt: '“Liste referências cruzadas de João 3:16 pra eu usar na aula de domingo.”' },
      { who: 'Estudantes', prompt: '“O que significa a palavra grega ágape e onde ela aparece em 1 Coríntios 13?”' },
      { who: 'Devocional diário', prompt: '“Leia o Salmo 23 na NVA e explique do que o capítulo trata.”' },
    ],
  },
  how: {
    title: 'Como funciona',
    cards: [
      {
        num: '01',
        title: 'Escolha suas Bíblias',
        body: 'Escolha as versões que sua IA vai usar, como ONBV, Almeida Livre ou NVA. Todas são de domínio público ou de licença aberta.',
      },
      {
        num: '02',
        title: 'Copie seu link',
        body: 'Geramos um link pessoal pra você. Sem conta, sem e-mail, sem instalar nada.',
      },
      {
        num: '03',
        title: 'Cole na sua IA',
        body: 'Adicione o link como conector no ChatGPT, Claude, Gemini ou Cursor. A partir daí a IA consulta o texto real e cita a referência.',
      },
    ],
  },
  configure: {
    title: 'Crie seu link',
    subtitle: 'Escolha as versões da Bíblia que sua IA vai usar. A primeira que você marcar vira a padrão.',
    languagesLabel: '1. Filtre por idioma',
    versionsLabel: '2. Escolha as versões da Bíblia',
    versionsHelper: 'Dica: 2 ou 3 versões deixam as respostas mais claras.',
    generateBtn: 'Criar meu link',
    selectAll: 'Marcar as visíveis',
    clearAll: 'Limpar',
    needSelection: 'Selecione pelo menos uma versão da Bíblia.',
    urlLabel: 'Seu link de conexão',
    urlHelper: 'Cole este link no ChatGPT ou no Claude. O passo a passo está logo abaixo.',
    jsonLabel: 'Para o Cursor e outros editores (mcp.json)',
    geminiLabel: 'Para o Gemini CLI (rode no terminal)',
    copyBtn: 'Copiar',
    copiedBtn: 'Copiado!',
    copyError: 'Não foi possível copiar.',
  },
  clients: {
    title: 'Adicione na sua IA',
    subtitle: 'Use o link que você criou acima. Leva cerca de um minuto.',
    chatgpt: {
      name: 'ChatGPT',
      tier: 'Plus, Pro, Business, Enterprise ou Edu',
      steps: [
        'Vá em Configurações › Aplicativos e ative o Modo desenvolvedor (em Configurações avançadas)',
        'Clique em Criar app, dê o nome Midvash, cole seu link e escolha sem autenticação',
        'Numa conversa, clique em + e ative o Midvash',
      ],
    },
    claude: {
      name: 'Claude',
      tier: 'Gratuito (1 conector personalizado), Pro, Max, Team ou Enterprise',
      steps: [
        'No claude.ai, vá em Personalizar › Conectores',
        'Clique em + › Adicionar conector personalizado e cole seu link',
        'Numa conversa, clique em + › Conectores e ative o Midvash',
      ],
    },
    gemini: {
      name: 'Gemini',
      tier: 'Gemini CLI, no terminal',
      steps: [
        'Instale o Gemini CLI no seu computador',
        'Rode o comando que aparece abaixo do seu link',
        'Abra o gemini e pergunte sobre qualquer passagem',
      ],
    },
    cursor: {
      name: 'Cursor',
      tier: 'Editor no computador',
      steps: [
        'Abra as configurações do Cursor e vá na seção MCP',
        'Adicione um novo servidor MCP (isso abre o mcp.json)',
        'Cole o JSON que aparece abaixo do seu link e salve',
      ],
    },
  },
  tools: {
    title: 'O que sua IA passa a fazer',
    subtitle: 'Onze ferramentas que a IA usa sozinha, sempre que a pergunta pede.',
    items: {
      get_passage: 'Lê qualquer passagem a partir de uma referência como “João 3:16-18”.',
      get_verse: 'Busca um versículo ou um intervalo de versículos.',
      get_chapter: 'Lê um capítulo inteiro.',
      search_bible: 'Acha versículos por palavra ou frase exata, em todos os idiomas do catálogo.',
      compare_passage: 'Mostra a mesma passagem lado a lado em várias versões.',
      get_cross_references: 'Lista passagens relacionadas, com o texto, entre 343.546 ligações.',
      get_commentary: 'Explica do que trata um capítulo. Os 1.189 capítulos, em 9 idiomas.',
      search_study: 'Busca em comentários, personagens bíblicos, dicionário e artigos de teologia.',
      get_strongs: 'Explica palavras do hebraico e do grego com o léxico de Strong (14.197 verbetes).',
      list_versions: 'Lista as versões disponíveis no seu link.',
      list_books: 'Lista os 66 livros da Bíblia.',
    },
    prompts: 'Também traz quatro roteiros prontos: preparo de sermão, devocional, estudo de palavra e comparação de traduções.',
  },
  versions: {
    title: 'Versões e licenças',
    body: 'O catálogo tem 62 versões em 31 idiomas, o mesmo da API pública do Midvash. Só entram versões de domínio público ou com licença aberta, que a IA pode citar livremente. Traduções com direitos reservados não estão disponíveis aqui.',
    creditNote: 'As versões marcadas com “crédito” usam licenças como Creative Commons. A IA recebe a linha de crédito no fim de todo texto delas.',
    creditBadge: 'crédito',
    apiCta: 'Precisa desse texto no seu app ou site? Use a API da Bíblia, gratuita',
  },
  faq: {
    title: 'Perguntas frequentes',
    items: [
      {
        q: 'É gratuito mesmo?',
        a: 'Sim. Sem conta, sem chave de API e sem anúncios. O que pode ter custo é a própria IA: o ChatGPT só aceita apps personalizados nos planos pagos, e o Claude permite um conector personalizado no plano gratuito.',
      },
      {
        q: 'Preciso saber programar?',
        a: 'Não. Você copia um link e cola nas configurações da sua IA. O JSON e o comando de terminal são só pro Cursor e o Gemini CLI.',
      },
      {
        q: 'Qual versão da Bíblia a IA usa?',
        a: 'A primeira versão do seu link. Você pode pedir qualquer outra versão do link pelo nome. Um link sem versão usa a Berean Standard Bible (BSB), em inglês.',
      },
      {
        q: 'Por que minha tradução favorita não está aqui?',
        a: 'Muitas traduções conhecidas têm direitos reservados e não podem ser redistribuídas. Aqui só entram versões de domínio público ou com licença aberta. No midvash.com você lê muitas outras.',
      },
      {
        q: 'A busca funciona em hebraico, grego e árabe?',
        a: 'Sim. A busca funciona em todos os idiomas do catálogo, ignora acentos e maiúsculas e acha palavras em hebraico e árabe digitadas sem sinais de vogal.',
      },
      {
        q: 'Vocês guardam o que eu pergunto?',
        a: 'Não. Seu link só diz quais versões usar. Não pedimos quem você é e não guardamos suas perguntas.',
      },
    ],
  },
  more: {
    title: 'Mais do Midvash',
    reader: {
      title: 'Midvash: Bíblia & Devocional',
      body: 'Leia a Bíblia, siga um devocional diário e estude com comentários na web, no iPhone e no Android.',
    },
    api: {
      title: 'API da Bíblia',
      body: 'O mesmo catálogo em JSON, gratuito e sem chave, pra quem desenvolve e quer o texto bíblico no próprio app.',
    },
    wordpress: {
      title: 'Plugin para WordPress',
      body: 'Transforma referências bíblicas do site da sua igreja ou ministério em versículos que o leitor abre ali mesmo.',
    },
  },
  footer: {
    brandBy: 'por Midvash',
    productsTitle: 'Produtos',
    productLabels: {
      reader: 'Leitor da Bíblia',
      api: 'API da Bíblia',
      mcp: 'MCP da Bíblia',
      wordpress: 'Plugin para WordPress',
      chrome: 'Extensão do Chrome',
      ios: 'App iOS',
      android: 'App Android',
    },
    openSourceTitle: 'Código aberto',
    allReposLabel: 'Todos os repositórios →',
    soonBadge: 'Em breve',
    socialLabel: 'Siga a gente',
    instagramLabel: 'Visite nosso Instagram',
    githubLabel: 'Visite nosso GitHub',
    tagline: 'Código aberto · Grátis para sempre · Sem cadastro',
    copyright: `© 2025-${new Date().getFullYear()} Midvash. Todos os direitos reservados.`,
    creditPrefix: 'Desenvolvido por',
  },
};

const es: Translations = {
  htmlLang: 'es',
  meta: {
    title: 'MCP de la Biblia para ChatGPT, Claude y Gemini | Midvash',
    description:
      'MCP de la Biblia gratis: conecta ChatGPT, Claude, Gemini o Cursor a 62 versiones libres en 31 idiomas, con comentarios y Strong. Sin cuenta ni clave.',
  },
  nav: {
    skipToContent: 'Saltar al contenido',
  },
  hero: {
    eyebrow: 'Gratis · Sin cuenta · Sin clave de API',
    title: 'Conecta tu IA a la',
    titleAccent: 'Biblia',
    subtitle:
      'Tu IA deja de citar la Biblia de memoria. Con Midvash lee el texto real en 62 versiones bíblicas libres y 31 idiomas, busca, compara traducciones y explica cada capítulo. Funciona en ChatGPT, Claude, Gemini y Cursor.',
    cta: 'Crear mi enlace',
    ctaSecondary: 'Mira lo que puedes pedir',
    facts: ['62 versiones en 31 idiomas', '11 herramientas de estudio', 'Comentario de los 1.189 capítulos'],
  },
  uses: {
    title: 'Hecho para quien estudia la Biblia',
    subtitle: 'No necesitas ser programador. Pide con tus palabras y la IA lo busca por ti, con la referencia.',
    items: [
      { who: 'Pastores', prompt: '“Ayúdame a bosquejar un sermón sobre Romanos 8:28-39 y compara la RVR1909 con la RVG.”' },
      { who: 'Maestros de escuela bíblica', prompt: '“Dame referencias cruzadas de Juan 3:16 para la clase del domingo.”' },
      { who: 'Estudiantes', prompt: '“¿Qué significa la palabra griega ágape y dónde aparece en 1 Corintios 13?”' },
      { who: 'Devocional diario', prompt: '“Lee el Salmo 23 en la Reina-Valera 1909 y explica de qué trata el capítulo.”' },
    ],
  },
  how: {
    title: 'Cómo funciona',
    cards: [
      {
        num: '01',
        title: 'Elige tus Biblias',
        body: 'Elige las versiones que usará tu IA, como RVR1909, RVG o la Biblia del Oso. Todas son de dominio público o de licencia abierta.',
      },
      {
        num: '02',
        title: 'Copia tu enlace',
        body: 'Creamos un enlace personal para ti. Sin cuenta, sin correo, sin instalar nada.',
      },
      {
        num: '03',
        title: 'Pégalo en tu IA',
        body: 'Añade el enlace como conector en ChatGPT, Claude, Gemini o Cursor. Desde entonces la IA consulta el texto real y cita la referencia.',
      },
    ],
  },
  configure: {
    title: 'Crea tu enlace',
    subtitle: 'Elige las versiones de la Biblia que usará tu IA. La primera que marques será la predeterminada.',
    languagesLabel: '1. Filtra por idioma',
    versionsLabel: '2. Elige las versiones de la Biblia',
    versionsHelper: 'Consejo: 2 o 3 versiones dan respuestas más claras.',
    generateBtn: 'Crear mi enlace',
    selectAll: 'Marcar las visibles',
    clearAll: 'Limpiar',
    needSelection: 'Selecciona al menos una versión de la Biblia.',
    urlLabel: 'Tu enlace de conexión',
    urlHelper: 'Pega este enlace en ChatGPT o Claude. Los pasos están justo abajo.',
    jsonLabel: 'Para Cursor y otros editores (mcp.json)',
    geminiLabel: 'Para Gemini CLI (ejecútalo en la terminal)',
    copyBtn: 'Copiar',
    copiedBtn: '¡Copiado!',
    copyError: 'No se pudo copiar al portapapeles.',
  },
  clients: {
    title: 'Añádelo a tu IA',
    subtitle: 'Usa el enlace que creaste arriba. Toma más o menos un minuto.',
    chatgpt: {
      name: 'ChatGPT',
      tier: 'Plus, Pro, Business, Enterprise o Edu',
      steps: [
        'Ve a Configuración › Aplicaciones y activa el Modo desarrollador (en Configuración avanzada)',
        'Haz clic en Crear app, llámala Midvash, pega tu enlace y elige sin autenticación',
        'En un chat, haz clic en + y activa Midvash',
      ],
    },
    claude: {
      name: 'Claude',
      tier: 'Gratis (1 conector personalizado), Pro, Max, Team o Enterprise',
      steps: [
        'En claude.ai, ve a Personalizar › Conectores',
        'Haz clic en + › Añadir conector personalizado y pega tu enlace',
        'En un chat, haz clic en + › Conectores y activa Midvash',
      ],
    },
    gemini: {
      name: 'Gemini',
      tier: 'Gemini CLI, en la terminal',
      steps: [
        'Instala Gemini CLI en tu computadora',
        'Ejecuta el comando que aparece debajo de tu enlace',
        'Abre gemini y pregunta por cualquier pasaje',
      ],
    },
    cursor: {
      name: 'Cursor',
      tier: 'Editor de escritorio',
      steps: [
        'Abre la configuración de Cursor y ve a la sección MCP',
        'Añade un nuevo servidor MCP (se abre mcp.json)',
        'Pega el JSON que aparece debajo de tu enlace y guarda',
      ],
    },
  },
  tools: {
    title: 'Lo que tu IA puede hacer',
    subtitle: 'Once herramientas que la IA usa por su cuenta cuando la pregunta lo necesita.',
    items: {
      get_passage: 'Lee cualquier pasaje a partir de una referencia como “Juan 3:16-18”.',
      get_verse: 'Trae un versículo o un rango de versículos.',
      get_chapter: 'Lee un capítulo entero.',
      search_bible: 'Encuentra versículos por palabra o frase exacta, en todos los idiomas del catálogo.',
      compare_passage: 'Muestra el mismo pasaje lado a lado en varias versiones.',
      get_cross_references: 'Lista pasajes relacionados, con su texto, entre 343.546 conexiones.',
      get_commentary: 'Explica de qué trata un capítulo. Los 1.189 capítulos, en 9 idiomas.',
      search_study: 'Busca en comentarios, personajes bíblicos, diccionario y artículos de teología.',
      get_strongs: 'Explica palabras del hebreo y del griego con el léxico de Strong (14.197 entradas).',
      list_versions: 'Lista las versiones disponibles en tu enlace.',
      list_books: 'Lista los 66 libros de la Biblia.',
    },
    prompts: 'También trae cuatro guías listas: preparación de sermón, devocional, estudio de palabra y comparación de traducciones.',
  },
  versions: {
    title: 'Versiones y licencias',
    body: 'El catálogo tiene 62 versiones en 31 idiomas, el mismo de la API pública de Midvash. Solo entran versiones de dominio público o con licencia abierta, que la IA puede citar libremente. Las traducciones con derechos reservados no están disponibles aquí.',
    creditNote: 'Las versiones marcadas con “crédito” usan licencias como Creative Commons. La IA recibe la línea de crédito al final de cada texto.',
    creditBadge: 'crédito',
    apiCta: '¿Necesitas este texto en tu app o sitio? Usa la API de la Biblia, gratuita',
  },
  faq: {
    title: 'Preguntas frecuentes',
    items: [
      {
        q: '¿De verdad es gratis?',
        a: 'Sí. Sin cuenta, sin clave de API y sin anuncios. Lo que puede costar es la IA misma: ChatGPT solo acepta apps personalizadas en planes de pago, y Claude permite un conector personalizado en el plan gratuito.',
      },
      {
        q: '¿Necesito saber programar?',
        a: 'No. Copias un enlace y lo pegas en la configuración de tu IA. El JSON y el comando de terminal son solo para Cursor y Gemini CLI.',
      },
      {
        q: '¿Qué versión de la Biblia usa la IA?',
        a: 'La primera versión de tu enlace. Puedes pedir por nombre cualquier otra versión del enlace. Un enlace sin versión usa la Berean Standard Bible (BSB), en inglés.',
      },
      {
        q: '¿Por qué no está mi traducción favorita?',
        a: 'Muchas traducciones conocidas tienen derechos reservados y no se pueden redistribuir. Aquí solo entran versiones de dominio público o con licencia abierta. En midvash.com puedes leer muchas más.',
      },
      {
        q: '¿La búsqueda funciona en hebreo, griego y árabe?',
        a: 'Sí. La búsqueda funciona en todos los idiomas del catálogo, ignora acentos y mayúsculas y encuentra palabras en hebreo y árabe escritas sin signos vocálicos.',
      },
      {
        q: '¿Guardan lo que pregunto?',
        a: 'No. Tu enlace solo indica qué versiones usar. No pedimos quién eres y no guardamos tus preguntas.',
      },
    ],
  },
  more: {
    title: 'Más de Midvash',
    reader: {
      title: 'Midvash: Biblia y Devocional',
      body: 'Lee la Biblia, sigue un devocional diario y estudia con comentarios en la web, el iPhone y Android.',
    },
    api: {
      title: 'API de la Biblia',
      body: 'El mismo catálogo en JSON, gratis y sin clave, para desarrolladores que quieren el texto bíblico en su propia app.',
    },
    wordpress: {
      title: 'Plugin para WordPress',
      body: 'Convierte las referencias bíblicas del sitio de tu iglesia o ministerio en versículos que el lector abre ahí mismo.',
    },
  },
  footer: {
    brandBy: 'por Midvash',
    productsTitle: 'Productos',
    productLabels: {
      reader: 'Lector de la Biblia',
      api: 'API de la Biblia',
      mcp: 'MCP de la Biblia',
      wordpress: 'Plugin para WordPress',
      chrome: 'Extensión de Chrome',
      ios: 'App para iOS',
      android: 'App para Android',
    },
    openSourceTitle: 'Código abierto',
    allReposLabel: 'Todos los repositorios →',
    soonBadge: 'Próximamente',
    socialLabel: 'Síguenos',
    instagramLabel: 'Visite nuestro Instagram',
    githubLabel: 'Visite nuestro GitHub',
    tagline: 'Código abierto · Gratis para siempre · Sin registro',
    copyright: `© 2025-${new Date().getFullYear()} Midvash. Todos los derechos reservados.`,
    creditPrefix: 'Desarrollado por',
  },
};

const fr: Translations = {
  htmlLang: 'fr',
  meta: {
    title: 'MCP de la Bible pour ChatGPT, Claude et Gemini | Midvash',
    description:
      'MCP de la Bible gratuit : reliez ChatGPT, Claude, Gemini ou Cursor à 62 versions libres en 31 langues, avec commentaires et Strong. Sans compte ni clé.',
  },
  nav: { skipToContent: 'Aller au contenu' },
  hero: {
    eyebrow: 'Gratuit · Sans compte · Sans clé API',
    title: 'Reliez votre IA à la',
    titleAccent: 'Bible',
    subtitle:
      "Votre IA arrête de citer la Bible de mémoire. Avec Midvash, elle lit le vrai texte dans 62 versions libres de la Bible et 31 langues, fait des recherches, compare les traductions et explique chaque chapitre. Fonctionne avec ChatGPT, Claude, Gemini et Cursor.",
    cta: 'Créer mon lien',
    ctaSecondary: 'Voir ce que vous pouvez demander',
    facts: ['62 versions en 31 langues', "11 outils d'étude", 'Commentaire des 1 189 chapitres'],
  },
  uses: {
    title: 'Pensé pour ceux qui étudient la Bible',
    subtitle: "Pas besoin d'être développeur. Demandez avec vos mots et l'IA cherche pour vous, avec la référence.",
    items: [
      { who: 'Pasteurs', prompt: '« Aide-moi à préparer le plan d’une prédication sur Romains 8.28-39 et compare la Segond avec la Darby. »' },
      { who: "Moniteurs d'école du dimanche", prompt: '« Donne-moi des références croisées de Jean 3.16 pour la leçon de dimanche. »' },
      { who: 'Étudiants', prompt: '« Que signifie le mot grec agapè et où apparaît-il en 1 Corinthiens 13 ? »' },
      { who: 'Méditation quotidienne', prompt: '« Lis le Psaume 23 dans la Louis Segond et explique de quoi parle le chapitre. »' },
    ],
  },
  how: {
    title: 'Comment ça marche',
    cards: [
      { num: '01', title: 'Choisissez vos Bibles', body: 'Choisissez les versions que votre IA utilisera, comme la Louis Segond, la Darby ou la Crampon. Toutes sont dans le domaine public ou sous licence libre.' },
      { num: '02', title: 'Copiez votre lien', body: 'Nous créons un lien personnel pour vous. Sans compte, sans e-mail, rien à installer.' },
      { num: '03', title: 'Collez-le dans votre IA', body: "Ajoutez le lien comme connecteur dans ChatGPT, Claude, Gemini ou Cursor. Dès lors, l'IA consulte le vrai texte et cite la référence." },
    ],
  },
  configure: {
    title: 'Créez votre lien',
    subtitle: 'Choisissez les versions de la Bible que votre IA utilisera. La première cochée devient la version par défaut.',
    languagesLabel: '1. Filtrez par langue',
    versionsLabel: '2. Choisissez vos versions de la Bible',
    versionsHelper: 'Astuce : 2 ou 3 versions donnent les réponses les plus claires.',
    generateBtn: 'Créer mon lien',
    selectAll: 'Cocher celles affichées',
    clearAll: 'Effacer',
    needSelection: 'Veuillez choisir au moins une version de la Bible.',
    urlLabel: 'Votre lien de connexion',
    urlHelper: 'Collez ce lien dans ChatGPT ou Claude. Les étapes sont juste en dessous.',
    jsonLabel: 'Pour Cursor et les autres éditeurs (mcp.json)',
    geminiLabel: 'Pour Gemini CLI (à lancer dans le terminal)',
    copyBtn: 'Copier',
    copiedBtn: 'Copié !',
    copyError: 'Impossible de copier dans le presse-papiers.',
  },
  clients: {
    title: 'Ajoutez-le à votre IA',
    subtitle: 'Utilisez le lien créé plus haut. Cela prend environ une minute.',
    chatgpt: { name: 'ChatGPT', tier: 'Plus, Pro, Business, Enterprise ou Edu', steps: ['Allez dans Paramètres › Applications et activez le Mode développeur (dans les paramètres avancés)', 'Cliquez sur Créer une app, nommez-la Midvash, collez votre lien et choisissez sans authentification', 'Dans une conversation, cliquez sur + et activez Midvash'] },
    claude: { name: 'Claude', tier: 'Gratuit (1 connecteur personnalisé), Pro, Max, Team ou Enterprise', steps: ['Sur claude.ai, allez dans Personnaliser › Connecteurs', 'Cliquez sur + › Ajouter un connecteur personnalisé et collez votre lien', 'Dans une conversation, cliquez sur + › Connecteurs et activez Midvash'] },
    gemini: { name: 'Gemini', tier: 'Gemini CLI, dans le terminal', steps: ['Installez Gemini CLI sur votre ordinateur', 'Lancez la commande affichée sous votre lien', 'Ouvrez gemini et posez une question sur un passage'] },
    cursor: { name: 'Cursor', tier: 'Éditeur sur ordinateur', steps: ['Ouvrez les paramètres de Cursor, section MCP', 'Ajoutez un nouveau serveur MCP (cela ouvre mcp.json)', 'Collez le JSON affiché sous votre lien et enregistrez'] },
  },
  tools: {
    title: 'Ce que votre IA peut faire',
    subtitle: "Onze outils que l'IA utilise d'elle-même quand la question le demande.",
    items: {
      get_passage: 'Lit n’importe quel passage à partir d’une référence comme « Jean 3.16-18 ».',
      get_verse: 'Donne un verset ou une suite de versets.',
      get_chapter: 'Lit un chapitre entier.',
      search_bible: 'Trouve des versets par mot ou phrase exacte, dans toutes les langues du catalogue.',
      compare_passage: 'Affiche le même passage côte à côte dans plusieurs versions.',
      get_cross_references: 'Liste les passages liés, avec leur texte, parmi 343 546 liens.',
      get_commentary: 'Explique de quoi parle un chapitre. Les 1 189 chapitres, en 9 langues.',
      search_study: 'Cherche dans les commentaires, les personnages bibliques, le dictionnaire et les articles de théologie.',
      get_strongs: "Explique les mots hébreux et grecs avec le lexique de Strong (14 197 entrées).",
      list_versions: 'Liste les versions disponibles dans votre lien.',
      list_books: 'Liste les 66 livres de la Bible.',
    },
    prompts: 'Il propose aussi quatre consignes prêtes à l’emploi : préparation de prédication, méditation, étude de mot et comparaison de traductions.',
  },
  versions: {
    title: 'Versions et licences',
    body: "Le catalogue compte 62 versions en 31 langues, le même que celui de l'API publique de Midvash. Seules les versions du domaine public ou sous licence libre y figurent, pour que l'IA puisse les citer librement. Les traductions dont les droits sont réservés ne sont pas disponibles ici.",
    creditNote: "Les versions marquées « crédit » relèvent de licences comme Creative Commons. L'IA reçoit la ligne de crédit à la fin de chaque texte.",
    creditBadge: 'crédit',
    apiCta: 'Besoin de ce texte dans votre app ou votre site ? Utilisez l’API de la Bible, gratuite',
  },
  faq: {
    title: 'Questions fréquentes',
    items: [
      { q: 'Est-ce vraiment gratuit ?', a: "Oui. Sans compte, sans clé API et sans publicité. Ce qui peut coûter, c'est l'IA elle-même : ChatGPT n'accepte les apps personnalisées que sur les offres payantes, et Claude permet un connecteur personnalisé avec l'offre gratuite." },
      { q: 'Faut-il savoir programmer ?', a: "Non. Vous copiez un lien et le collez dans les paramètres de votre IA. Le JSON et la commande de terminal servent seulement pour Cursor et Gemini CLI." },
      { q: "Quelle version de la Bible l'IA utilise-t-elle ?", a: "La première version de votre lien. Vous pouvez demander par son nom toute autre version du lien. Un lien sans version utilise la Berean Standard Bible (BSB), en anglais." },
      { q: "Pourquoi ma traduction préférée n'y est-elle pas ?", a: 'Beaucoup de traductions connues ont des droits réservés et ne peuvent pas être redistribuées. Ici, seules les versions du domaine public ou sous licence libre sont incluses. Vous pouvez en lire bien d’autres sur midvash.com.' },
      { q: 'La recherche fonctionne-t-elle en hébreu, en grec et en arabe ?', a: 'Oui. La recherche fonctionne dans toutes les langues du catalogue, ignore les accents et les majuscules et trouve les mots hébreux et arabes tapés sans voyelles.' },
      { q: 'Gardez-vous mes questions ?', a: 'Non. Votre lien indique seulement quelles versions utiliser. Nous ne demandons pas qui vous êtes et nous ne gardons pas vos questions.' },
    ],
  },
  more: {
    title: 'Aussi chez Midvash',
    reader: { title: 'Midvash : Bible et méditation', body: 'Lisez la Bible, suivez une méditation quotidienne et étudiez avec des commentaires sur le web, l’iPhone et Android.' },
    api: { title: 'API de la Bible', body: 'Le même catalogue en JSON, gratuit et sans clé, pour les développeurs qui veulent le texte biblique dans leur app.' },
    wordpress: { title: 'Plugin WordPress', body: "Transforme les références bibliques du site de votre église ou ministère en versets que le lecteur ouvre sur place." },
  },
  footer: {
    brandBy: 'par Midvash',
    productsTitle: 'Produits',
    productLabels: {
      reader: 'Lecteur de Bible',
      api: 'API de la Bible',
      mcp: 'MCP de la Bible',
      wordpress: 'Plugin WordPress',
      chrome: 'Extension Chrome',
      ios: 'App iOS',
      android: 'App Android',
    },
    openSourceTitle: 'Open source',
    allReposLabel: 'Tous les dépôts →',
    soonBadge: 'Bientôt',
    socialLabel: 'Suivez-nous',
    instagramLabel: 'Visitez notre Instagram',
    githubLabel: 'Visitez notre GitHub',
    tagline: 'Open source · Gratuit à vie · Sans inscription',
    copyright: `© 2025-${new Date().getFullYear()} Midvash. Tous droits réservés.`,
    creditPrefix: 'Développé par',
  },
};

const de: Translations = {
  htmlLang: 'de',
  meta: {
    title: 'Bibel-MCP für ChatGPT, Claude und Gemini | Midvash',
    description:
      'Kostenloser Bibel-MCP: Verbinde ChatGPT, Claude, Gemini oder Cursor mit 62 freien Bibeln in 31 Sprachen, samt Kommentar und Strong. Ohne Konto und Key.',
  },
  nav: { skipToContent: 'Zum Inhalt springen' },
  hero: {
    eyebrow: 'Kostenlos · Ohne Konto · Ohne API-Key',
    title: 'Verbinde deine KI mit der',
    titleAccent: 'Bibel',
    subtitle:
      'Deine KI zitiert die Bibel nicht mehr aus dem Gedächtnis. Mit Midvash liest sie den echten Text in 62 freien Bibelübersetzungen und 31 Sprachen, durchsucht ihn, vergleicht Übersetzungen und erklärt jedes Kapitel. Funktioniert in ChatGPT, Claude, Gemini und Cursor.',
    cta: 'Meinen Link erstellen',
    ctaSecondary: 'Sieh, was du fragen kannst',
    facts: ['62 Übersetzungen in 31 Sprachen', '11 Werkzeuge zum Bibelstudium', 'Kommentar zu allen 1.189 Kapiteln'],
  },
  uses: {
    title: 'Für alle, die die Bibel studieren',
    subtitle: 'Du musst nicht programmieren können. Frag in deinen Worten, und die KI schlägt es für dich nach, mit Stellenangabe.',
    items: [
      { who: 'Pastoren', prompt: '„Hilf mir bei der Gliederung einer Predigt über Römer 8,28-39 und vergleiche Luther 1912 mit Schlachter 1951.“' },
      { who: 'Kindergottesdienst und Bibelkreis', prompt: '„Nenne mir Querverweise zu Johannes 3,16 für die Stunde am Sonntag.“' },
      { who: 'Studierende', prompt: '„Was bedeutet das griechische Wort agape, und wo kommt es in 1. Korinther 13 vor?“' },
      { who: 'Tägliche Andacht', prompt: '„Lies Psalm 23 in der Elberfelder 1905 und erkläre, worum es im Kapitel geht.“' },
    ],
  },
  how: {
    title: 'So funktioniert es',
    cards: [
      { num: '01', title: 'Wähle deine Bibeln', body: 'Wähle die Übersetzungen, die deine KI nutzen soll, etwa Luther 1912, Schlachter 1951 oder Elberfelder 1905. Alle sind gemeinfrei oder offen lizenziert.' },
      { num: '02', title: 'Kopiere deinen Link', body: 'Wir erstellen einen persönlichen Link für dich. Ohne Konto, ohne E-Mail, ohne Installation.' },
      { num: '03', title: 'Füge ihn in deine KI ein', body: 'Füge den Link als Connector in ChatGPT, Claude, Gemini oder Cursor hinzu. Ab dann schlägt die KI den echten Text nach und nennt die Stelle.' },
    ],
  },
  configure: {
    title: 'Erstelle deinen Link',
    subtitle: 'Wähle die Bibelübersetzungen, die deine KI nutzen soll. Die erste, die du ankreuzt, wird zum Standard.',
    languagesLabel: '1. Nach Sprache filtern',
    versionsLabel: '2. Bibelübersetzungen wählen',
    versionsHelper: 'Tipp: 2 oder 3 Übersetzungen ergeben die klarsten Antworten.',
    generateBtn: 'Meinen Link erstellen',
    selectAll: 'Angezeigte auswählen',
    clearAll: 'Leeren',
    needSelection: 'Bitte wähle mindestens eine Bibelübersetzung.',
    urlLabel: 'Dein Verbindungslink',
    urlHelper: 'Füge diesen Link in ChatGPT oder Claude ein. Die Schritte stehen direkt darunter.',
    jsonLabel: 'Für Cursor und andere Editoren (mcp.json)',
    geminiLabel: 'Für Gemini CLI (im Terminal ausführen)',
    copyBtn: 'Kopieren',
    copiedBtn: 'Kopiert!',
    copyError: 'Konnte nicht in die Zwischenablage kopiert werden.',
  },
  clients: {
    title: 'Füge es deiner KI hinzu',
    subtitle: 'Nutze den Link, den du oben erstellt hast. Das dauert etwa eine Minute.',
    chatgpt: { name: 'ChatGPT', tier: 'Plus, Pro, Business, Enterprise oder Edu', steps: ['Öffne Einstellungen › Apps und schalte den Entwicklermodus ein (unter Erweiterte Einstellungen)', 'Klicke auf App erstellen, nenne sie Midvash, füge deinen Link ein und wähle keine Authentifizierung', 'Klicke in einem Chat auf + und aktiviere Midvash'] },
    claude: { name: 'Claude', tier: 'Free (1 eigener Connector), Pro, Max, Team oder Enterprise', steps: ['Öffne auf claude.ai Anpassen › Connectors', 'Klicke auf + › Benutzerdefinierten Connector hinzufügen und füge deinen Link ein', 'Klicke in einem Chat auf + › Connectors und aktiviere Midvash'] },
    gemini: { name: 'Gemini', tier: 'Gemini CLI, im Terminal', steps: ['Installiere Gemini CLI auf deinem Computer', 'Führe den Befehl unter deinem Link aus', 'Starte gemini und frag nach einer beliebigen Stelle'] },
    cursor: { name: 'Cursor', tier: 'Desktop-Editor', steps: ['Öffne die Cursor-Einstellungen und gehe zum Bereich MCP', 'Füge einen neuen MCP-Server hinzu (das öffnet mcp.json)', 'Füge das JSON unter deinem Link ein und speichere'] },
  },
  tools: {
    title: 'Was deine KI damit kann',
    subtitle: 'Elf Werkzeuge, die die KI von selbst nutzt, wenn die Frage es braucht.',
    items: {
      get_passage: 'Liest jede Stelle anhand einer Angabe wie „Johannes 3,16-18“.',
      get_verse: 'Holt einen Vers oder einen Versbereich.',
      get_chapter: 'Liest ein ganzes Kapitel.',
      search_bible: 'Findet Verse nach Wort oder genauer Wendung, in allen Sprachen des Katalogs.',
      compare_passage: 'Zeigt dieselbe Stelle nebeneinander in mehreren Übersetzungen.',
      get_cross_references: 'Listet verwandte Stellen mit Text auf, aus 343.546 Verweisen.',
      get_commentary: 'Erklärt, worum es in einem Kapitel geht. Alle 1.189 Kapitel, in 9 Sprachen.',
      search_study: 'Durchsucht Kommentare, biblische Personen, Lexikoneinträge und Artikel zur Theologie.',
      get_strongs: 'Erklärt hebräische und griechische Wörter mit dem Strong-Lexikon (14.197 Einträge).',
      list_versions: 'Listet die Übersetzungen in deinem Link auf.',
      list_books: 'Listet die 66 Bücher der Bibel auf.',
    },
    prompts: 'Dazu kommen vier fertige Vorlagen: Predigtvorbereitung, Andacht, Wortstudie und Übersetzungsvergleich.',
  },
  versions: {
    title: 'Übersetzungen und Lizenzen',
    body: 'Der Katalog umfasst 62 Übersetzungen in 31 Sprachen, derselbe wie in der öffentlichen Midvash-API. Aufgenommen werden nur gemeinfreie oder offen lizenzierte Übersetzungen, die die KI frei zitieren darf. Übersetzungen mit vorbehaltenen Rechten gibt es hier nicht.',
    creditNote: 'Mit „Nachweis“ markierte Übersetzungen stehen unter Lizenzen wie Creative Commons. Die KI erhält die Nachweiszeile am Ende jedes Textes.',
    creditBadge: 'Nachweis',
    apiCta: 'Brauchst du den Text in deiner App oder Website? Nutze die kostenlose Bibel-API',
  },
  faq: {
    title: 'Häufige Fragen',
    items: [
      { q: 'Ist es wirklich kostenlos?', a: 'Ja. Ohne Konto, ohne API-Key und ohne Werbung. Kosten kann höchstens die KI selbst: ChatGPT erlaubt eigene Apps nur in bezahlten Plänen, Claude erlaubt einen eigenen Connector im kostenlosen Plan.' },
      { q: 'Muss ich programmieren können?', a: 'Nein. Du kopierst einen Link und fügst ihn in den Einstellungen deiner KI ein. JSON und Terminalbefehl brauchst du nur für Cursor und Gemini CLI.' },
      { q: 'Welche Bibelübersetzung nutzt die KI?', a: 'Die erste Übersetzung in deinem Link. Jede andere Übersetzung aus dem Link kannst du beim Namen nennen. Ein Link ohne Übersetzung nutzt die Berean Standard Bible (BSB) auf Englisch.' },
      { q: 'Warum fehlt meine Lieblingsübersetzung?', a: 'Viele bekannte Übersetzungen sind urheberrechtlich geschützt und dürfen nicht weitergegeben werden. Hier gibt es nur gemeinfreie oder offen lizenzierte Übersetzungen. Auf midvash.com kannst du viele weitere lesen.' },
      { q: 'Funktioniert die Suche auf Hebräisch, Griechisch und Arabisch?', a: 'Ja. Die Suche funktioniert in allen Sprachen des Katalogs, ignoriert Akzente und Groß- und Kleinschreibung und findet hebräische und arabische Wörter auch ohne Vokalzeichen.' },
      { q: 'Speichert ihr meine Fragen?', a: 'Nein. Dein Link legt nur fest, welche Übersetzungen genutzt werden. Wir fragen nicht, wer du bist, und speichern deine Fragen nicht.' },
    ],
  },
  more: {
    title: 'Mehr von Midvash',
    reader: { title: 'Midvash: Bibel & Andacht', body: 'Lies die Bibel, folge einer täglichen Andacht und studiere mit Kommentaren im Web, auf dem iPhone und auf Android.' },
    api: { title: 'Bibel-API', body: 'Derselbe Katalog als JSON, kostenlos und ohne Key, für Entwickler, die Bibeltext in ihrer eigenen App brauchen.' },
    wordpress: { title: 'WordPress-Plugin', body: 'Macht Bibelstellen auf der Website deiner Gemeinde zu Versen, die Leser direkt dort öffnen.' },
  },
  footer: {
    brandBy: 'von Midvash',
    productsTitle: 'Produkte',
    productLabels: {
      reader: 'Bibel-Reader',
      api: 'Bibel-API',
      mcp: 'Bibel-MCP',
      wordpress: 'WordPress-Plugin',
      chrome: 'Chrome-Erweiterung',
      ios: 'iOS-App',
      android: 'Android-App',
    },
    openSourceTitle: 'Open Source',
    allReposLabel: 'Alle Repositories →',
    soonBadge: 'Bald',
    socialLabel: 'Folge uns',
    instagramLabel: 'Besuche unser Instagram',
    githubLabel: 'Besuche unser GitHub',
    tagline: 'Open Source · Für immer kostenlos · Keine Anmeldung',
    copyright: `© 2025-${new Date().getFullYear()} Midvash. Alle Rechte vorbehalten.`,
    creditPrefix: 'Entwickelt von',
  },
};

const it: Translations = {
  htmlLang: 'it',
  meta: {
    title: 'MCP della Bibbia per ChatGPT, Claude e Gemini | Midvash',
    description:
      'MCP della Bibbia gratuito: collega ChatGPT, Claude, Gemini o Cursor a 62 versioni libere in 31 lingue, con commenti e Strong. Senza account né chiave.',
  },
  nav: { skipToContent: 'Vai al contenuto' },
  hero: {
    eyebrow: 'Gratuito · Senza account · Senza chiave API',
    title: 'Collega la tua IA alla',
    titleAccent: 'Bibbia',
    subtitle:
      'La tua IA smette di citare la Bibbia a memoria. Con Midvash legge il testo vero in 62 versioni libere della Bibbia e 31 lingue, fa ricerche, confronta le traduzioni e spiega ogni capitolo. Funziona con ChatGPT, Claude, Gemini e Cursor.',
    cta: 'Crea il mio link',
    ctaSecondary: 'Guarda cosa puoi chiedere',
    facts: ['62 versioni in 31 lingue', '11 strumenti di studio', 'Commento a tutti i 1.189 capitoli'],
  },
  uses: {
    title: 'Pensato per chi studia la Bibbia',
    subtitle: 'Non serve essere programmatori. Chiedi con parole tue e la IA cerca per te, con il riferimento.',
    items: [
      { who: 'Pastori', prompt: '«Aiutami a impostare una predicazione su Romani 8:28-39 e confronta la Nuova Riveduta con la Diodati.»' },
      { who: 'Insegnanti di scuola domenicale', prompt: '«Dammi i riferimenti incrociati di Giovanni 3:16 per la lezione di domenica.»' },
      { who: 'Studenti', prompt: '«Che cosa significa la parola greca agape e dove compare in 1 Corinzi 13?»' },
      { who: 'Meditazione quotidiana', prompt: '«Leggi il Salmo 23 nella Riveduta 1927 e spiega di che cosa parla il capitolo.»' },
    ],
  },
  how: {
    title: 'Come funziona',
    cards: [
      { num: '01', title: 'Scegli le tue Bibbie', body: 'Scegli le versioni che userà la tua IA, come la Nuova Riveduta, la Diodati o la Riveduta 1927. Tutte sono di pubblico dominio o con licenza libera.' },
      { num: '02', title: 'Copia il tuo link', body: 'Creiamo un link personale per te. Senza account, senza email, senza installare nulla.' },
      { num: '03', title: 'Incollalo nella tua IA', body: 'Aggiungi il link come connettore in ChatGPT, Claude, Gemini o Cursor. Da quel momento la IA consulta il testo vero e cita il riferimento.' },
    ],
  },
  configure: {
    title: 'Crea il tuo link',
    subtitle: 'Scegli le versioni della Bibbia che userà la tua IA. La prima che selezioni diventa quella predefinita.',
    languagesLabel: '1. Filtra per lingua',
    versionsLabel: '2. Scegli le versioni della Bibbia',
    versionsHelper: 'Suggerimento: 2 o 3 versioni danno le risposte più chiare.',
    generateBtn: 'Crea il mio link',
    selectAll: 'Seleziona quelle visibili',
    clearAll: 'Pulisci',
    needSelection: 'Seleziona almeno una versione della Bibbia.',
    urlLabel: 'Il tuo link di connessione',
    urlHelper: 'Incolla questo link in ChatGPT o Claude. I passaggi sono qui sotto.',
    jsonLabel: 'Per Cursor e altri editor (mcp.json)',
    geminiLabel: 'Per Gemini CLI (da eseguire nel terminale)',
    copyBtn: 'Copia',
    copiedBtn: 'Copiato!',
    copyError: 'Impossibile copiare negli appunti.',
  },
  clients: {
    title: 'Aggiungilo alla tua IA',
    subtitle: 'Usa il link che hai creato sopra. Ci vuole circa un minuto.',
    chatgpt: { name: 'ChatGPT', tier: 'Plus, Pro, Business, Enterprise o Edu', steps: ['Vai in Impostazioni › App e attiva la Modalità sviluppatore (nelle impostazioni avanzate)', 'Clicca su Crea app, chiamala Midvash, incolla il link e scegli nessuna autenticazione', 'In una chat, clicca su + e attiva Midvash'] },
    claude: { name: 'Claude', tier: 'Gratuito (1 connettore personalizzato), Pro, Max, Team o Enterprise', steps: ['Su claude.ai, vai in Personalizza › Connettori', 'Clicca su + › Aggiungi connettore personalizzato e incolla il link', 'In una chat, clicca su + › Connettori e attiva Midvash'] },
    gemini: { name: 'Gemini', tier: 'Gemini CLI, nel terminale', steps: ['Installa Gemini CLI sul tuo computer', 'Esegui il comando che compare sotto il tuo link', 'Avvia gemini e chiedi di qualsiasi passo'] },
    cursor: { name: 'Cursor', tier: 'Editor desktop', steps: ['Apri le impostazioni di Cursor e vai alla sezione MCP', 'Aggiungi un nuovo server MCP (si apre mcp.json)', 'Incolla il JSON che compare sotto il tuo link e salva'] },
  },
  tools: {
    title: 'Cosa può fare la tua IA',
    subtitle: 'Undici strumenti che la IA usa da sola quando la domanda lo richiede.',
    items: {
      get_passage: 'Legge qualsiasi passo a partire da un riferimento come «Giovanni 3:16-18».',
      get_verse: 'Recupera un versetto o un gruppo di versetti.',
      get_chapter: 'Legge un capitolo intero.',
      search_bible: 'Trova versetti per parola o frase esatta, in tutte le lingue del catalogo.',
      compare_passage: 'Mostra lo stesso passo affiancato in più versioni.',
      get_cross_references: 'Elenca i passi collegati, con il testo, tra 343.546 collegamenti.',
      get_commentary: 'Spiega di che cosa parla un capitolo. Tutti i 1.189 capitoli, in 9 lingue.',
      search_study: 'Cerca nei commenti, nei personaggi biblici, nel dizionario e negli articoli di teologia.',
      get_strongs: 'Spiega le parole ebraiche e greche con il lessico di Strong (14.197 voci).',
      list_versions: 'Elenca le versioni disponibili nel tuo link.',
      list_books: 'Elenca i 66 libri della Bibbia.',
    },
    prompts: 'Offre anche quattro tracce pronte: preparazione della predicazione, meditazione, studio di parola e confronto tra traduzioni.',
  },
  versions: {
    title: 'Versioni e licenze',
    body: "Il catalogo ha 62 versioni in 31 lingue, lo stesso dell'API pubblica di Midvash. Entrano solo versioni di pubblico dominio o con licenza libera, che la IA può citare liberamente. Le traduzioni con diritti riservati qui non sono disponibili.",
    creditNote: 'Le versioni con l’indicazione «crediti» usano licenze come Creative Commons. La IA riceve la riga dei crediti alla fine di ogni testo.',
    creditBadge: 'crediti',
    apiCta: 'Ti serve questo testo nella tua app o nel tuo sito? Usa l’API della Bibbia, gratuita',
  },
  faq: {
    title: 'Domande frequenti',
    items: [
      { q: 'È davvero gratuito?', a: 'Sì. Senza account, senza chiave API e senza pubblicità. A costare può essere solo la IA stessa: ChatGPT accetta app personalizzate solo nei piani a pagamento, mentre Claude consente un connettore personalizzato nel piano gratuito.' },
      { q: 'Devo saper programmare?', a: 'No. Copi un link e lo incolli nelle impostazioni della tua IA. Il JSON e il comando da terminale servono solo per Cursor e Gemini CLI.' },
      { q: 'Quale versione della Bibbia usa la IA?', a: 'La prima versione del tuo link. Puoi chiedere per nome qualsiasi altra versione del link. Un link senza versioni usa la Berean Standard Bible (BSB), in inglese.' },
      { q: 'Perché manca la mia traduzione preferita?', a: 'Molte traduzioni note hanno diritti riservati e non possono essere ridistribuite. Qui entrano solo versioni di pubblico dominio o con licenza libera. Su midvash.com puoi leggerne molte altre.' },
      { q: 'La ricerca funziona in ebraico, greco e arabo?', a: 'Sì. La ricerca funziona in tutte le lingue del catalogo, ignora accenti e maiuscole e trova parole ebraiche e arabe scritte senza segni vocalici.' },
      { q: 'Conservate le mie domande?', a: 'No. Il tuo link indica solo quali versioni usare. Non chiediamo chi sei e non conserviamo le tue domande.' },
    ],
  },
  more: {
    title: 'Altro da Midvash',
    reader: { title: 'Midvash: Bibbia e Devozionale', body: 'Leggi la Bibbia, segui un devozionale quotidiano e studia con i commenti sul web, su iPhone e su Android.' },
    api: { title: 'API della Bibbia', body: 'Lo stesso catalogo in JSON, gratuito e senza chiave, per chi sviluppa e vuole il testo biblico nella propria app.' },
    wordpress: { title: 'Plugin WordPress', body: 'Trasforma i riferimenti biblici del sito della tua chiesa o del tuo ministero in versetti che il lettore apre sul posto.' },
  },
  footer: {
    brandBy: 'di Midvash',
    productsTitle: 'Prodotti',
    productLabels: {
      reader: 'Lettore della Bibbia',
      api: 'API della Bibbia',
      mcp: 'MCP della Bibbia',
      wordpress: 'Plugin WordPress',
      chrome: 'Estensione Chrome',
      ios: 'App iOS',
      android: 'App Android',
    },
    openSourceTitle: 'Open source',
    allReposLabel: 'Tutti i repository →',
    soonBadge: 'In arrivo',
    socialLabel: 'Seguici',
    instagramLabel: 'Visita il nostro Instagram',
    githubLabel: 'Visita il nostro GitHub',
    tagline: 'Open source · Gratuito per sempre · Senza registrazione',
    copyright: `© 2025-${new Date().getFullYear()} Midvash. Tutti i diritti riservati.`,
    creditPrefix: 'Sviluppato da',
  },
};

const zh: Translations = {
  htmlLang: 'zh-Hans',
  meta: {
    title: '适用于 ChatGPT、Claude 和 Gemini 的圣经 MCP | Midvash',
    description:
      '免费的圣经 MCP：把 ChatGPT、Claude、Gemini 或 Cursor 连接到 31 种语言的 62 个可自由使用的圣经版本，附带注释与 Strong 词典。无需账号，无需密钥。',
  },
  nav: { skipToContent: '跳到主要内容' },
  hero: {
    eyebrow: '免费 · 无需账号 · 无需 API 密钥',
    title: '让你的 AI 连接',
    titleAccent: '圣经',
    subtitle:
      '你的 AI 不再凭记忆引用经文。借助 Midvash，它会读取 31 种语言、62 个可自由使用的圣经版本中的真实经文，进行搜索、比较译本，并讲解每一章。支持 ChatGPT、Claude、Gemini 和 Cursor。',
    cta: '创建我的链接',
    ctaSecondary: '看看可以问什么',
    facts: ['31 种语言的 62 个版本', '11 个查经工具', '全部 1,189 章的注释'],
  },
  uses: {
    title: '为读经、查经的人而做',
    subtitle: '不需要会写程序。用你自己的话提问，AI 会替你查找，并给出经文出处。',
    items: [
      { who: '牧师', prompt: '“帮我列出罗马书 8:28-39 的讲道大纲，并比较和合本与 KJV。”' },
      { who: '主日学老师', prompt: '“列出约翰福音 3:16 的串珠经文，用在主日的课上。”' },
      { who: '学生', prompt: '“希腊文 agape 是什么意思？它在哥林多前书 13 章哪里出现？”' },
      { who: '每日灵修', prompt: '“用和合本读诗篇 23 篇，并讲解这一章在说什么。”' },
    ],
  },
  how: {
    title: '使用流程',
    cards: [
      { num: '01', title: '挑选圣经版本', body: '选择 AI 要使用的版本，例如和合本（简体或繁体）、BSB 或 KJV。所有版本都属于公有领域或采用开放许可。' },
      { num: '02', title: '复制你的链接', body: '我们为你生成专属链接。不需要账号、邮箱，也不用安装任何东西。' },
      { num: '03', title: '粘贴到你的 AI', body: '在 ChatGPT、Claude、Gemini 或 Cursor 中把链接添加为连接器。从此 AI 会查阅真实经文并注明出处。' },
    ],
  },
  configure: {
    title: '创建你的链接',
    subtitle: '选择 AI 要使用的圣经版本。你勾选的第一个版本会成为默认版本。',
    languagesLabel: '1. 按语言筛选',
    versionsLabel: '2. 选择圣经版本',
    versionsHelper: '建议：选 2 到 3 个版本，回答最清楚。',
    generateBtn: '创建我的链接',
    selectAll: '全选当前显示',
    clearAll: '清除',
    needSelection: '请至少选择一个圣经版本。',
    urlLabel: '你的连接链接',
    urlHelper: '把这个链接粘贴到 ChatGPT 或 Claude。步骤就在下方。',
    jsonLabel: '用于 Cursor 和其他编辑器（mcp.json）',
    geminiLabel: '用于 Gemini CLI（在终端运行）',
    copyBtn: '复制',
    copiedBtn: '已复制！',
    copyError: '无法复制到剪贴板。',
  },
  clients: {
    title: '添加到你的 AI',
    subtitle: '使用你在上面创建的链接，大约一分钟即可完成。',
    chatgpt: { name: 'ChatGPT', tier: 'Plus、Pro、Business、Enterprise 或 Edu', steps: ['进入「设置 › 应用」，在高级设置中开启「开发者模式」', '点击「创建应用」，命名为 Midvash，粘贴链接，认证选择「无」', '在对话中点击 +，启用 Midvash'] },
    claude: { name: 'Claude', tier: '免费版（1 个自定义连接器）、Pro、Max、Team 或 Enterprise', steps: ['在 claude.ai 进入「自定义 › 连接器」', '点击 + ›「添加自定义连接器」，粘贴链接', '在对话中点击 + ›「连接器」，启用 Midvash'] },
    gemini: { name: 'Gemini', tier: 'Gemini CLI（终端）', steps: ['在电脑上安装 Gemini CLI', '运行链接下方显示的命令', '启动 gemini，询问任意经文'] },
    cursor: { name: 'Cursor', tier: '桌面编辑器', steps: ['打开 Cursor 设置，进入 MCP 部分', '添加新的 MCP 服务器（会打开 mcp.json）', '粘贴链接下方显示的 JSON 并保存'] },
  },
  tools: {
    title: '你的 AI 能做什么',
    subtitle: '11 个工具，AI 会在问题需要时自动调用。',
    items: {
      get_passage: '根据“约翰福音 3:16-18”这样的出处读取任意经文。',
      get_verse: '获取一节或连续几节经文。',
      get_chapter: '读取整章经文。',
      search_bible: '按词语或完整短语查找经文，支持目录中的所有语言。',
      compare_passage: '把同一段经文的多个版本并排显示。',
      get_cross_references: '从 343,546 条串珠关联中列出相关经文，并附上经文内容。',
      get_commentary: '讲解一章的主要内容。全部 1,189 章，提供 9 种语言。',
      search_study: '搜索章节注释、圣经人物、词典条目和神学文章。',
      get_strongs: '用 Strong 词典解释希伯来文和希腊文词语（14,197 个词条）。',
      list_versions: '列出你的链接中可用的版本。',
      list_books: '列出圣经 66 卷书。',
    },
    prompts: '另外还提供四个现成的提示：预备讲道、灵修、字词研究和译本比较。',
  },
  versions: {
    title: '版本与许可',
    body: '目录包含 31 种语言的 62 个版本，与 Midvash 公共 API 相同。只收录公有领域或开放许可的版本，AI 可以自由引用。保留版权的译本不在此提供。',
    creditNote: '标有“署名”的版本采用 Creative Commons 等许可。AI 会在每段经文末尾收到署名信息。',
    creditBadge: '署名',
    apiCta: '想在自己的应用或网站中使用这些经文？试试免费的圣经 API',
  },
  faq: {
    title: '常见问题',
    items: [
      { q: '真的免费吗？', a: '是的。无需账号，无需 API 密钥，也没有广告。可能收费的只有 AI 本身：ChatGPT 只在付费方案中支持自定义应用，Claude 的免费版可以添加 1 个自定义连接器。' },
      { q: '需要会写程序吗？', a: '不需要。复制链接，粘贴到 AI 的设置里即可。JSON 和终端命令只用于 Cursor 和 Gemini CLI。' },
      { q: 'AI 用哪个圣经版本？', a: '链接中的第一个版本。你也可以直接说出链接里其他版本的名称。没有指定版本的链接会使用英文的 Berean Standard Bible (BSB)。' },
      { q: '为什么没有我常用的译本？', a: '许多常见译本保留版权，不能转发分享。这里只收录公有领域或开放许可的版本。在 midvash.com 可以阅读更多译本。' },
      { q: '搜索支持希伯来文、希腊文和阿拉伯文吗？', a: '支持。搜索适用于目录中的所有语言，忽略重音和大小写，输入不带元音符号的希伯来文和阿拉伯文也能找到。' },
      { q: '你们会保存我的提问吗？', a: '不会。你的链接只说明要使用哪些版本。我们不询问你是谁，也不保存你的提问。' },
    ],
  },
  more: {
    title: 'Midvash 的其他产品',
    reader: { title: 'Midvash：圣经与灵修', body: '在网页、iPhone 和 Android 上读经、跟随每日灵修，并借助注释查经。' },
    api: { title: '圣经 API', body: '同一目录的 JSON 数据，免费且无需密钥，适合想在自己应用中显示经文的开发者。' },
    wordpress: { title: 'WordPress 插件', body: '把教会或事工网站上的经文出处变成读者可以就地打开的经文。' },
  },
  footer: {
    brandBy: 'Midvash 出品',
    productsTitle: '产品',
    productLabels: {
      reader: '圣经阅读器',
      api: '圣经 API',
      mcp: '圣经 MCP',
      wordpress: 'WordPress 插件',
      chrome: 'Chrome 扩展',
      ios: 'iOS 应用',
      android: 'Android 应用',
    },
    openSourceTitle: '开源',
    allReposLabel: '所有仓库 →',
    soonBadge: '即将推出',
    socialLabel: '关注我们',
    instagramLabel: '访问我们的 Instagram',
    githubLabel: '访问我们的 GitHub',
    tagline: '开源 · 永久免费 · 无需注册',
    copyright: `© 2025-${new Date().getFullYear()} Midvash 保留所有权利。`,
    creditPrefix: '开发者：',
  },
};

const ru: Translations = {
  htmlLang: 'ru',
  meta: {
    title: 'MCP Библии для ChatGPT, Claude и Gemini | Midvash',
    description:
      'Бесплатный MCP Библии: подключите ChatGPT, Claude, Gemini или Cursor к 62 свободным переводам на 31 языке, с комментариями и Стронгом. Без аккаунта и ключа.',
  },
  nav: { skipToContent: 'Перейти к содержанию' },
  hero: {
    eyebrow: 'Бесплатно · Без аккаунта · Без API-ключа',
    title: 'Подключите свой ИИ к',
    titleAccent: 'Библии',
    subtitle:
      'Ваш ИИ перестанет цитировать Писание по памяти. С Midvash он читает настоящий текст в 62 свободных переводах Библии на 31 языке, ищет по нему, сравнивает переводы и объясняет каждую главу. Работает в ChatGPT, Claude, Gemini и Cursor.',
    cta: 'Создать ссылку',
    ctaSecondary: 'Что можно спросить',
    facts: ['62 перевода на 31 языке', '11 инструментов для изучения', 'Комментарий ко всем 1189 главам'],
  },
  uses: {
    title: 'Для тех, кто изучает Библию',
    subtitle: 'Не нужно быть программистом. Спросите своими словами, и ИИ найдёт ответ со ссылкой на место Писания.',
    items: [
      { who: 'Пасторы', prompt: '«Помоги составить план проповеди по Римлянам 8:28-39 и сравни Синодальный перевод с KJV.»' },
      { who: 'Учителя воскресной школы', prompt: '«Подбери параллельные места к Иоанна 3:16 для воскресного урока.»' },
      { who: 'Студенты', prompt: '«Что значит греческое слово агапе и где оно встречается в 1 Коринфянам 13?»' },
      { who: 'Ежедневное чтение', prompt: '«Прочитай Псалом 22 в Синодальном переводе и объясни, о чём эта глава.»' },
    ],
  },
  how: {
    title: 'Как это работает',
    cards: [
      { num: '01', title: 'Выберите переводы', body: 'Выберите переводы, которыми будет пользоваться ИИ, например Синодальный, BSB или KJV. Все они в общественном достоянии или под открытой лицензией.' },
      { num: '02', title: 'Скопируйте ссылку', body: 'Мы создадим для вас личную ссылку. Без аккаунта, без email, ничего не нужно устанавливать.' },
      { num: '03', title: 'Вставьте её в ИИ', body: 'Добавьте ссылку как коннектор в ChatGPT, Claude, Gemini или Cursor. После этого ИИ сверяется с настоящим текстом и указывает ссылку на место.' },
    ],
  },
  configure: {
    title: 'Создайте ссылку',
    subtitle: 'Выберите переводы Библии для вашего ИИ. Первый отмеченный станет переводом по умолчанию.',
    languagesLabel: '1. Фильтр по языку',
    versionsLabel: '2. Выберите переводы Библии',
    versionsHelper: 'Совет: 2 или 3 перевода дают самые ясные ответы.',
    generateBtn: 'Создать ссылку',
    selectAll: 'Отметить показанные',
    clearAll: 'Очистить',
    needSelection: 'Выберите хотя бы один перевод Библии.',
    urlLabel: 'Ваша ссылка для подключения',
    urlHelper: 'Вставьте эту ссылку в ChatGPT или Claude. Инструкция чуть ниже.',
    jsonLabel: 'Для Cursor и других редакторов (mcp.json)',
    geminiLabel: 'Для Gemini CLI (выполните в терминале)',
    copyBtn: 'Скопировать',
    copiedBtn: 'Скопировано!',
    copyError: 'Не удалось скопировать в буфер обмена.',
  },
  clients: {
    title: 'Добавьте в свой ИИ',
    subtitle: 'Используйте ссылку, которую вы создали выше. Это займёт около минуты.',
    chatgpt: { name: 'ChatGPT', tier: 'Plus, Pro, Business, Enterprise или Edu', steps: ['Откройте Настройки › Приложения и включите режим разработчика (в расширенных настройках)', 'Нажмите «Создать приложение», назовите его Midvash, вставьте ссылку и выберите вход без аутентификации', 'В чате нажмите + и включите Midvash'] },
    claude: { name: 'Claude', tier: 'Free (1 свой коннектор), Pro, Max, Team или Enterprise', steps: ['На claude.ai откройте Настроить › Коннекторы', 'Нажмите + › «Добавить свой коннектор» и вставьте ссылку', 'В чате нажмите + › Коннекторы и включите Midvash'] },
    gemini: { name: 'Gemini', tier: 'Gemini CLI, в терминале', steps: ['Установите Gemini CLI на компьютер', 'Выполните команду, показанную под ссылкой', 'Запустите gemini и спросите о любом месте Писания'] },
    cursor: { name: 'Cursor', tier: 'Редактор для компьютера', steps: ['Откройте настройки Cursor, раздел MCP', 'Добавьте новый MCP-сервер (откроется mcp.json)', 'Вставьте JSON, показанный под ссылкой, и сохраните'] },
  },
  tools: {
    title: 'Что умеет ваш ИИ',
    subtitle: 'Одиннадцать инструментов, которые ИИ сам вызывает, когда этого требует вопрос.',
    items: {
      get_passage: 'Читает любой отрывок по ссылке вроде «Иоанна 3:16-18».',
      get_verse: 'Выдаёт один стих или несколько стихов подряд.',
      get_chapter: 'Читает главу целиком.',
      search_bible: 'Находит стихи по слову или точной фразе на всех языках каталога.',
      compare_passage: 'Показывает один отрывок в нескольких переводах рядом.',
      get_cross_references: 'Подбирает параллельные места с текстом из 343 546 связей.',
      get_commentary: 'Объясняет, о чём глава. Все 1189 глав на 9 языках.',
      search_study: 'Ищет по комментариям, библейским персонажам, словарю и статьям по богословию.',
      get_strongs: 'Объясняет еврейские и греческие слова по словарю Стронга (14 197 статей).',
      list_versions: 'Показывает переводы, доступные по вашей ссылке.',
      list_books: 'Показывает 66 книг Библии.',
    },
    prompts: 'Есть и четыре готовых сценария: подготовка проповеди, ежедневное чтение, изучение слова и сравнение переводов.',
  },
  versions: {
    title: 'Переводы и лицензии',
    body: 'В каталоге 62 перевода на 31 языке, тот же набор, что и в публичном API Midvash. Сюда входят только переводы в общественном достоянии или под открытой лицензией, которые ИИ может свободно цитировать. Переводы с охраняемыми правами здесь недоступны.',
    creditNote: 'Переводы с пометкой «атрибуция» распространяются по лицензиям вроде Creative Commons. ИИ получает строку с указанием авторства в конце каждого текста.',
    creditBadge: 'атрибуция',
    apiCta: 'Нужен этот текст в вашем приложении или на сайте? Используйте бесплатный API Библии',
  },
  faq: {
    title: 'Частые вопросы',
    items: [
      { q: 'Это правда бесплатно?', a: 'Да. Без аккаунта, без API-ключа и без рекламы. Платным может быть только сам ИИ: ChatGPT принимает свои приложения только на платных тарифах, а Claude разрешает один свой коннектор на бесплатном тарифе.' },
      { q: 'Нужно ли уметь программировать?', a: 'Нет. Вы копируете ссылку и вставляете её в настройки ИИ. JSON и команда для терминала нужны только для Cursor и Gemini CLI.' },
      { q: 'Какой перевод использует ИИ?', a: 'Первый перевод в вашей ссылке. Любой другой перевод из ссылки можно попросить по названию. Ссылка без переводов использует Berean Standard Bible (BSB) на английском.' },
      { q: 'Почему нет моего любимого перевода?', a: 'У многих известных переводов права охраняются, и распространять их нельзя. Здесь только переводы в общественном достоянии или под открытой лицензией. Гораздо больше переводов можно читать на midvash.com.' },
      { q: 'Работает ли поиск на иврите, греческом и арабском?', a: 'Да. Поиск работает на всех языках каталога, не учитывает ударения и регистр и находит слова на иврите и арабском, набранные без огласовок.' },
      { q: 'Вы храните мои вопросы?', a: 'Нет. Ссылка лишь указывает, какие переводы использовать. Мы не спрашиваем, кто вы, и не храним ваши вопросы.' },
    ],
  },
  more: {
    title: 'Ещё от Midvash',
    reader: { title: 'Midvash: Библия и ежедневное чтение', body: 'Читайте Библию, следуйте ежедневному плану размышлений и изучайте Писание с комментариями в браузере, на iPhone и Android.' },
    api: { title: 'API Библии', body: 'Тот же каталог в JSON, бесплатно и без ключа, для разработчиков, которым нужен текст Библии в своём приложении.' },
    wordpress: { title: 'Плагин для WordPress', body: 'Превращает ссылки на Писание на сайте вашей церкви в стихи, которые читатель открывает прямо на странице.' },
  },
  footer: {
    brandBy: 'от Midvash',
    productsTitle: 'Продукты',
    productLabels: {
      reader: 'Читалка Библии',
      api: 'API Библии',
      mcp: 'MCP Библии',
      wordpress: 'Плагин WordPress',
      chrome: 'Расширение Chrome',
      ios: 'Приложение iOS',
      android: 'Приложение Android',
    },
    openSourceTitle: 'Open source',
    allReposLabel: 'Все репозитории →',
    soonBadge: 'Скоро',
    socialLabel: 'Подписывайтесь',
    instagramLabel: 'Посетите наш Instagram',
    githubLabel: 'Посетите наш GitHub',
    tagline: 'Open source · Бесплатно навсегда · Без регистрации',
    copyright: `© 2025-${new Date().getFullYear()} Midvash. Все права защищены.`,
    creditPrefix: 'Разработал',
  },
};

const ko: Translations = {
  htmlLang: 'ko',
  meta: {
    title: 'ChatGPT, Claude, Gemini용 성경 MCP | Midvash',
    description:
      '무료 성경 MCP: ChatGPT, Claude, Gemini, Cursor를 31개 언어 62개 자유 성경 번역본과 주석, 스트롱 사전에 연결하세요. 계정도 키도 필요 없습니다.',
  },
  nav: { skipToContent: '본문으로 건너뛰기' },
  hero: {
    eyebrow: '무료 · 계정 불필요 · API 키 불필요',
    title: '당신의 AI를',
    titleAccent: '성경에 연결하세요',
    subtitle:
      'AI가 더 이상 기억에 의존해 성경을 인용하지 않습니다. Midvash와 함께라면 31개 언어, 62개 자유 성경 번역본의 실제 본문을 읽고, 검색하고, 번역본을 비교하고, 각 장을 설명합니다. ChatGPT, Claude, Gemini, Cursor에서 사용할 수 있습니다.',
    cta: '내 링크 만들기',
    ctaSecondary: '무엇을 물어볼 수 있을까요',
    facts: ['31개 언어, 62개 번역본', '11가지 성경 공부 도구', '1,189개 장 전체 주석'],
  },
  uses: {
    title: '성경을 공부하는 분들을 위해 만들었습니다',
    subtitle: '개발자일 필요가 없습니다. 평소 말로 물어보면 AI가 출처와 함께 찾아 드립니다.',
    items: [
      { who: '목회자', prompt: '“로마서 8:28-39로 설교 개요를 잡아 주고 개역한글판과 KJV를 비교해 줘.”' },
      { who: '교회학교 교사', prompt: '“주일 공과에 쓸 수 있게 요한복음 3:16의 관주 구절을 정리해 줘.”' },
      { who: '학생', prompt: '“헬라어 아가페는 무슨 뜻이고 고린도전서 13장 어디에 나와?”' },
      { who: '매일 묵상', prompt: '“개역한글판으로 시편 23편을 읽고 이 장의 내용을 설명해 줘.”' },
    ],
  },
  how: {
    title: '사용 방법',
    cards: [
      { num: '01', title: '성경 번역본 고르기', body: 'AI가 사용할 번역본을 고르세요. 개역한글판, BSB, KJV 등 모두 퍼블릭 도메인이거나 오픈 라이선스입니다.' },
      { num: '02', title: '링크 복사하기', body: '개인 링크를 만들어 드립니다. 계정도, 이메일도, 설치도 필요 없습니다.' },
      { num: '03', title: 'AI에 붙여넣기', body: 'ChatGPT, Claude, Gemini 또는 Cursor에 링크를 커넥터로 추가하세요. 그때부터 AI가 실제 본문을 찾아보고 출처를 밝힙니다.' },
    ],
  },
  configure: {
    title: '내 링크 만들기',
    subtitle: 'AI가 사용할 성경 번역본을 고르세요. 처음 선택한 번역본이 기본값이 됩니다.',
    languagesLabel: '1. 언어로 거르기',
    versionsLabel: '2. 성경 번역본 선택',
    versionsHelper: '팁: 2~3개 번역본을 고르면 답변이 가장 깔끔합니다.',
    generateBtn: '내 링크 만들기',
    selectAll: '보이는 항목 모두 선택',
    clearAll: '지우기',
    needSelection: '성경 번역본을 하나 이상 선택하세요.',
    urlLabel: '내 연결 링크',
    urlHelper: '이 링크를 ChatGPT나 Claude에 붙여넣으세요. 방법은 바로 아래에 있습니다.',
    jsonLabel: 'Cursor 및 기타 편집기용 (mcp.json)',
    geminiLabel: 'Gemini CLI용 (터미널에서 실행)',
    copyBtn: '복사',
    copiedBtn: '복사됨!',
    copyError: '클립보드에 복사할 수 없습니다.',
  },
  clients: {
    title: 'AI에 추가하기',
    subtitle: '위에서 만든 링크를 사용하세요. 1분 정도 걸립니다.',
    chatgpt: { name: 'ChatGPT', tier: 'Plus, Pro, Business, Enterprise 또는 Edu', steps: ['설정 › 앱에서 개발자 모드를 켜세요 (고급 설정 안에 있음)', '앱 만들기를 누르고 이름을 Midvash로 정한 뒤 링크를 붙여넣고 인증 없음을 선택하세요', '대화창에서 +를 누르고 Midvash를 켜세요'] },
    claude: { name: 'Claude', tier: '무료 (사용자 지정 커넥터 1개), Pro, Max, Team 또는 Enterprise', steps: ['claude.ai에서 사용자 지정 › 커넥터로 이동하세요', '+ › 사용자 지정 커넥터 추가를 누르고 링크를 붙여넣으세요', '대화창에서 + › 커넥터를 누르고 Midvash를 켜세요'] },
    gemini: { name: 'Gemini', tier: 'Gemini CLI (터미널)', steps: ['컴퓨터에 Gemini CLI를 설치하세요', '링크 아래에 표시된 명령을 실행하세요', 'gemini를 실행하고 원하는 본문을 물어보세요'] },
    cursor: { name: 'Cursor', tier: '데스크톱 편집기', steps: ['Cursor 설정을 열고 MCP 항목으로 이동하세요', '새 MCP 서버를 추가하세요 (mcp.json이 열립니다)', '링크 아래에 표시된 JSON을 붙여넣고 저장하세요'] },
  },
  tools: {
    title: 'AI가 할 수 있는 일',
    subtitle: '질문에 필요할 때 AI가 알아서 사용하는 11가지 도구입니다.',
    items: {
      get_passage: '“요한복음 3:16-18” 같은 출처로 어떤 본문이든 읽습니다.',
      get_verse: '한 절 또는 여러 절을 가져옵니다.',
      get_chapter: '한 장 전체를 읽습니다.',
      search_bible: '카탈로그의 모든 언어에서 단어나 정확한 구절로 말씀을 찾습니다.',
      compare_passage: '같은 본문을 여러 번역본으로 나란히 보여 줍니다.',
      get_cross_references: '343,546개 연결 가운데 관련 구절을 본문과 함께 보여 줍니다.',
      get_commentary: '각 장의 내용을 설명합니다. 1,189개 장 전체, 9개 언어.',
      search_study: '장별 주석, 성경 인물, 사전 항목, 신학 글을 검색합니다.',
      get_strongs: '스트롱 사전(14,197개 항목)으로 히브리어와 헬라어 단어를 설명합니다.',
      list_versions: '내 링크에서 쓸 수 있는 번역본을 보여 줍니다.',
      list_books: '성경 66권 목록을 보여 줍니다.',
    },
    prompts: '설교 준비, 묵상, 단어 연구, 번역본 비교를 위한 4가지 기본 프롬프트도 들어 있습니다.',
  },
  versions: {
    title: '번역본과 라이선스',
    body: '카탈로그에는 31개 언어로 된 62개 번역본이 있으며, Midvash 공개 API와 같습니다. AI가 자유롭게 인용할 수 있도록 퍼블릭 도메인이거나 오픈 라이선스인 번역본만 포함합니다. 저작권이 보호되는 번역본은 여기서 제공하지 않습니다.',
    creditNote: '“출처 표시”가 붙은 번역본은 Creative Commons 같은 라이선스를 따릅니다. AI는 본문 끝에 출처 표시 문구를 함께 받습니다.',
    creditBadge: '출처 표시',
    apiCta: '내 앱이나 사이트에서 이 본문이 필요하신가요? 무료 성경 API를 사용하세요',
  },
  faq: {
    title: '자주 묻는 질문',
    items: [
      { q: '정말 무료인가요?', a: '네. 계정도, API 키도, 광고도 없습니다. 비용이 들 수 있는 것은 AI 자체입니다. ChatGPT는 유료 요금제에서만 사용자 지정 앱을 지원하고, Claude는 무료 요금제에서도 사용자 지정 커넥터 1개를 허용합니다.' },
      { q: '프로그래밍을 알아야 하나요?', a: '아니요. 링크를 복사해서 AI 설정에 붙여넣으면 됩니다. JSON과 터미널 명령은 Cursor와 Gemini CLI에만 필요합니다.' },
      { q: 'AI는 어떤 번역본을 사용하나요?', a: '링크의 첫 번째 번역본입니다. 링크에 있는 다른 번역본도 이름으로 요청할 수 있습니다. 번역본이 없는 링크는 영어 Berean Standard Bible (BSB)을 사용합니다.' },
      { q: '즐겨 읽는 번역본이 왜 없나요?', a: '널리 쓰이는 번역본 중 많은 수가 저작권 보호를 받아 재배포할 수 없습니다. 여기에는 퍼블릭 도메인이거나 오픈 라이선스인 번역본만 들어 있습니다. midvash.com에서는 더 많은 번역본을 읽을 수 있습니다.' },
      { q: '히브리어, 헬라어, 아랍어 검색도 되나요?', a: '네. 카탈로그의 모든 언어에서 검색할 수 있고, 악센트와 대소문자를 무시하며, 모음 부호 없이 입력한 히브리어와 아랍어 단어도 찾습니다.' },
      { q: '제 질문을 저장하나요?', a: '아니요. 링크에는 사용할 번역본 정보만 들어 있습니다. 누구인지 묻지 않고, 질문도 저장하지 않습니다.' },
    ],
  },
  more: {
    title: 'Midvash의 다른 서비스',
    reader: { title: 'Midvash: 성경 & 묵상', body: '웹, iPhone, Android에서 성경을 읽고, 매일 묵상을 따라가고, 주석과 함께 공부하세요.' },
    api: { title: '성경 API', body: '같은 카탈로그를 JSON으로 무료, 키 없이 제공합니다. 자신의 앱에 성경 본문을 넣고 싶은 개발자를 위한 것입니다.' },
    wordpress: { title: 'WordPress 플러그인', body: '교회나 사역 웹사이트의 성경 출처를 독자가 그 자리에서 열어 볼 수 있는 말씀으로 바꿔 줍니다.' },
  },
  footer: {
    brandBy: 'Midvash 제작',
    productsTitle: '제품',
    productLabels: {
      reader: '성경 리더',
      api: '성경 API',
      mcp: '성경 MCP',
      wordpress: 'WordPress 플러그인',
      chrome: 'Chrome 확장 프로그램',
      ios: 'iOS 앱',
      android: 'Android 앱',
    },
    openSourceTitle: '오픈 소스',
    allReposLabel: '모든 저장소 →',
    soonBadge: '곧 출시',
    socialLabel: '팔로우',
    instagramLabel: '인스타그램 방문',
    githubLabel: 'GitHub 방문',
    tagline: '오픈 소스 · 영구 무료 · 가입 불필요',
    copyright: `© 2025-${new Date().getFullYear()} Midvash. 모든 권리 보유.`,
    creditPrefix: '개발:',
  },
};

export const TRANSLATIONS: Record<Locale, Translations> = {
  en,
  es,
  'pt-br': ptBr,
  fr,
  de,
  it,
  zh,
  ru,
  ko,
};

/**
 * Mapeia uma rota de URL para o locale correspondente.
 *  /        → en (canônico)
 *  /<loc>   → loc (pt-br, es, fr, de, it, zh, ru, ko)
 */
const PATH_TO_LOCALE: Record<string, Locale> = {
  '/pt-br': 'pt-br',
  '/es': 'es',
  '/fr': 'fr',
  '/de': 'de',
  '/it': 'it',
  '/zh': 'zh',
  '/ru': 'ru',
  '/ko': 'ko',
};

export function localeFromPath(pathname: string): Locale | null {
  const clean = pathname.replace(/\/+$/, '');
  if (clean === '' || clean === '/') return 'en';
  return PATH_TO_LOCALE[clean] ?? null;
}

/**
 * Retorna o caminho público correspondente a um locale.
 * Inglês é canônico em "/".
 */
export function pathForLocale(locale: Locale): string {
  if (locale === 'en') return '/';
  return `/${locale}`;
}
