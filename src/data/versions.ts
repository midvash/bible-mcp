export interface VersionDefinition {
    slug: string;
    name: string; // Full Name (e.g. "Almeida Revista e Atualizada")
    shortName: string; // Abbreviation (e.g. "ARA")
    language:
        | 'ar'
        | 'as'
        | 'bn'
        | 'ceb'
        | 'ckb'
        | 'cs'
        | 'da'
        | 'de'
        | 'ee'
        | 'en'
        | 'eo'
        | 'es'
        | 'fa'
        | 'fi'
        | 'fr'
        | 'gr'
        | 'gu'
        | 'ha'
        | 'haw'
        | 'he'
        | 'hi'
        | 'hil'
        | 'hne'
        | 'ht'
        | 'hu'
        | 'id'
        | 'ig'
        | 'ilo'
        | 'it'
        | 'ja'
        | 'ki'
        | 'kn'
        | 'ko'
        | 'la'
        | 'lg'
        | 'ln'
        | 'luo'
        | 'ml'
        | 'mr'
        | 'my'
        | 'nb'
        | 'nd'
        | 'ne'
        | 'nl'
        | 'ny'
        | 'om'
        | 'or'
        | 'pa'
        | 'pl'
        | 'pt-br'
        | 'pt-pt'
        | 'ro'
        | 'ru'
        | 'sn'
        | 'sr'
        | 'sv'
        | 'sw'
        | 'ta'
        | 'te'
        | 'tl'
        | 'to'
        | 'tr'
        | 'tw'
        | 'ug'
        | 'uk'
        | 'ur'
        | 'vi'
        | 'yo'
        | 'zh';
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
    { slug: 'almeida-livre', name: 'Bíblia Livre (Almeida 1819)', shortName: 'BL', language: 'pt-br', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Bíblia Livre (BLIVRE). Copyright © 2018 Diego Santos, Mario Sérgio e Marco Teles. Atualizada a partir da tradução de 1819 de João Ferreira de Almeida (edição Textus Receptus). Licença Creative Commons Atribuição 4.0 Brasil: uso livre, com menção obrigatória da obra. http://sites.google.com/site/biblialivre/.' },
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
    // nri fora do ar: era a riveduta (Luzzi 1927) com o nome "Nuova Riveduta", outra tradução (out/2026). Religar = voltar esta linha.
    // { slug: 'nri', name: 'Nuova Riveduta', shortName: 'NRI', language: 'it', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1038 },
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
    // Livres dos demais idiomas (domínio público ou licença aberta), mesmo
    // catálogo da API pública (out/2026). Banco D1 fora do padrão bible-{slug}
    // está em DB_NAME_BY_SLUG de scripts/seed-mcp-versions.mjs.
    { slug: 'luth1912', name: 'Lutherbibel 1912', shortName: 'LUTH1912', language: 'de', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'schl1951', name: 'Schlachter 1951', shortName: 'SCHL1951', language: 'de', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'elb1905', name: 'Elberfelder 1905', shortName: 'ELB1905', language: 'de', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'diodati', name: 'Bibbia Diodati 1649', shortName: 'DIODATI', language: 'it', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'riveduta', name: 'Bibbia Riveduta 1927', shortName: 'RIVEDUTA', language: 'it', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'cuv', name: '和合本 (Chinese Union Version, Traditional)', shortName: 'CUV', language: 'zh', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'cuvs', name: '和合本 (Chinese Union Version, Simplified)', shortName: 'CUVS', language: 'zh', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'synodal', name: 'Синодальный перевод', shortName: 'SYNODAL', language: 'ru', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'kor', name: '개역한글판', shortName: 'KOR', language: 'ko', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1188 },
    { slug: 'darby-fr', name: 'Bible Darby Française', shortName: 'DARBY-FR', language: 'fr', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'martin1744', name: 'Bible David Martin 1744', shortName: 'MARTIN1744', language: 'fr', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'asv', name: 'American Standard Version', shortName: 'ASV', language: 'en', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'ylt', name: 'Young\'s Literal Translation', shortName: 'YLT', language: 'en', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'dra', name: 'Douay-Rheims American Edition', shortName: 'DRA', language: 'en', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'bbe', name: 'Bible in Basic English', shortName: 'BBE', language: 'en', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'svd', name: 'الكتاب المقدس فان دايك (Smith-Van Dyck)', shortName: 'SVD', language: 'ar', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'kgy', name: '口語訳聖書 (Kōgoyaku)', shortName: 'KGY', language: 'ja', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1171 },
    { slug: 'bg', name: 'Biblia Gdańska', shortName: 'BG', language: 'pl', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'dutch1917', name: 'De Heilige Schrift 1917', shortName: 'NLD1917', language: 'nl', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'vdc', name: 'Biblia Cornilescu', shortName: 'VDC', language: 'ro', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1188 },
    { slug: 'kar', name: 'Károli Biblia', shortName: 'KAR', language: 'hu', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'bkr', name: 'Bible kralická', shortName: 'BKR', language: 'cs', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'bnb', name: 'Banal na Bibliya (ULB)', shortName: 'BNB', language: 'tl', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Banal na Bibliya (ULB) (BNB) © 2018 Door43 World Missions Community. Lisensyang Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0). Pinagmulan: eBible.org.' },
    { slug: 'vi1934', name: 'Kinh Thánh 1934', shortName: 'VI1934', language: 'vi', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'ycv', name: 'Yorumsuz Türkçe Çeviri', shortName: 'YCV', language: 'tr', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Yorumsuz Türkçe Çeviri (YCV) © 2023-2025 İsmail Serinken ve eBible.org. Creative Commons Atıf-Türetilemez 4.0 lisansı (CC BY-ND 4.0) ile sunulmuştur. World English Bible\'dan çevrilmiştir.' },
    { slug: 'indonesian', name: 'Alkitab Terjemahan Sederhana', shortName: 'TSI', language: 'id', hasOldTestament: true, hasNewTestament: true, totalBooks: 48, totalChapters: 762, copyright: 'Alkitab Terjemahan Sederhana Indonesia (TSI) © 2021 oleh Yayasan Alkitab BahasaKita (Albata) dan Pioneer Bible Translators International. Lisensi Creative Commons Atribusi-BerbagiSerupa 4.0 (CC BY-SA 4.0). Sumber: eBible.org.' },
    { slug: 'kp', name: 'Куліш-Пулюй (1905)', shortName: 'KP', language: 'uk', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'sv1917', name: 'Bibeln 1917', shortName: 'SVE1917', language: 'sv', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    // dansk1931 fora do ar: a Bibelselskabet diz que o AT de 1931 ainda tem direitos (out/2026). Religar = voltar esta linha.
    // { slug: 'dansk1931', name: 'Dansk Bibel 1931', shortName: 'DAN1931', language: 'da', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Dansk Bibel 1931 (DAN1931) Det Nye Testamente er i offentlig eje (Public Domain). Det Gamle Testamente © 1931 Det Danske Bibelselskab. Udbredt via Project Gutenberg med tilladelse fra rettighedshaveren.' },
    { slug: 'nb1930', name: 'Norsk Bibel', shortName: 'NB1930', language: 'nb', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'lsb', name: 'La Sankta Biblio (Esperanto)', shortName: 'LSB', language: 'eo', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'suv', name: 'Biblia Takatifu (NT)', shortName: 'SUV', language: 'sw', hasOldTestament: false, hasNewTestament: true, totalBooks: 26, totalChapters: 256 },
    { slug: 'geneva1599', name: 'Geneva Bible 1599', shortName: 'GNV', language: 'en', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'sblgnt', name: 'SBL Greek New Testament', shortName: 'SBLGNT', language: 'gr', hasOldTestament: false, hasNewTestament: true, totalBooks: 27, totalChapters: 260, copyright: 'SBL Greek New Testament (SBLGNT) © 2010 Society of Biblical Literature and Logos Bible Software. Licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0). Source: github.com/LogosBible/SBLGNT.' },
    { slug: 'rvg', name: 'Reina-Valera Gómez 2010', shortName: 'RVG', language: 'es', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Reina-Valera Gómez 2010 (RVG) © 2004, 2010, 2023 Dr. Humberto Gómez Caballero. Derechos reservados. Se permite reproducirla para distribución gratuita, sin fines de lucro y sin cambiar ninguna de las palabras escritas.' },
    { slug: 'crampon', name: 'Bible Crampon', shortName: 'CRAMPON', language: 'fr', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'frasbl', name: 'La Sainte Bible libre', shortName: 'FRASBL', language: 'fr', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'men', name: 'Menge Bibel 1939', shortName: 'MEN', language: 'de', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'luth1545', name: 'Lutherbibel 1545', shortName: 'LUTH1545', language: 'de', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'byz', name: 'Byzantine Greek NT', shortName: 'BYZ', language: 'gr', hasOldTestament: false, hasNewTestament: true, totalBooks: 27, totalChapters: 260 },
    { slug: 'lxx', name: 'Septuaginta', shortName: 'LXX', language: 'gr', hasOldTestament: true, hasNewTestament: false, totalBooks: 36, totalChapters: 896 },
    { slug: 'pr1933', name: 'Pyhä Raamattu 1933/1938', shortName: 'PR1933', language: 'fi', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'blpt', name: 'Bíblia Livre Para Todos', shortName: 'BLPT', language: 'pt-br', hasOldTestament: false, hasNewTestament: true, totalBooks: 27, totalChapters: 260, copyright: 'Bíblia Livre Para Todos (BLPT) © 2022 Free Bible Ministry, Inc. Licença Creative Commons Atribuição-CompartilhaIgual 4.0 (CC BY-SA 4.0). Fonte: eBible.org.' },
    { slug: 'tft', name: 'Tradução para Tradutores', shortName: 'TFT', language: 'pt-br', hasOldTestament: false, hasNewTestament: true, totalBooks: 27, totalChapters: 260, copyright: 'Tradução para Tradutores (TFT) © 2018 Ellis W. Deibler, Jr. Licença Creative Commons Atribuição-CompartilhaIgual 4.0 (CC BY-SA 4.0). Fonte: eBible.org.' },
    { slug: 'skd', name: 'Sveto pismo (Daničić-Karadžić)', shortName: 'SKD', language: 'sr', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'sev', name: 'Sagradas Escrituras 1569 (Biblia del Oso)', shortName: 'SEV', language: 'es', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Sagradas Escrituras 1569 (SEV) Traducción de Casiodoro de Reina (Basilea, 1569), dominio público. Ortografía actualizada © 1996, 2002 Russell Martin Stendal: puede usarse libremente siempre que su contenido no sea alterado.' },
    { slug: 'wlc', name: 'Westminster Leningrad Codex', shortName: 'WLC', language: 'he', hasOldTestament: true, hasNewTestament: false, totalBooks: 39, totalChapters: 776 },
    // Idiomas novos, livres no eBible (out/2026). Metadados e crédito vêm de
    // packages/data/src/versions.ts e version-copyrights.ts do monorepo.
    { slug: 'irv-hi', name: 'इंडियन रिवाइज्ड वर्जन हिंदी', shortName: 'IRV-HI', language: 'hi', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'इंडियन रिवाइज्ड वर्जन हिंदी (IRV-HI). Copyright © 2017, 2018, 2019 Bridge Connectivity Solutions. Contributor: Bridge Connectivity Solutions Pvt. Ltd. Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). Source: eBible.org.' },
    { slug: 'irv-bn', name: 'ইন্ডিয়ান রিভাইজড ভার্সন', shortName: 'IRV-BN', language: 'bn', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'ইন্ডিয়ান রিভাইজড ভার্সন (IRV-BN). Copyright © 2018, 2019 Bridge Connectivity Solutions Pvt. Ltd. Contributor: Bridge Connectivity Solutions Pvt. Ltd. Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). Source: eBible.org.' },
    { slug: 'irv-ta', name: 'இண்டியன் ரிவைஸ்டு வெர்ஸன்', shortName: 'IRV-TA', language: 'ta', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'இண்டியன் ரிவைஸ்டு வெர்ஸன் (IRV-TA). Copyright © 2017, 2019 Bridge Connectivity Solutions. Contributor: Bridge Connectivity Solutions Pvt. Ltd. Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). Source: eBible.org.' },
    { slug: 'irv-te', name: 'ఇండియన్ రివైజ్డ్ వెర్షన్', shortName: 'IRV-TE', language: 'te', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'ఇండియన్ రివైజ్డ్ వెర్షన్ (IRV-TE). Copyright © 2017, 2019 Bridge Connectivity Solutions. Contributor: Bridge Connectivity Solutions Pvt. Ltd. Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). Source: eBible.org.' },
    { slug: 'irv-ml', name: 'ഇന്ത്യൻ റിവൈസ്ഡ് വേർഷൻ', shortName: 'IRV-ML', language: 'ml', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'ഇന്ത്യൻ റിവൈസ്ഡ് വേർഷൻ (IRV-ML). Copyright © 2017, 2019 Bridge Communication Systems. Contributor: Bridge Connectivity Solutions Pvt. Ltd. Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). Source: eBible.org.' },
    { slug: 'irv-mr', name: 'इंडियन रीवाइज्ड वर्जन मराठी', shortName: 'IRV-MR', language: 'mr', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'इंडियन रीवाइज्ड वर्जन मराठी (IRV-MR). Copyright © 2017, 2019 Bridge Connectivity Solutions. Contributor: Bridge Connectivity Solutions Pvt. Ltd. Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). Source: eBible.org.' },
    { slug: 'irv-gu', name: 'ઇન્ડિયન રીવાઇઝ્ડ વર્ઝન ગુજરાતી', shortName: 'IRV-GU', language: 'gu', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'ઇન્ડિયન રીવાઇઝ્ડ વર્ઝન ગુજરાતી (IRV-GU). Copyright © 2019 Bridge Connectivity Solutions. Contributor: Bridge Connectivity Solutions Pvt. Ltd. Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). Source: eBible.org.' },
    { slug: 'irv-pa', name: 'ਇੰਡਿਅਨ ਰਿਵਾਇਜ਼ਡ ਵਰਜ਼ਨ ਪੰਜਾਬੀ', shortName: 'IRV-PA', language: 'pa', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'ਇੰਡਿਅਨ ਰਿਵਾਇਜ਼ਡ ਵਰਜ਼ਨ ਪੰਜਾਬੀ (IRV-PA). Copyright © 2017, 2019 Bridge Connectivity Solutions. Contributor: Bridge Connectivity Solutions Pvt. Ltd. Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). Source: eBible.org.' },
    { slug: 'irv-kn', name: 'ಇಂಡಿಯನ್ ರಿವೈಜ್ಡ್ ವರ್ಸನ್', shortName: 'IRV-KN', language: 'kn', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'ಇಂಡಿಯನ್ ರಿವೈಜ್ಡ್ ವರ್ಸನ್ (IRV-KN). Copyright © 2017, 2019 Bridge Connectivity Solutions. Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). Source: eBible.org.' },
    { slug: 'irv-or', name: 'ଇଣ୍ଡିୟାନ ରିୱାଇସ୍ଡ୍ ୱରସନ୍', shortName: 'IRV-OR', language: 'or', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'ଇଣ୍ଡିୟାନ ରିୱାଇସ୍ଡ୍ ୱରସନ୍ (IRV-OR). Copyright © 2017, 2019, 2021 Bridge Connectivity Solutions. Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). Source: eBible.org.' },
    { slug: 'irv-as', name: 'ইণ্ডিয়ান ৰিভাইচ ভাৰচন', shortName: 'IRV-AS', language: 'as', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'ইণ্ডিয়ান ৰিভাইচ ভাৰচন (IRV-AS). Copyright © 2017, 2018 Bridge Connectivity Solutions. Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). Source: eBible.org.' },
    { slug: 'ocv-ur', name: 'آزادانہ اردو ہم عصر ترجمہ', shortName: 'OCV-UR', language: 'ur', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Biblica® آزادانہ اردو ہم عصر ترجمہ™ (OCV-UR). حق اِشاعت © 1999، 2005، 2022، 2024 Biblica, Inc. Biblica® Open Urdu Contemporary Version™. Copyright © 1999, 2005, 2022, 2024 by Biblica, Inc. Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). “Biblica” is a trademark registered in the United States Patent and Trademark Office by Biblica, Inc. Used with permission. Original work available for free at www.biblica.com and open.bible. Source: eBible.org.' },
    { slug: 'ocv-ne', name: 'नेपाली समकालीन सर्वसुलभ संस्करण', shortName: 'OCV-NE', language: 'ne', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Biblica® नेपाली समकालीन सर्वसुलभ संस्करण™ (OCV-NE). प्रतिलिपि अधिकार © 1998, 2006, 2021, 2024 Biblica, Inc. Biblica® Open Nepali Contemporary Version™. Copyright © 1998, 2006, 2021, 2024 by Biblica, Inc. Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). “Biblica” is a trademark registered in the United States Patent and Trademark Office by Biblica, Inc. Used with permission. Original work available for free at www.biblica.com and open.bible. Source: eBible.org.' },
    { slug: 'ocv-hne', name: 'सुतंतर समकालीन छत्तीसगढ़ी अनुवाद', shortName: 'OCV-HNE', language: 'hne', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Biblica® सुतंतर समकालीन छत्तीसगढ़ी अनुवाद™ (OCV-HNE). कापीराईट © 2012, 2016, 2021, 2024 Biblica, Inc. Biblica® Open Chhattisgarhi Contemporary Version™. Copyright © 2012, 2016, 2021, 2024 by Biblica, Inc. Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). “Biblica” is a trademark registered in the United States Patent and Trademark Office by Biblica, Inc. Used with permission. Original work available for free at www.biblica.com and open.bible. Source: eBible.org.' },
    { slug: 'opv', name: 'ترجمه قدیم', shortName: 'OPV', language: 'fa', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'judson', name: 'မြန်မာကျမ်းစာ', shortName: 'JUDSON', language: 'my', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'bsa', name: 'Bib Sen An', shortName: 'BSA', language: 'ht', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Bib Sen An (BSA). Copyright © 2017-2023 Ron Smith. Translation by Ron Smith. Editor: Nixon Félix. Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). Source: eBible.org.' },
    { slug: 'ocv-ceb', name: 'Ang Pulong sa Dios', shortName: 'OCV-CEB', language: 'ceb', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Biblica® Open Ang Pulong sa Dios™ (OCV-CEB). Katungod sa pagmantala © 2009, 2010, 2014, 2024 Biblica, Inc. Biblica® Open Cebuano Contemporary Bible™. Copyright © 2009, 2010, 2014, 2024 by Biblica, Inc. “Biblica” is a trademark registered in the United States Patent and Trademark Office by Biblica, Inc. Used with permission. Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). Original work available for free at www.biblica.com and open.bible. Source: eBible.org.' },
    { slug: 'ocv-hil', name: 'Ang Pulong Sang Dios', shortName: 'OCV-HIL', language: 'hil', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Biblica® Libre Ang Pulong Sang Dios™ (OCV-HIL). Copyright © 1996, 2006, 2011, 2022 sang Biblica, Inc. Biblica® Open Hiligaynon Contemporary Bible™. Copyright © 1996, 2006, 2011, 2022 by Biblica, Inc. “Biblica” is a trademark registered in the United States Patent and Trademark Office by Biblica, Inc. Used with permission. Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). Original work available for free at www.biblica.com and open.bible. Source: eBible.org.' },
    { slug: 'ulb-ilo', name: 'Ti Biblia (ULB)', shortName: 'ULB-ILO', language: 'ilo', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Ti Biblia (Unlocked Literal Bible) (ULB-ILO). Copyright © 2019 Door43 World Missions Community. Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). Source: eBible.org.' },
    { slug: 'ocv-ha', name: 'Sabon Rai Don Kowa', shortName: 'OCV-HA', language: 'ha', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Biblica® Buɗaɗɗen Littafi Mai Tsarki, Sabon Rai Don Kowa™ (OCV-HA). Neman RubutaccenIzini © 2009, 2020 ta hannun Biblica, Inc. Biblica® Open Hausa Contemporary Bible™. Copyright © 2009, 2020 by Biblica, Inc. “Biblica” is a trademark registered in the United States Patent and Trademark Office by Biblica, Inc. Used with permission. Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). Original work available for free at www.biblica.com and open.bible. Source: eBible.org.' },
    { slug: 'ocv-ig', name: 'Baịbụlụ Nsọ nʼIgbo Ndị Ugbu a', shortName: 'OCV-IG', language: 'ig', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Biblica® Baịbụlụ Nsọ nʼIgbo Ndị Ugbu a nke dịrị onye ọbụla ịgụ (OCV-IG). Ndị Biblica, Inc. degharịrị ya nʼafọ © 1980, 1988, 2019, 2020. Biblica® Open Igbo Contemporary Bible™. Copyright © 1980, 1988, 2019, 2020 by Biblica, Inc. “Biblica” is a trademark registered in the United States Patent and Trademark Office by Biblica, Inc. Used with permission. Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). Original work available for free at www.biblica.com and open.bible. Source: eBible.org.' },
    { slug: 'ocv-yo', name: 'Bíbélì Mímọ́ ní Èdè Yorùbá Òde-Òní', shortName: 'OCV-YO', language: 'yo', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Biblica® ní oore ọ̀fẹ́ láti lo Bíbélì Mímọ́ ní Èdè Yorùbá Òde-Òní™ (OCV-YO). Ẹ̀tọ́ àdàkọ © 2009, 2017 Biblica, Inc. Biblica® Open Yoruba Contemporary Bible™. Copyright © 2009, 2017 by Biblica, Inc. “Biblica” is a trademark registered in the United States Patent and Trademark Office by Biblica, Inc. Used with permission. Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). Original work available for free at www.biblica.com and open.bible. Source: eBible.org.' },
    { slug: 'ocv-ny', name: 'Mawu a Mulungu mu Chichewa Chalero', shortName: 'OCV-NY', language: 'ny', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Biblica® Tsekulani Mawu a Mulungu mu Chichewa Chalero™ (OCV-NY). Mwini © 2002, 2016 ndi Biblica, Inc. Biblica® Open God’s Word in Contemporary Chichewa™. Copyright © 2002, 2016 by Biblica, Inc. Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). “Biblica” is a trademark registered in the United States Patent and Trademark Office by Biblica, Inc. Used with permission. Original work available for free at www.biblica.com and open.bible. Source: eBible.org.' },
    { slug: 'ocv-sn', name: 'Bhaibheri Dzvene MuChiShona Chanhasi', shortName: 'OCV-SN', language: 'sn', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Biblica® Bhaibheri Dzvene Rakasununguka MuChiShona Chanhasi™ (OCV-SN). Kopakodzero © 2005, 2018 ne Biblica, Inc. Biblica® Open Shona Contemporary Bible™. Copyright © 2005, 2018 by Biblica, Inc. Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). “Biblica” is a trademark registered in the United States Patent and Trademark Office by Biblica, Inc. Used with permission. Original work available for free at www.biblica.com and open.bible. Source: eBible.org.' },
    { slug: 'ocv-nd', name: 'IBhayibhili Elingcwele LesiNdebele', shortName: 'OCV-ND', language: 'nd', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Biblica® IBhayibhili Elingcwele LesiNdebele Elifinyelelekayo™ (OCV-ND). Imininingwane Yokukopa © 2003, 2006, 2022 yenziwe yiBiblica, Inc. Biblica® Open Ndebele Contemporary Bible™. Copyright © 2003, 2006, 2022 by Biblica, Inc. Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). “Biblica” is a trademark registered in the United States Patent and Trademark Office by Biblica, Inc. Used with permission. Original work available for free at www.biblica.com and open.bible. Source: eBible.org.' },
    { slug: 'ocv-ln', name: 'Mokanda na Bomoi', shortName: 'OCV-LN', language: 'ln', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Biblica® Salela na bonsomi Mokanda na Bomoi™ (OCV-LN). Makomi na se ya bokonzi © 2002, 2020 Biblica, Inc. Biblica® Open Lingala Contemporary Bible™. Copyright © 2002, 2020 by Biblica, Inc. Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). “Biblica” is a trademark registered in the United States Patent and Trademark Office by Biblica, Inc. Used with permission. Original work available for free at www.biblica.com and open.bible. Source: eBible.org.' },
    { slug: 'ocv-lg', name: 'Bayibuli Entukuvu', shortName: 'OCV-LG', language: 'lg', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Biblica® Bayibuli Entukuvu, Endagaano Enkadde nʼEndagaano Empya ekwatiddwa ku katambi™ (OCV-LG). Obwannannyini © 1984, 1986, 1993, 2014 bwa Biblica, Inc. Biblica® Open Luganda Contemporary Bible™. Copyright © 1984, 1986, 1993, 2014 by Biblica, Inc. Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). “Biblica” is a trademark registered in the United States Patent and Trademark Office by Biblica, Inc. Used with permission. Original work available for free at www.biblica.com and open.bible. Source: eBible.org.' },
    { slug: 'ocv-tw', name: 'Akuapem Twi Nkwa Asɛm', shortName: 'OCV-TW', language: 'tw', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Biblica® Wonhia Akuapem Twi Nkwa Asɛm™ ho kwamma nhoma (OCV-TW). Owurayɛ Tumi © 1996, 2020. Biblica, Inc. na wɔde bae. Biblica® Open Akuapem Twi Contemporary Bible™. Copyright © 1996, 2020 by Biblica, Inc. Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). “Biblica” is a trademark registered in the United States Patent and Trademark Office by Biblica, Inc. Used with permission. Original work available for free at www.biblica.com and open.bible. Source: eBible.org.' },
    { slug: 'ocv-ee', name: 'Agbenya La', shortName: 'OCV-EE', language: 'ee', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Biblica® Se aɖeke mebla Biblia zazã o Agbenya La™ (OCV-EE). Nutɔnyenye © 1988, 2006, 2020 Biblica, Inc. Biblica® Open Ewe Contemporary Scriptures™. Copyright © 1988, 2006, 2020 by Biblica, Inc. Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). “Biblica” is a trademark registered in the United States Patent and Trademark Office by Biblica, Inc. Used with permission. Original work available for free at www.biblica.com and open.bible. Source: eBible.org.' },
    { slug: 'ocv-ki', name: 'Kiugo Gĩtheru Kĩa Ngai', shortName: 'OCV-KI', language: 'ki', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Biblica® Kiugo Gĩtheru Kĩa Ngai Kĩhingũre™ (OCV-KI). Kĩmenyithia kĩa Mwene-wĩra © 2013 nĩ Biblica, Inc. Biblica® Open Kikuyu Holy Word of God™. Copyright © 2013 by Biblica, Inc. Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). “Biblica” is a trademark registered in the United States Patent and Trademark Office by Biblica, Inc. Used with permission. Original work available for free at www.biblica.com and open.bible. Source: eBible.org.' },
    { slug: 'ocv-luo', name: 'Ochiw Thuolo Motingʼo Loko Manyien', shortName: 'OCV-LUO', language: 'luo', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Biblica® Open New Luo Translation™ (OCV-LUO). Copyright © 1980, 2002, 2003, 2020 by Biblica, Inc. “Biblica” is a trademark registered in the United States Patent and Trademark Office by Biblica, Inc. Used with permission. Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). Original work available for free at www.biblica.com and open.bible. Source: eBible.org.' },
    { slug: 'ocv-om', name: 'Hiikkaa Ammayyaa Banamaa Haaraa', shortName: 'OCV-OM', language: 'om', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Biblica® Hiikkaa Ammayyaa Banamaa Haaraa™, Loqoda Dhiʼaa (OCV-OM). Mirgi seeraan eegama © 2022 Biblica, Inc. Biblica® Open New Oromo Contemporary Version™, Western. Copyright © 2022 by Biblica, Inc. “Biblica” is a trademark registered in the United States Patent and Trademark Office by Biblica, Inc. Used with permission. Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). Original work available for free at www.biblica.com and open.bible. Source: eBible.org.' },
    { slug: 'ocv-ckb', name: 'کوردیی سۆرانیی ستاندەر', shortName: 'OCV-CKB', language: 'ckb', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Biblica® وەشانی بێبەرامبەری کوردیی سۆرانیی ستاندەر (OCV-CKB). © مافی چاپکردن پارێزراوە ١٩٩٨، ٢٠١١، ٢٠١٦، ٢٠٢٠ لەلایەن ببلیکا. Biblica® Open Kurdi Sorani Standard Version™. Copyright © 1998, 2011, 2016, 2020 by Biblica, Inc. Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). Original work available for free at www.biblica.com and open.bible. Source: eBible.org.' },
    { slug: 'ocv-sw', name: 'Neno: Bibilia Takatifu', shortName: 'OCV-SW', language: 'sw', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Biblica® Toleo Wazi Neno: Bibilia Takatifu™ (OCV-SW). Hakimiliki © 1984, 1989, 2009, 2015 Biblica, Inc. Biblica® Open Kiswahili Contemporary Version™. Copyright © 1984, 1989, 2009, 2015 by Biblica, Inc. Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). Original work available for free at www.biblica.com and open.bible. Source: eBible.org.' },
    { slug: 'muqeddes', name: 'مۇقېددېس كالام', shortName: 'MUQEDDES', language: 'ug', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'مۇقېددېس كالام (MUQEDDES). Copyright © 2010 Mukeddes Kalam - Uyghur Bible Translation Committee. Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). Source: eBible.org.' },
    { slug: 'baibala', name: 'Baibala Hemolele', shortName: 'BAIBALA', language: 'haw', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'rwv', name: 'Ko e Tohi Tapu Kātoa', shortName: 'RWV', language: 'to', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    // Versões livres modernas nos idiomas do site (out/2026, midvash#2092).
    { slug: 'alm1911', name: 'Almeida 1911', shortName: 'ALM1911', language: 'pt-br', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189 },
    { slug: 'onbv-es', name: 'Open Nueva Biblia Viva', shortName: 'ONBV', language: 'es', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Biblica® Open Nueva Biblia Viva™ (ONBV). Copyright © 2006, 2008 by Biblica, Inc. “Biblica” es una marca registrada en la oficina de Patentes y Marcas de los Estados Unidos por Biblica, Inc. Usado con permiso. Licencia Creative Commons Atribución-CompartirIgual 4.0 Internacional (CC BY-SA 4.0). Original work available for free at www.biblica.com and open.bible. Source: eBible.org.' },
    { slug: 'pdt', name: 'Palabra de Dios para ti', shortName: 'PDT', language: 'es', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Palabra de Dios para ti (PDT). Copyright © 2020 Asociacion Biblica Latinoamericana. Licencia Creative Commons Atribución 4.0 Internacional (CC BY 4.0). Source: eBible.org.' },
    { slug: 'ccb', name: '圣经当代译本', shortName: 'CCB', language: 'zh', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Biblica® 圣经当代译本™开放资源 (CCB). 版权所有©1979, 2005, 2007, 2011, 2022 Biblica, Inc. Biblica® Open Chinese Contemporary Bible™ (Simplified Script). Copyright © 1979, 2005, 2007, 2011, 2022 by Biblica, Inc. “Biblica”是国际圣经协会在美国专利和商标局注册的商标。获得授权使用。. 按照知识共享协议-同样分享4.0国际许可证（CC BY-SA 4.0）提供。. 原作品属于国际圣经协会，在 www.biblica.com and open.bible 可以免费使用。. The original work by Biblica, Inc. is available for free at www.biblica.com and open.bible. Source: eBible.org.' },
    { slug: 'ccbt', name: '聖經當代譯本', shortName: 'CCBT', language: 'zh', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Biblica® 聖經，當代譯本™開放資源 (CCBT). 版權所有©1979, 2005, 2007, 2012, 2023 Biblica, Inc. Biblica® Open Chinese Contemporary Bible™ (Traditional Script). Copyright © 1979, 2005, 2007, 2012, 2023 by Biblica, Inc. “Biblica” 是國際聖經協會在美國專利和商標局注冊的商標。獲得授權使用。. 按照知識共享協議-同樣分享4.0國際許可證（CC BY-SA 4.0）提供。. 原作品屬于國際聖經協會，在 www.biblica.com and open.bible 可以免費使用。. The original work by Biblica, Inc. is available for free at www.biblica.com and open.bible. Source: eBible.org.' },
    { slug: 'lsv', name: 'Literal Standard Version', shortName: 'LSV', language: 'en', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Literal Standard Version (LSV). Copyright © 2020 Covenant Press. The Literal Standard Version of the Holy Bible is a registered copyright of Covenant Press and the Covenant Christian Coalition (© 2020). Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0). Source: eBible.org.' },
    { slug: 'ncl', name: 'Bible néo-Crampon Libre', shortName: 'NCL', language: 'fr', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Sainte Bible néo-Crampon Libre (NCL). Une modernisation de la traduction catholique française de Crampon. Copyright © 2022 Fraternité de Tibériade. Licence Creative Commons Attribution, Partage dans les mêmes conditions 4.0 International (CC BY-SA 4.0). Source: eBible.org.' }
];
