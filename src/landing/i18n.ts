/**
 * Traduções da landing page para os 9 idiomas suportados.
 * Inglês é o idioma oficial (rota /); demais locales em /pt-br, /es,
 * /fr, /de, /it, /zh, /ru, /ko.
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
    jsonLabel: string;
    copyBtn: string;
    copiedBtn: string;
    copyError: string;
  };
  clients: {
    title: string;
    subtitle: string;
    chatgpt: { name: string; tier: string; steps: string[] };
    claude: { name: string; tier: string; steps: string[] };
    gemini: { name: string; tier: string; steps: string[] };
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
    title: 'Midvash MCP — Connect any AI to the Bible',
    description:
      "The free, public Bible MCP server. Get accurate Scripture in 35+ versions and 8 languages — directly inside ChatGPT, Claude, and Gemini.",
  },
  nav: {
    skipToContent: 'Skip to content',
  },
  hero: {
    eyebrow: 'Free · No signup',
    title: 'Connect any AI to the',
    titleAccent: 'Bible',
    subtitle:
      'Give ChatGPT, Claude, or Gemini direct access to accurate Scripture in 35+ Bible versions and 8 languages — straight from Midvash.',
    cta: 'Set up my connection',
  },
  how: {
    title: 'How it works',
    cards: [
      {
        num: '01',
        title: 'Pick your Bibles',
        body: 'Choose the languages and versions you want your AI to use. NIV, KJV, ESV, NVI, RVR1960 and 30+ more.',
      },
      {
        num: '02',
        title: 'Get your link',
        body: 'We generate a personal connection link for you — no account, no email, no setup.',
      },
      {
        num: '03',
        title: 'Paste it into your AI',
        body: 'Add the link to ChatGPT, Claude or Gemini in two clicks. Your AI now quotes the Bible perfectly.',
      },
    ],
  },
  configure: {
    title: 'Set up your connection',
    subtitle: 'Pick the languages and Bible versions your AI will use.',
    languagesLabel: '1. Choose your languages',
    versionsLabel: '2. Choose your Bible versions',
    versionsHelper: 'Tip: keep it small (2–3 versions) for the cleanest answers.',
    generateBtn: 'Generate my connection',
    selectAll: 'Select all',
    clearAll: 'Clear',
    needSelection: 'Please select at least one Bible version.',
    urlLabel: 'Your connection link',
    jsonLabel: 'Configuration (for advanced clients)',
    copyBtn: 'Copy',
    copiedBtn: 'Copied!',
    copyError: "Couldn't copy to clipboard.",
  },
  clients: {
    title: 'Use it inside your favorite AI',
    subtitle: 'Three of the most popular AI assistants now support adding external knowledge sources like Midvash.',
    chatgpt: {
      name: 'ChatGPT',
      tier: 'Plus, Pro or Business',
      steps: [
        'Open ChatGPT and go to Settings',
        'Click on "Connectors"',
        'Add a new custom connector and paste your link',
      ],
    },
    claude: {
      name: 'Claude',
      tier: 'Pro or Max plan',
      steps: [
        'Open Claude.ai and go to Settings',
        'Click on "Connectors"',
        'Add a custom connector and paste your link',
      ],
    },
    gemini: {
      name: 'Gemini',
      tier: 'Gemini CLI / Code Assist',
      steps: [
        'Open your Gemini configuration',
        'Find the MCP servers section',
        'Paste the JSON below into your config',
      ],
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

const es: Translations = {
  htmlLang: 'es',
  meta: {
    title: 'Midvash MCP — Conecta cualquier IA a la Biblia',
    description:
      'El servidor MCP público y gratuito de la Biblia. Obtén citas precisas en más de 35 versiones y 8 idiomas — directamente en ChatGPT, Claude y Gemini.',
  },
  nav: {
    skipToContent: 'Saltar al contenido',
  },
  hero: {
    eyebrow: 'Gratis · Sin registro',
    title: 'Conecta cualquier IA a la',
    titleAccent: 'Biblia',
    subtitle:
      'Dale a ChatGPT, Claude o Gemini acceso directo a citas bíblicas precisas en más de 35 versiones y 8 idiomas — directamente desde Midvash.',
    cta: 'Configurar mi conexión',
  },
  how: {
    title: 'Cómo funciona',
    cards: [
      {
        num: '01',
        title: 'Elige tus Biblias',
        body: 'Elige los idiomas y versiones que quieres que use tu IA. NVI, RVR1960, NTV, KJV y más de 30 opciones.',
      },
      {
        num: '02',
        title: 'Obtén tu enlace',
        body: 'Generamos un enlace de conexión personal — sin cuenta, sin correo, sin instalación.',
      },
      {
        num: '03',
        title: 'Pégalo en tu IA',
        body: 'Añade el enlace en ChatGPT, Claude o Gemini en dos clics. Tu IA ahora cita la Biblia perfectamente.',
      },
    ],
  },
  configure: {
    title: 'Configura tu conexión',
    subtitle: 'Elige los idiomas y versiones bíblicas que tu IA usará.',
    languagesLabel: '1. Elige los idiomas',
    versionsLabel: '2. Elige las versiones bíblicas',
    versionsHelper: 'Consejo: mantén la lista corta (2–3 versiones) para obtener respuestas más limpias.',
    generateBtn: 'Generar mi conexión',
    selectAll: 'Seleccionar todo',
    clearAll: 'Limpiar',
    needSelection: 'Selecciona al menos una versión bíblica.',
    urlLabel: 'Tu enlace de conexión',
    jsonLabel: 'Configuración (para clientes avanzados)',
    copyBtn: 'Copiar',
    copiedBtn: '¡Copiado!',
    copyError: 'No se pudo copiar al portapapeles.',
  },
  clients: {
    title: 'Úsalo dentro de tu IA favorita',
    subtitle: 'Tres de los asistentes de IA más populares ya permiten añadir fuentes de conocimiento externas como Midvash.',
    chatgpt: {
      name: 'ChatGPT',
      tier: 'Plus, Pro o Business',
      steps: [
        'Abre ChatGPT y entra en Configuración',
        'Haz clic en "Conectores"',
        'Añade un nuevo conector personalizado y pega tu enlace',
      ],
    },
    claude: {
      name: 'Claude',
      tier: 'Plan Pro o Max',
      steps: [
        'Abre Claude.ai y entra en Configuración',
        'Haz clic en "Conectores"',
        'Añade un conector personalizado y pega tu enlace',
      ],
    },
    gemini: {
      name: 'Gemini',
      tier: 'Gemini CLI / Code Assist',
      steps: [
        'Abre tu configuración de Gemini',
        'Busca la sección de servidores MCP',
        'Pega el JSON de abajo en tu configuración',
      ],
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

const ptBr: Translations = {
  htmlLang: 'pt-BR',
  meta: {
    title: 'Midvash MCP — Conecte qualquer IA à Bíblia',
    description:
      'O servidor MCP público e gratuito da Bíblia. Receba citações bíblicas precisas em mais de 35 versões e 8 idiomas — direto no ChatGPT, Claude e Gemini.',
  },
  nav: {
    skipToContent: 'Pular para o conteúdo',
  },
  hero: {
    eyebrow: 'Grátis · Sem cadastro',
    title: 'Conecte qualquer IA à',
    titleAccent: 'Bíblia',
    subtitle:
      'Dê ao ChatGPT, Claude ou Gemini acesso direto a citações bíblicas precisas em mais de 35 versões e 8 idiomas — direto do Midvash.',
    cta: 'Configurar minha conexão',
  },
  how: {
    title: 'Como funciona',
    cards: [
      {
        num: '01',
        title: 'Escolha suas Bíblias',
        body: 'Escolha os idiomas e versões que sua IA vai usar. NVI, ARA, ACF, NAA, NTLH e mais de 30 opções.',
      },
      {
        num: '02',
        title: 'Receba seu link',
        body: 'Geramos um link de conexão pessoal — sem conta, sem e-mail, sem instalação.',
      },
      {
        num: '03',
        title: 'Cole na sua IA',
        body: 'Adicione o link no ChatGPT, Claude ou Gemini em dois cliques. Sua IA passa a citar a Bíblia perfeitamente.',
      },
    ],
  },
  configure: {
    title: 'Configure sua conexão',
    subtitle: 'Escolha os idiomas e versões bíblicas que sua IA vai usar.',
    languagesLabel: '1. Escolha os idiomas',
    versionsLabel: '2. Escolha as versões da Bíblia',
    versionsHelper: 'Dica: mantenha a lista curta (2–3 versões) para respostas mais claras.',
    generateBtn: 'Gerar minha conexão',
    selectAll: 'Selecionar todas',
    clearAll: 'Limpar',
    needSelection: 'Selecione pelo menos uma versão da Bíblia.',
    urlLabel: 'Seu link de conexão',
    jsonLabel: 'Configuração (para clientes avançados)',
    copyBtn: 'Copiar',
    copiedBtn: 'Copiado!',
    copyError: 'Não foi possível copiar.',
  },
  clients: {
    title: 'Use dentro da sua IA favorita',
    subtitle: 'Três dos assistentes de IA mais populares já permitem adicionar fontes de conhecimento externas como o Midvash.',
    chatgpt: {
      name: 'ChatGPT',
      tier: 'Plus, Pro ou Business',
      steps: [
        'Abra o ChatGPT e vá em Configurações',
        'Clique em "Conectores"',
        'Adicione um novo conector personalizado e cole seu link',
      ],
    },
    claude: {
      name: 'Claude',
      tier: 'Plano Pro ou Max',
      steps: [
        'Abra Claude.ai e vá em Configurações',
        'Clique em "Conectores"',
        'Adicione um conector personalizado e cole seu link',
      ],
    },
    gemini: {
      name: 'Gemini',
      tier: 'Gemini CLI / Code Assist',
      steps: [
        'Abra a configuração do Gemini',
        'Localize a seção de servidores MCP',
        'Cole o JSON abaixo na sua configuração',
      ],
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

const fr: Translations = {
  htmlLang: 'fr',
  meta: {
    title: 'Midvash MCP — Connectez votre IA à la Bible',
    description:
      "Le serveur MCP public et gratuit de la Bible. Obtenez des citations précises dans plus de 35 versions et 8 langues — directement dans ChatGPT, Claude et Gemini.",
  },
  nav: { skipToContent: 'Aller au contenu' },
  hero: {
    eyebrow: 'Gratuit · Sans inscription',
    title: 'Connectez votre IA à la',
    titleAccent: 'Bible',
    subtitle:
      "Donnez à ChatGPT, Claude ou Gemini un accès direct à des Écritures précises dans plus de 35 versions et 8 langues — directement depuis Midvash.",
    cta: 'Configurer ma connexion',
  },
  how: {
    title: 'Comment ça marche',
    cards: [
      { num: '01', title: 'Choisissez vos Bibles', body: 'Sélectionnez les langues et les versions que votre IA utilisera. NIV, KJV, ESV, NVI, RVR1960 et plus de 30 autres.' },
      { num: '02', title: 'Récupérez votre lien', body: 'Nous générons un lien de connexion personnel — sans compte, sans email, sans installation.' },
      { num: '03', title: 'Collez-le dans votre IA', body: 'Ajoutez le lien à ChatGPT, Claude ou Gemini en deux clics. Votre IA cite la Bible parfaitement.' },
    ],
  },
  configure: {
    title: 'Configurez votre connexion',
    subtitle: 'Choisissez les langues et versions bibliques que votre IA utilisera.',
    languagesLabel: '1. Choisissez vos langues',
    versionsLabel: '2. Choisissez vos versions de la Bible',
    versionsHelper: 'Astuce : restez sobre (2–3 versions) pour des réponses plus claires.',
    generateBtn: 'Générer ma connexion',
    selectAll: 'Tout sélectionner',
    clearAll: 'Effacer',
    needSelection: 'Veuillez choisir au moins une version de la Bible.',
    urlLabel: 'Votre lien de connexion',
    jsonLabel: 'Configuration (pour clients avancés)',
    copyBtn: 'Copier',
    copiedBtn: 'Copié !',
    copyError: "Impossible de copier dans le presse-papiers.",
  },
  clients: {
    title: 'Utilisez-le dans votre IA préférée',
    subtitle: 'Trois des assistants IA les plus populaires permettent désormais d\'ajouter des sources externes comme Midvash.',
    chatgpt: { name: 'ChatGPT', tier: 'Plus, Pro ou Business', steps: ['Ouvrez ChatGPT et allez dans Paramètres', 'Cliquez sur « Connecteurs »', 'Ajoutez un connecteur personnalisé et collez votre lien'] },
    claude: { name: 'Claude', tier: 'Pro ou Max', steps: ['Ouvrez Claude.ai et allez dans Paramètres', 'Cliquez sur « Connecteurs »', 'Ajoutez un connecteur personnalisé et collez votre lien'] },
    gemini: { name: 'Gemini', tier: 'Gemini CLI / Code Assist', steps: ['Ouvrez votre configuration Gemini', 'Trouvez la section MCP servers', 'Collez le JSON ci-dessous dans votre config'] },
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
    title: 'Midvash MCP — Verbinde jede KI mit der Bibel',
    description:
      'Der kostenlose, öffentliche Bibel-MCP-Server. Hol dir präzise Bibelzitate in über 35 Übersetzungen und 8 Sprachen — direkt in ChatGPT, Claude und Gemini.',
  },
  nav: { skipToContent: 'Zum Inhalt springen' },
  hero: {
    eyebrow: 'Kostenlos · Keine Anmeldung',
    title: 'Verbinde jede KI mit der',
    titleAccent: 'Bibel',
    subtitle:
      'Gib ChatGPT, Claude oder Gemini direkten Zugriff auf präzise Schriftstellen in über 35 Bibelübersetzungen und 8 Sprachen — direkt von Midvash.',
    cta: 'Verbindung einrichten',
  },
  how: {
    title: 'So funktioniert es',
    cards: [
      { num: '01', title: 'Wähle deine Bibeln', body: 'Wähle die Sprachen und Übersetzungen, die deine KI nutzen soll. NIV, KJV, ESV, NVI, RVR1960 und über 30 weitere.' },
      { num: '02', title: 'Erhalte deinen Link', body: 'Wir generieren einen persönlichen Verbindungslink — ohne Konto, ohne E-Mail, ohne Setup.' },
      { num: '03', title: 'Füge ihn in deiner KI ein', body: 'Trage den Link in ChatGPT, Claude oder Gemini in zwei Klicks ein. Deine KI zitiert die Bibel perfekt.' },
    ],
  },
  configure: {
    title: 'Verbindung einrichten',
    subtitle: 'Wähle die Sprachen und Bibelübersetzungen, die deine KI nutzen wird.',
    languagesLabel: '1. Sprachen wählen',
    versionsLabel: '2. Bibelübersetzungen wählen',
    versionsHelper: 'Tipp: Halte die Liste klein (2–3 Übersetzungen) für klarere Antworten.',
    generateBtn: 'Verbindung erzeugen',
    selectAll: 'Alle auswählen',
    clearAll: 'Leeren',
    needSelection: 'Bitte wähle mindestens eine Bibelübersetzung.',
    urlLabel: 'Dein Verbindungslink',
    jsonLabel: 'Konfiguration (für fortgeschrittene Clients)',
    copyBtn: 'Kopieren',
    copiedBtn: 'Kopiert!',
    copyError: 'Konnte nicht in die Zwischenablage kopiert werden.',
  },
  clients: {
    title: 'Nutze es in deiner Lieblings-KI',
    subtitle: 'Drei der beliebtesten KI-Assistenten erlauben jetzt das Hinzufügen externer Wissensquellen wie Midvash.',
    chatgpt: { name: 'ChatGPT', tier: 'Plus, Pro oder Business', steps: ['Öffne ChatGPT und gehe zu Einstellungen', 'Klicke auf „Connectors"', 'Füge einen neuen benutzerdefinierten Connector hinzu und füge deinen Link ein'] },
    claude: { name: 'Claude', tier: 'Pro- oder Max-Plan', steps: ['Öffne Claude.ai und gehe zu Einstellungen', 'Klicke auf „Connectors"', 'Füge einen benutzerdefinierten Connector hinzu und füge deinen Link ein'] },
    gemini: { name: 'Gemini', tier: 'Gemini CLI / Code Assist', steps: ['Öffne deine Gemini-Konfiguration', 'Finde den Abschnitt MCP-Server', 'Füge das JSON unten in deine Konfiguration ein'] },
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
    title: "Midvash MCP — Collega qualsiasi IA alla Bibbia",
    description:
      'Il server MCP pubblico e gratuito della Bibbia. Ottieni citazioni bibliche precise in oltre 35 versioni e 8 lingue — direttamente in ChatGPT, Claude e Gemini.',
  },
  nav: { skipToContent: 'Vai al contenuto' },
  hero: {
    eyebrow: 'Gratuito · Senza registrazione',
    title: 'Collega qualsiasi IA alla',
    titleAccent: 'Bibbia',
    subtitle:
      'Dai a ChatGPT, Claude o Gemini accesso diretto a citazioni bibliche precise in oltre 35 versioni e 8 lingue — direttamente da Midvash.',
    cta: 'Configura la mia connessione',
  },
  how: {
    title: 'Come funziona',
    cards: [
      { num: '01', title: 'Scegli le tue Bibbie', body: 'Scegli le lingue e versioni che la tua IA userà. NIV, KJV, ESV, NVI, RVR1960 e oltre 30 altre.' },
      { num: '02', title: 'Ottieni il tuo link', body: 'Generiamo un link di connessione personale — senza account, senza email, senza installazione.' },
      { num: '03', title: "Incollalo nella tua IA", body: 'Aggiungi il link in ChatGPT, Claude o Gemini con due clic. La tua IA citerà la Bibbia perfettamente.' },
    ],
  },
  configure: {
    title: 'Configura la tua connessione',
    subtitle: 'Scegli le lingue e versioni bibliche che la tua IA userà.',
    languagesLabel: '1. Scegli le lingue',
    versionsLabel: '2. Scegli le versioni della Bibbia',
    versionsHelper: 'Suggerimento: tieni la lista breve (2–3 versioni) per risposte più chiare.',
    generateBtn: 'Genera la mia connessione',
    selectAll: 'Seleziona tutto',
    clearAll: 'Pulisci',
    needSelection: 'Seleziona almeno una versione della Bibbia.',
    urlLabel: 'Il tuo link di connessione',
    jsonLabel: 'Configurazione (per client avanzati)',
    copyBtn: 'Copia',
    copiedBtn: 'Copiato!',
    copyError: 'Impossibile copiare negli appunti.',
  },
  clients: {
    title: 'Usalo dentro la tua IA preferita',
    subtitle: 'Tre dei più popolari assistenti IA ora permettono di aggiungere fonti di conoscenza esterne come Midvash.',
    chatgpt: { name: 'ChatGPT', tier: 'Plus, Pro o Business', steps: ['Apri ChatGPT e vai in Impostazioni', 'Clicca su "Connettori"', 'Aggiungi un nuovo connettore personalizzato e incolla il tuo link'] },
    claude: { name: 'Claude', tier: 'Piano Pro o Max', steps: ['Apri Claude.ai e vai in Impostazioni', 'Clicca su "Connettori"', 'Aggiungi un connettore personalizzato e incolla il tuo link'] },
    gemini: { name: 'Gemini', tier: 'Gemini CLI / Code Assist', steps: ['Apri la configurazione di Gemini', 'Trova la sezione server MCP', 'Incolla il JSON qui sotto nella tua configurazione'] },
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
  htmlLang: 'zh',
  meta: {
    title: 'Midvash MCP — 把任意 AI 接入圣经',
    description:
      '免费、公开的圣经 MCP 服务器。在 ChatGPT、Claude 与 Gemini 中直接获取 35+ 圣经版本、8 种语言的精准经文。',
  },
  nav: { skipToContent: '跳到主要内容' },
  hero: {
    eyebrow: '免费 · 无需注册',
    title: '把任意 AI 接入',
    titleAccent: '圣经',
    subtitle:
      '让 ChatGPT、Claude 或 Gemini 直接获取 35+ 圣经版本、8 种语言的精准经文 — 来自 Midvash。',
    cta: '配置我的连接',
  },
  how: {
    title: '使用流程',
    cards: [
      { num: '01', title: '挑选圣经', body: '选择 AI 使用的语言与版本。NIV、KJV、ESV、NVI、RVR1960 等 30 多个版本。' },
      { num: '02', title: '获取链接', body: '我们为你生成专属连接链接 — 不需要账号、邮箱或安装。' },
      { num: '03', title: '粘贴到 AI', body: '两次点击即可把链接添加到 ChatGPT、Claude 或 Gemini，AI 即刻完美引用圣经。' },
    ],
  },
  configure: {
    title: '配置你的连接',
    subtitle: '选择 AI 使用的语言与圣经版本。',
    languagesLabel: '1. 选择语言',
    versionsLabel: '2. 选择圣经版本',
    versionsHelper: '建议：精简到 2–3 个版本，回答会更清晰。',
    generateBtn: '生成我的连接',
    selectAll: '全选',
    clearAll: '清除',
    needSelection: '请至少选择一个圣经版本。',
    urlLabel: '你的连接链接',
    jsonLabel: '配置（高级客户端）',
    copyBtn: '复制',
    copiedBtn: '已复制！',
    copyError: '无法复制到剪贴板。',
  },
  clients: {
    title: '在你常用的 AI 中使用',
    subtitle: '三大主流 AI 助手现在都支持添加 Midvash 这样的外部知识源。',
    chatgpt: { name: 'ChatGPT', tier: 'Plus、Pro 或 Business', steps: ['打开 ChatGPT 并进入「设置」', '点击「Connectors」', '添加自定义连接器并粘贴链接'] },
    claude: { name: 'Claude', tier: 'Pro 或 Max 计划', steps: ['打开 Claude.ai 并进入「设置」', '点击「Connectors」', '添加自定义连接器并粘贴链接'] },
    gemini: { name: 'Gemini', tier: 'Gemini CLI / Code Assist', steps: ['打开 Gemini 的配置', '找到 MCP 服务器部分', '把下方 JSON 粘贴到配置中'] },
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
    title: 'Midvash MCP — Подключите любой ИИ к Библии',
    description:
      'Бесплатный публичный MCP-сервер Библии. Получайте точные цитаты в 35+ переводах и 8 языках — прямо в ChatGPT, Claude и Gemini.',
  },
  nav: { skipToContent: 'Перейти к контенту' },
  hero: {
    eyebrow: 'Бесплатно · Без регистрации',
    title: 'Подключите любой ИИ к',
    titleAccent: 'Библии',
    subtitle:
      'Дайте ChatGPT, Claude или Gemini прямой доступ к точным библейским текстам в 35+ переводах и 8 языках — напрямую от Midvash.',
    cta: 'Настроить подключение',
  },
  how: {
    title: 'Как это работает',
    cards: [
      { num: '01', title: 'Выберите Библии', body: 'Выберите языки и переводы, которые будет использовать ИИ. NIV, KJV, ESV, NVI, RVR1960 и ещё 30+.' },
      { num: '02', title: 'Получите ссылку', body: 'Мы создадим персональную ссылку для подключения — без аккаунта, email и установки.' },
      { num: '03', title: 'Вставьте в ИИ', body: 'Добавьте ссылку в ChatGPT, Claude или Gemini в два клика. ИИ начнёт идеально цитировать Библию.' },
    ],
  },
  configure: {
    title: 'Настройте подключение',
    subtitle: 'Выберите языки и переводы Библии, которые будет использовать ваш ИИ.',
    languagesLabel: '1. Выберите языки',
    versionsLabel: '2. Выберите переводы Библии',
    versionsHelper: 'Совет: оставьте 2–3 перевода, чтобы ответы были чище.',
    generateBtn: 'Создать подключение',
    selectAll: 'Выбрать всё',
    clearAll: 'Очистить',
    needSelection: 'Выберите хотя бы один перевод Библии.',
    urlLabel: 'Ваша ссылка для подключения',
    jsonLabel: 'Конфигурация (для продвинутых клиентов)',
    copyBtn: 'Скопировать',
    copiedBtn: 'Скопировано!',
    copyError: 'Не удалось скопировать в буфер обмена.',
  },
  clients: {
    title: 'Используйте в любимом ИИ',
    subtitle: 'Три самых популярных ИИ-ассистента теперь поддерживают добавление внешних источников вроде Midvash.',
    chatgpt: { name: 'ChatGPT', tier: 'Plus, Pro или Business', steps: ['Откройте ChatGPT и перейдите в Настройки', 'Нажмите «Connectors»', 'Добавьте новый коннектор и вставьте ссылку'] },
    claude: { name: 'Claude', tier: 'План Pro или Max', steps: ['Откройте Claude.ai и перейдите в Настройки', 'Нажмите «Connectors»', 'Добавьте свой коннектор и вставьте ссылку'] },
    gemini: { name: 'Gemini', tier: 'Gemini CLI / Code Assist', steps: ['Откройте конфигурацию Gemini', 'Найдите раздел MCP servers', 'Вставьте JSON ниже в конфиг'] },
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
    title: 'Midvash MCP — 모든 AI를 성경에 연결하세요',
    description:
      '무료 공개 성경 MCP 서버. ChatGPT, Claude, Gemini에서 35개 이상의 성경 번역본과 8개 언어로 정확한 말씀을 받아보세요.',
  },
  nav: { skipToContent: '본문으로 건너뛰기' },
  hero: {
    eyebrow: '무료 · 가입 불필요',
    title: '모든 AI를 성경에',
    titleAccent: '연결',
    subtitle:
      'ChatGPT, Claude, Gemini가 35+ 성경 번역본과 8개 언어로 정확한 말씀에 바로 접근할 수 있게 — Midvash에서 직접.',
    cta: '연결 설정하기',
  },
  how: {
    title: '사용 방법',
    cards: [
      { num: '01', title: '성경 선택', body: 'AI가 사용할 언어와 번역본을 고르세요. NIV, KJV, ESV, NVI, RVR1960 등 30여 종.' },
      { num: '02', title: '링크 받기', body: '계정·이메일·설치 없이 개인 연결 링크를 생성합니다.' },
      { num: '03', title: 'AI에 붙여넣기', body: '두 번 클릭으로 ChatGPT, Claude 또는 Gemini에 추가하세요. AI가 성경을 완벽히 인용합니다.' },
    ],
  },
  configure: {
    title: '연결 설정',
    subtitle: 'AI가 사용할 언어와 성경 번역본을 선택하세요.',
    languagesLabel: '1. 언어 선택',
    versionsLabel: '2. 성경 번역본 선택',
    versionsHelper: '팁: 2–3개 번역본으로 짧게 유지하면 답변이 더 깔끔합니다.',
    generateBtn: '연결 생성',
    selectAll: '모두 선택',
    clearAll: '지우기',
    needSelection: '성경 번역본을 최소 1개 선택하세요.',
    urlLabel: '당신의 연결 링크',
    jsonLabel: '설정 (고급 클라이언트용)',
    copyBtn: '복사',
    copiedBtn: '복사됨!',
    copyError: '클립보드에 복사할 수 없습니다.',
  },
  clients: {
    title: '좋아하는 AI에서 사용하기',
    subtitle: '대표적인 AI 어시스턴트 세 종류 모두 Midvash 같은 외부 지식 소스 추가를 지원합니다.',
    chatgpt: { name: 'ChatGPT', tier: 'Plus, Pro 또는 Business', steps: ['ChatGPT를 열고 설정으로 이동', '"Connectors" 클릭', '커스텀 커넥터를 추가하고 링크 붙여넣기'] },
    claude: { name: 'Claude', tier: 'Pro 또는 Max 플랜', steps: ['Claude.ai를 열고 설정으로 이동', '"Connectors" 클릭', '커스텀 커넥터를 추가하고 링크 붙여넣기'] },
    gemini: { name: 'Gemini', tier: 'Gemini CLI / Code Assist', steps: ['Gemini 설정 열기', 'MCP 서버 섹션 찾기', '아래 JSON을 설정에 붙여넣기'] },
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
