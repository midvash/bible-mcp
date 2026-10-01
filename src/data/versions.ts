export interface VersionDefinition {
    slug: string;
    name: string; // Full Name (e.g. "Almeida Revista e Atualizada")
    shortName: string; // Abbreviation (e.g. "ARA")
    language:
        | 'ar'
        | 'cs'
        | 'da'
        | 'de'
        | 'en'
        | 'eo'
        | 'es'
        | 'fi'
        | 'fr'
        | 'gr'
        | 'he'
        | 'hu'
        | 'id'
        | 'it'
        | 'ja'
        | 'ko'
        | 'la'
        | 'nb'
        | 'nl'
        | 'pl'
        | 'pt-br'
        | 'pt-pt'
        | 'ro'
        | 'ru'
        | 'sr'
        | 'sv'
        | 'sw'
        | 'tl'
        | 'tr'
        | 'uk'
        | 'vi'
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
    { slug: 'dansk1931', name: 'Dansk Bibel 1931', shortName: 'DAN1931', language: 'da', hasOldTestament: true, hasNewTestament: true, totalBooks: 66, totalChapters: 1189, copyright: 'Dansk Bibel 1931 (DAN1931) Det Nye Testamente er i offentlig eje (Public Domain). Det Gamle Testamente © 1931 Det Danske Bibelselskab. Udbredt via Project Gutenberg med tilladelse fra rettighedshaveren.' },
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
    { slug: 'wlc', name: 'Westminster Leningrad Codex', shortName: 'WLC', language: 'he', hasOldTestament: true, hasNewTestament: false, totalBooks: 39, totalChapters: 776 }
];
