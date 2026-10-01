export interface VersionDefinition {
    slug: string;
    name: string; // Full Name (e.g. "Almeida Revista e Atualizada")
    shortName: string; // Abbreviation (e.g. "ARA")
    language: 'pt-br' | 'en' | 'es' | 'he' | 'la' | 'fr' | 'it' | 'gr' | 'pt-pt';
    hasOldTestament: boolean;
    hasNewTestament: boolean;
    totalBooks: number;
    totalChapters: number;
    /**
     * Crédito exigido pela licença (CC BY-SA etc.). Quando existe, as tools
     * imprimem esta linha no fim de todo texto bíblico desta versão.
     */
    copyright?: string;
}

// Só versões que o Midvash pode redistribuir (domínio público ou licença livre).
// As com direitos reservados ficam comentadas, com o motivo.
export const VERSIONS: VersionDefinition[] = [
    // aa fora do ar: direitos reservados, sem licença pra redistribuir (out/2026). Religar = voltar esta linha.
    // { slug: 'aa', name: 'Almeida e Atualizada', shortName: 'AA', language: 'pt-br', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1100 },
    // acf fora do ar: direitos reservados, sem licença pra redistribuir (out/2026). Religar = voltar esta linha.
    // { slug: 'acf', name: 'Almeida Corrigida Fiel', shortName: 'ACF', language: 'pt-br', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1102 },
    { slug: 'aleppo', name: 'Aleppo Codex', shortName: 'ALEPPO', language: 'he', hasOldTestament: true, hasNewTestament: false, totalBooks: 39, totalChapters: 819 },
    // ara fora do ar: direitos reservados, sem licença pra redistribuir (out/2026). Religar = voltar esta linha.
    // { slug: 'ara', name: 'Almeida Revista e Atualizada', shortName: 'ARA', language: 'pt-br', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1102 },
    // arc fora do ar: direitos reservados, sem licença pra redistribuir (out/2026). Religar = voltar esta linha.
    // { slug: 'arc', name: 'Almeida Revista e Corrigida', shortName: 'ARC', language: 'pt-br', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1102 },
    // as21 fora do ar: direitos reservados, sem licença pra redistribuir (out/2026). Religar = voltar esta linha.
    // { slug: 'as21', name: 'Almeida Século 21', shortName: 'AS21', language: 'pt-br', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1102 },
    // bhs fora do ar: direitos reservados, sem licença pra redistribuir (out/2026). Religar = voltar esta linha.
    // { slug: 'bhs', name: 'Biblia Hebraica Stuttgartensia', shortName: 'BHS', language: 'he', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1102 },
    // bpt fora do ar: direitos reservados, sem licença pra redistribuir (out/2026). Religar = voltar esta linha.
    // { slug: 'bpt', name: 'Bíblia para Todos', shortName: 'BPT', language: 'pt-pt', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1094 },
    { slug: 'almeida-livre', name: 'Bíblia Livre (Almeida 1819)', shortName: 'BL', language: 'pt-br', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'bpm', name: 'Bíblia Portuguesa Mundial', shortName: 'BPM', language: 'pt-br', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'bsb', name: 'Berean Standard Bible', shortName: 'BSB', language: 'en', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'clem', name: 'Clementine Vulgate', shortName: 'CLEM', language: 'la', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1039 },
    // esv fora do ar: direitos reservados, sem licença pra redistribuir (out/2026). Religar = voltar esta linha.
    // { slug: 'esv', name: 'English Standard Version', shortName: 'ESV', language: 'en', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1036 },
    // jfaa fora do ar: direitos reservados, sem licença pra redistribuir (out/2026). Religar = voltar esta linha.
    // { slug: 'jfaa', name: 'João Ferreira de Almeida Atualizada', shortName: 'JFAA', language: 'pt-br', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1036 },
    // kja fora do ar: direitos reservados, sem licença pra redistribuir (out/2026). Religar = voltar esta linha.
    // { slug: 'kja', name: 'King James Atualizada', shortName: 'KJA', language: 'pt-br', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1036 },
    // kjf (King James Fiel 1611) fora do ar: a BV Books Editora exige licença paga (out/2026). Religar = voltar esta linha.
    // { slug: 'kjf', name: 'King James Fiel', shortName: 'KJF', language: 'pt-br', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1036 },
    { slug: 'kjv', name: 'King James Version', shortName: 'KJV', language: 'en', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1036 },
    { slug: 'lsg', name: 'Louis Segond', shortName: 'LSG', language: 'fr', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1036 },
    // mh fora do ar: direitos reservados, sem licença pra redistribuir (out/2026). Religar = voltar esta linha.
    // { slug: 'mh', name: 'Modern Hebrew', shortName: 'MH', language: 'he', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1046 },
    // msgpt fora do ar: direitos reservados, sem licença pra redistribuir (out/2026). Religar = voltar esta linha.
    // { slug: 'msgpt', name: 'A Mensagem', shortName: 'MSGPT', language: 'pt-br', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1037 },
    // msg fora do ar: direitos reservados, sem licença pra redistribuir (out/2026). Religar = voltar esta linha.
    // { slug: 'msg', name: 'The Message', shortName: 'MSG', language: 'en', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1036 },
    // naa fora do ar: direitos reservados, sem licença pra redistribuir (out/2026). Religar = voltar esta linha.
    // { slug: 'naa', name: 'Nova Almeida Atualizada', shortName: 'NAA', language: 'pt-br', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1036 },
    // nbv fora do ar: direitos reservados, sem licença pra redistribuir (out/2026). Religar = voltar esta linha.
    // { slug: 'nbv', name: 'Nova Bíblia Viva', shortName: 'NBV', language: 'pt-br', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1036 },
    // niv fora do ar: direitos reservados, sem licença pra redistribuir (out/2026). Religar = voltar esta linha.
    // { slug: 'niv', name: 'New International Version', shortName: 'NIV', language: 'en', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1049 },
    // nkjv fora do ar: direitos reservados, sem licença pra redistribuir (out/2026). Religar = voltar esta linha.
    // { slug: 'nkjv', name: 'New King James Version', shortName: 'NKJV', language: 'en', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1036 },
    // nlt fora do ar: direitos reservados, sem licença pra redistribuir (out/2026). Religar = voltar esta linha.
    // { slug: 'nlt', name: 'New Living Translation', shortName: 'NLT', language: 'en', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1050 },
    { slug: 'nva', name: 'Bíblia Nova Versão de Acesso Livre', shortName: 'NVA', language: 'pt-br', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Bíblia Nova Versão de Acesso Livre (NVA). Licença CC BY-SA 4.0. Fonte: biblianva.com.br.' },
    { slug: 'nri', name: 'Nuova Riveduta', shortName: 'NRI', language: 'it', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1038 },
    // ntlh fora do ar: direitos reservados, sem licença pra redistribuir (out/2026). Religar = voltar esta linha.
    // { slug: 'ntlh', name: 'Nova Tradução na Linguagem de Hoje', shortName: 'NTLH', language: 'pt-br', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1050 },
    // ntv fora do ar: direitos reservados, sem licença pra redistribuir (out/2026). Religar = voltar esta linha.
    // { slug: 'ntv', name: 'Nueva Traducción Viviente', shortName: 'NTV', language: 'es', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1036 },
    // nvi fora do ar: direitos reservados, sem licença pra redistribuir (out/2026). Religar = voltar esta linha.
    // { slug: 'nvi', name: 'Nova Versão Internacional', shortName: 'NVI', language: 'pt-br', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1036 },
    // nvies fora do ar: direitos reservados, sem licença pra redistribuir (out/2026). Religar = voltar esta linha.
    // { slug: 'nvies', name: 'Nueva Versión Internacional', shortName: 'NVI', language: 'es', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1036 },
    // nvl fora do ar: direitos reservados, sem licença pra redistribuir (out/2026). Religar = voltar esta linha.
    // { slug: 'nvl', name: 'Nova Vulgata', shortName: 'NVL', language: 'la', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1038 },
    // nvt fora do ar: direitos reservados, sem licença pra redistribuir (out/2026). Religar = voltar esta linha.
    // { slug: 'nvt', name: 'Nova Versão Transformadora', shortName: 'NVT', language: 'pt-br', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1036 },
    { slug: 'onbv', name: 'Open Nova Bíblia Viva', shortName: 'ONBV', language: 'pt-br', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Biblica® Open Nova Bíblia Viva™ © 2007, 2010 Biblica, Inc. Licença CC BY-SA 4.0. Disponível gratuitamente em open.bible.' },
    { slug: 'osmh', name: 'Open Scriptures Morphological Hebrew', shortName: 'OSMH', language: 'he', hasOldTestament: true, hasNewTestament: false, totalBooks: 39, totalChapters: 775 },
    // rvr1960 fora do ar: as Sociedades Bíblicas Unidas não licenciaram (out/2026). Religar = voltar esta linha.
    // { slug: 'rvr1960', name: 'Reina-Valera 1960', shortName: 'RVR1960', language: 'es', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1036 },
    { slug: 'rvr1909', name: 'Reina-Valera 1909', shortName: 'RVR1909', language: 'es', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1036 },
    { slug: 'tr', name: 'Textus Receptus', shortName: 'TR', language: 'gr', hasOldTestament: false, hasNewTestament: true, totalBooks: 27, totalChapters: 257 },
    { slug: 'vulg', name: 'Biblia Sacra Vulgata', shortName: 'VULG', language: 'la', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1031 },
    { slug: 'web', name: 'World English Bible', shortName: 'WEB', language: 'en', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'wlc', name: 'Westminster Leningrad Codex', shortName: 'WLC', language: 'he', hasOldTestament: true, hasNewTestament: false, totalBooks: 39, totalChapters: 776 }
];
