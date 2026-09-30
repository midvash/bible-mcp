export interface VersionDefinition {
    slug: string;
    name: string; // Full Name (e.g. "Almeida Revista e Atualizada")
    shortName: string; // Abbreviation (e.g. "ARA")
    language: 'pt-br' | 'en' | 'es' | 'he' | 'la' | 'fr' | 'it' | 'gr' | 'pt-pt';
    hasOldTestament: boolean;
    hasNewTestament: boolean;
    totalBooks: number;
    totalChapters: number;
}

// Based on manifest.json from R2 - 35 versions available
export const VERSIONS: VersionDefinition[] = [
    { slug: 'aa', name: 'Almeida e Atualizada', shortName: 'AA', language: 'pt-br', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1100 },
    { slug: 'acf', name: 'Almeida Corrigida Fiel', shortName: 'ACF', language: 'pt-br', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1102 },
    { slug: 'aleppo', name: 'Aleppo Codex', shortName: 'ALEPPO', language: 'he', hasOldTestament: true, hasNewTestament: false, totalBooks: 39, totalChapters: 819 },
    { slug: 'ara', name: 'Almeida Revista e Atualizada', shortName: 'ARA', language: 'pt-br', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1102 },
    { slug: 'arc', name: 'Almeida Revista e Corrigida', shortName: 'ARC', language: 'pt-br', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1102 },
    { slug: 'as21', name: 'Almeida Século 21', shortName: 'AS21', language: 'pt-br', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1102 },
    { slug: 'bhs', name: 'Biblia Hebraica Stuttgartensia', shortName: 'BHS', language: 'he', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1102 },
    { slug: 'bpt', name: 'Bíblia para Todos', shortName: 'BPT', language: 'pt-pt', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1094 },
    { slug: 'clem', name: 'Clementine Vulgate', shortName: 'CLEM', language: 'la', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1039 },
    { slug: 'esv', name: 'English Standard Version', shortName: 'ESV', language: 'en', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1036 },
    { slug: 'jfaa', name: 'João Ferreira de Almeida Atualizada', shortName: 'JFAA', language: 'pt-br', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1036 },
    { slug: 'kja', name: 'King James Atualizada', shortName: 'KJA', language: 'pt-br', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1036 },
    { slug: 'kjf', name: 'King James Fiel', shortName: 'KJF', language: 'pt-br', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1036 },
    { slug: 'kjv', name: 'King James Version', shortName: 'KJV', language: 'en', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1036 },
    { slug: 'lsg', name: 'Louis Segond', shortName: 'LSG', language: 'fr', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1036 },
    { slug: 'mh', name: 'Modern Hebrew', shortName: 'MH', language: 'he', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1046 },
    { slug: 'msgpt', name: 'A Mensagem', shortName: 'MSGPT', language: 'pt-br', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1037 },
    { slug: 'msg', name: 'The Message', shortName: 'MSG', language: 'en', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1036 },
    { slug: 'naa', name: 'Nova Almeida Atualizada', shortName: 'NAA', language: 'pt-br', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1036 },
    { slug: 'nbv', name: 'Nova Bíblia Viva', shortName: 'NBV', language: 'pt-br', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1036 },
    { slug: 'niv', name: 'New International Version', shortName: 'NIV', language: 'en', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1049 },
    { slug: 'nkjv', name: 'New King James Version', shortName: 'NKJV', language: 'en', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1036 },
    { slug: 'nlt', name: 'New Living Translation', shortName: 'NLT', language: 'en', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1050 },
    { slug: 'nri', name: 'Nuova Riveduta', shortName: 'NRI', language: 'it', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1038 },
    { slug: 'ntlh', name: 'Nova Tradução na Linguagem de Hoje', shortName: 'NTLH', language: 'pt-br', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1050 },
    { slug: 'ntv', name: 'Nueva Traducción Viviente', shortName: 'NTV', language: 'es', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1036 },
    { slug: 'nvi', name: 'Nova Versão Internacional', shortName: 'NVI', language: 'pt-br', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1036 },
    { slug: 'nvies', name: 'Nueva Versión Internacional', shortName: 'NVI', language: 'es', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1036 },
    { slug: 'nvl', name: 'Nova Vulgata', shortName: 'NVL', language: 'la', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1038 },
    { slug: 'nvt', name: 'Nova Versão Transformadora', shortName: 'NVT', language: 'pt-br', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1036 },
    { slug: 'osmh', name: 'Open Scriptures Morphological Hebrew', shortName: 'OSMH', language: 'he', hasOldTestament: true, hasNewTestament: false, totalBooks: 39, totalChapters: 775 },
    { slug: 'rvr1960', name: 'Reina-Valera 1960', shortName: 'RVR1960', language: 'es', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1036 },
    { slug: 'tr', name: 'Textus Receptus', shortName: 'TR', language: 'gr', hasOldTestament: false, hasNewTestament: true, totalBooks: 27, totalChapters: 257 },
    { slug: 'vulg', name: 'Biblia Sacra Vulgata', shortName: 'VULG', language: 'la', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1031 },
    { slug: 'wlc', name: 'Westminster Leningrad Codex', shortName: 'WLC', language: 'he', hasOldTestament: true, hasNewTestament: false, totalBooks: 39, totalChapters: 776 }
];
