/**
 * Master Data Institusi Pendidikan Tinggi & Program Studi Indonesia
 * Mencakup PTN, PTS ternama, PTKIN/UIN, dan Politeknik terkemuka.
 */

export interface EducationInstitution {
  id: string
  name: string
  shortName?: string
  city?: string
  type: 'PTN' | 'PTS' | 'PTKIN' | 'POLITEKNIK'
}

export interface MajorProgram {
  id: string
  name: string
  facultyGroup: 'Teknologi & Komputer' | 'Bisnis & Ekonomi' | 'Desain & Seni' | 'Sosial & Humaniora' | 'Teknik & Rekayasa' | 'Sains & Kesehatan'
}

export const INDONESIAN_UNIVERSITIES: EducationInstitution[] = [
  // PTN Populer
  { id: 'ui', name: 'Universitas Indonesia', shortName: 'UI', city: 'Depok / Jakarta', type: 'PTN' },
  { id: 'itb', name: 'Institut Teknologi Bandung', shortName: 'ITB', city: 'Bandung', type: 'PTN' },
  { id: 'ugm', name: 'Universitas Gadjah Mada', shortName: 'UGM', city: 'Yogyakarta', type: 'PTN' },
  { id: 'ipb', name: 'IPB University (Institut Pertanian Bogor)', shortName: 'IPB', city: 'Bogor', type: 'PTN' },
  { id: 'its', name: 'Institut Teknologi Sepuluh Nopember', shortName: 'ITS', city: 'Surabaya', type: 'PTN' },
  { id: 'unair', name: 'Universitas Airlangga', shortName: 'UNAIR', city: 'Surabaya', type: 'PTN' },
  { id: 'unpad', name: 'Universitas Padjadjaran', shortName: 'UNPAD', city: 'Bandung / Sumedang', type: 'PTN' },
  { id: 'undip', name: 'Universitas Diponegoro', shortName: 'UNDIP', city: 'Semarang', type: 'PTN' },
  { id: 'ub', name: 'Universitas Brawijaya', shortName: 'UB', city: 'Malang', type: 'PTN' },
  { id: 'uns', name: 'Universitas Sebelas Maret', shortName: 'UNS', city: 'Surakarta', type: 'PTN' },
  { id: 'unhas', name: 'Universitas Hasanuddin', shortName: 'UNHAS', city: 'Makassar', type: 'PTN' },
  { id: 'usu', name: 'Universitas Sumatera Utara', shortName: 'USU', city: 'Medan', type: 'PTN' },
  { id: 'unand', name: 'Universitas Andalas', shortName: 'UNAND', city: 'Padang', type: 'PTN' },
  { id: 'uny', name: 'Universitas Negeri Yogyakarta', shortName: 'UNY', city: 'Yogyakarta', type: 'PTN' },
  { id: 'unj', name: 'Universitas Negeri Jakarta', shortName: 'UNJ', city: 'Jakarta', type: 'PTN' },
  { id: 'upi', name: 'Universitas Pendidikan Indonesia', shortName: 'UPI', city: 'Bandung', type: 'PTN' },
  { id: 'unnes', name: 'Universitas Negeri Semarang', shortName: 'UNNES', city: 'Semarang', type: 'PTN' },
  { id: 'um', name: 'Universitas Negeri Malang', shortName: 'UM', city: 'Malang', type: 'PTN' },
  { id: 'unej', name: 'Universitas Jember', shortName: 'UNEJ', city: 'Jember', type: 'PTN' },
  { id: 'unud', name: 'Universitas Udayana', shortName: 'UNUD', city: 'Denpasar / Badung', type: 'PTN' },
  { id: 'usk', name: 'Universitas Syiah Kuala', shortName: 'USK', city: 'Banda Aceh', type: 'PTN' },
  { id: 'unri', name: 'Universitas Riau', shortName: 'UNRI', city: 'Pekanbaru', type: 'PTN' },
  { id: 'unila', name: 'Universitas Lampung', shortName: 'UNILA', city: 'Bandar Lampung', type: 'PTN' },
  { id: 'unsri', name: 'Universitas Sriwijaya', shortName: 'UNSRI', city: 'Palembang / Indralaya', type: 'PTN' },
  { id: 'unsoed', name: 'Universitas Jenderal Soedirman', shortName: 'UNSOED', city: 'Purwokerto', type: 'PTN' },
  { id: 'upn-jkt', name: 'UPN Veteran Jakarta', shortName: 'UPNVJ', city: 'Jakarta', type: 'PTN' },
  { id: 'upn-yk', name: 'UPN Veteran Yogyakarta', shortName: 'UPNVY', city: 'Yogyakarta', type: 'PTN' },
  { id: 'upn-jatim', name: 'UPN Veteran Jawa Timur', shortName: 'UPNVJT', city: 'Surabaya', type: 'PTN' },
  { id: 'untirta', name: 'Universitas Sultan Ageng Tirtayasa', shortName: 'UNTIRTA', city: 'Serang', type: 'PTN' },
  { id: 'unsika', name: 'Universitas Singaperbangsa Karawang', shortName: 'UNSIKA', city: 'Karawang', type: 'PTN' },

  // UIN / PTKIN (UINIC Host Context)
  { id: 'uin-jkt', name: 'UIN Syarif Hidayatullah Jakarta', shortName: 'UIN Jakarta', city: 'Tangerang Selatan', type: 'PTKIN' },
  { id: 'uin-yk', name: 'UIN Sunan Kalijaga Yogyakarta', shortName: 'UIN Jogja', city: 'Yogyakarta', type: 'PTKIN' },
  { id: 'uin-bdg', name: 'UIN Sunan Gunung Djati Bandung', shortName: 'UIN Bandung', city: 'Bandung', type: 'PTKIN' },
  { id: 'uin-malang', name: 'UIN Maulana Malik Ibrahim Malang', shortName: 'UIN Malang', city: 'Malang', type: 'PTKIN' },
  { id: 'uin-semarang', name: 'UIN Walisongo Semarang', shortName: 'UIN Semarang', city: 'Semarang', type: 'PTKIN' },
  { id: 'uin-surabaya', name: 'UIN Sunan Ampel Surabaya', shortName: 'UINSA', city: 'Surabaya', type: 'PTKIN' },
  { id: 'uin-aceh', name: 'UIN Ar-Raniry Banda Aceh', shortName: 'UIN Ar-Raniry', city: 'Banda Aceh', type: 'PTKIN' },
  { id: 'uin-makassar', name: 'UIN Alauddin Makassar', shortName: 'UIN Makassar', city: 'Makassar', type: 'PTKIN' },
  { id: 'uin-riau', name: 'UIN Sultan Syarif Kasim Riau', shortName: 'UIN Suska', city: 'Pekanbaru', type: 'PTKIN' },
  { id: 'uin-lampung', name: 'UIN Raden Intan Lampung', shortName: 'UIN RIL', city: 'Bandar Lampung', type: 'PTKIN' },
  { id: 'uin-palembang', name: 'UIN Raden Fatah Palembang', shortName: 'UIN Palembang', city: 'Palembang', type: 'PTKIN' },
  { id: 'uin-padang', name: 'UIN Imam Bonjol Padang', shortName: 'UIN Padang', city: 'Padang', type: 'PTKIN' },

  // PTS Ternama & Populer
  { id: 'binus', name: 'Bina Nusantara University (BINUS)', shortName: 'BINUS', city: 'Jakarta / Tangerang / Bandung / Malang', type: 'PTS' },
  { id: 'telkom', name: 'Telkom University', shortName: 'Tel-U', city: 'Bandung / Jakarta / Surabaya', type: 'PTS' },
  { id: 'trisakti', name: 'Universitas Trisakti', shortName: 'USAKTI', city: 'Jakarta', type: 'PTS' },
  { id: 'untar', name: 'Universitas Tarumanagara', shortName: 'UNTAR', city: 'Jakarta', type: 'PTS' },
  { id: 'atmajaya-jkt', name: 'Universitas Katolik Indonesia Atma Jaya', shortName: 'Atma Jaya Jakarta', city: 'Jakarta', type: 'PTS' },
  { id: 'uph', name: 'Universitas Pelita Harapan', shortName: 'UPH', city: 'Tangerang', type: 'PTS' },
  { id: 'umn', name: 'Universitas Multimedia Nusantara', shortName: 'UMN', city: 'Tangerang', type: 'PTS' },
  { id: 'prasmul', name: 'Universitas Prasetiya Mulya', shortName: 'Prasmul', city: 'Tangerang / Jakarta', type: 'PTS' },
  { id: 'gunadarma', name: 'Universitas Gunadarma', shortName: 'UG', city: 'Depok / Jakarta', type: 'PTS' },
  { id: 'mercubuana', name: 'Universitas Mercu Buana', shortName: 'UMB', city: 'Jakarta', type: 'PTS' },
  { id: 'uii', name: 'Universitas Islam Indonesia', shortName: 'UII', city: 'Yogyakarta', type: 'PTS' },
  { id: 'umy', name: 'Universitas Muhammadiyah Yogyakarta', shortName: 'UMY', city: 'Yogyakarta', type: 'PTS' },
  { id: 'ums', name: 'Universitas Muhammadiyah Surakarta', shortName: 'UMS', city: 'Surakarta', type: 'PTS' },
  { id: 'umm', name: 'Universitas Muhammadiyah Malang', shortName: 'UMM', city: 'Malang', type: 'PTS' },
  { id: 'petra', name: 'Universitas Kristen Petra', shortName: 'UK Petra', city: 'Surabaya', type: 'PTS' },
  { id: 'ubaya', name: 'Universitas Surabaya', shortName: 'UBAYA', city: 'Surabaya', type: 'PTS' },
  { id: 'sanatadharma', name: 'Universitas Sanata Dharma', shortName: 'USD', city: 'Yogyakarta', type: 'PTS' },
  { id: 'parahyangan', name: 'Universitas Katolik Parahyangan', shortName: 'UNPAR', city: 'Bandung', type: 'PTS' },
  { id: 'maranatha', name: 'Universitas Kristen Maranatha', shortName: 'UK Maranatha', city: 'Bandung', type: 'PTS' },
  { id: 'dian-nuswantoro', name: 'Universitas Dian Nuswantoro', shortName: 'UDINUS', city: 'Semarang', type: 'PTS' },
  { id: 'amikom', name: 'Universitas AMIKOM Yogyakarta', shortName: 'AMIKOM', city: 'Yogyakarta', type: 'PTS' },
  { id: 'esa-unggul', name: 'Universitas Esa Unggul', shortName: 'UEU', city: 'Jakarta', type: 'PTS' },
  { id: 'president', name: 'President University', shortName: 'PresUniv', city: 'Cikarang / Bekasi', type: 'PTS' },
  { id: 'bakrie', name: 'Universitas Bakrie', shortName: 'UBakrie', city: 'Jakarta', type: 'PTS' },
  { id: 'pancasila', name: 'Universitas Pancasila', shortName: 'UP', city: 'Jakarta', type: 'PTS' },
  { id: 'budiluhur', name: 'Universitas Budi Luhur', shortName: 'UBL', city: 'Jakarta', type: 'PTS' },

  // Politeknik Terkemuka
  { id: 'polban', name: 'Politeknik Negeri Bandung', shortName: 'POLBAN', city: 'Bandung', type: 'POLITEKNIK' },
  { id: 'pnj', name: 'Politeknik Negeri Jakarta', shortName: 'PNJ', city: 'Depok / Jakarta', type: 'POLITEKNIK' },
  { id: 'pens', name: 'Politeknik Elektronika Negeri Surabaya', shortName: 'PENS', city: 'Surabaya', type: 'POLITEKNIK' },
  { id: 'polinema', name: 'Politeknik Negeri Malang', shortName: 'POLINEMA', city: 'Malang', type: 'POLITEKNIK' },
  { id: 'polines', name: 'Politeknik Negeri Semarang', shortName: 'POLINES', city: 'Semarang', type: 'POLITEKNIK' },
  { id: 'polman-bdg', name: 'Politeknik Manufaktur Negeri Bandung', shortName: 'POLMAN', city: 'Bandung', type: 'POLITEKNIK' },
  { id: 'polmed', name: 'Politeknik Negeri Medan', shortName: 'POLMED', city: 'Medan', type: 'POLITEKNIK' },
  { id: 'polibatam', name: 'Politeknik Negeri Batam', shortName: 'POLIBATAM', city: 'Batam', type: 'POLITEKNIK' }
]

export const INDONESIAN_MAJORS: MajorProgram[] = [
  // Teknologi & Komputer
  { id: 'ti', name: 'Teknik Informatika / Ilmu Komputer', facultyGroup: 'Teknologi & Komputer' },
  { id: 'si', name: 'Sistem Informasi', facultyGroup: 'Teknologi & Komputer' },
  { id: 'tek-info', name: 'Teknologi Informasi', facultyGroup: 'Teknologi & Komputer' },
  { id: 'rpl', name: 'Rekayasa Perangkat Lunak (Software Engineering)', facultyGroup: 'Teknologi & Komputer' },
  { id: 'data-science', name: 'Sains Data / Data Science', facultyGroup: 'Teknologi & Komputer' },
  { id: 'siskom', name: 'Teknik Komputer / Sistem Komputer', facultyGroup: 'Teknologi & Komputer' },
  { id: 'cyber-sec', name: 'Keamanan Siber (Cyber Security)', facultyGroup: 'Teknologi & Komputer' },
  { id: 'game-dev', name: 'Teknologi Permainan (Game Tech & Dev)', facultyGroup: 'Teknologi & Komputer' },

  // Bisnis & Ekonomi
  { id: 'mn', name: 'Manajemen / Bisnis', facultyGroup: 'Bisnis & Ekonomi' },
  { id: 'bisnis-digital', name: 'Bisnis Digital', facultyGroup: 'Bisnis & Ekonomi' },
  { id: 'ak', name: 'Akuntansi / Keuangan', facultyGroup: 'Bisnis & Ekonomi' },
  { id: 'ilmu-ekonomi', name: 'Ilmu Ekonomi / Ekonomi Pembangunan', facultyGroup: 'Bisnis & Ekonomi' },
  { id: 'kewirausahaan', name: 'Kewirausahaan / Entrepreneurship', facultyGroup: 'Bisnis & Ekonomi' },
  { id: 'ekonomi-syariah', name: 'Ekonomi & Keuangan Syariah', facultyGroup: 'Bisnis & Ekonomi' },
  { id: 'adm-bisnis', name: 'Ilmu Administrasi Bisnis / Niaga', facultyGroup: 'Bisnis & Ekonomi' },
  { id: 'logistik', name: 'Manajemen Logistik & Rantai Pasok', facultyGroup: 'Bisnis & Ekonomi' },

  // Desain & Seni Kreatif
  { id: 'dkv', name: 'Desain Komunikasi Visual (DKV)', facultyGroup: 'Desain & Seni' },
  { id: 'desain-produk', name: 'Desain Produk / Product Design', facultyGroup: 'Desain & Seni' },
  { id: 'animasi', name: 'Animasi & Multimedia', facultyGroup: 'Desain & Seni' },
  { id: 'desain-interior', name: 'Desain Interior', facultyGroup: 'Desain & Seni' },
  { id: 'film-tv', name: 'Film & Televisi / Perfilman', facultyGroup: 'Desain & Seni' },

  // Sosial, Komunikasi & Humaniora
  { id: 'ilkom', name: 'Ilmu Komunikasi', facultyGroup: 'Sosial & Humaniora' },
  { id: 'pr', name: 'Hubungan Masyarakat / Public Relations', facultyGroup: 'Sosial & Humaniora' },
  { id: 'jurnalistik', name: 'Jurnalistik / Media & Broadcasting', facultyGroup: 'Sosial & Humaniora' },
  { id: 'hi', name: 'Hubungan Internasional (HI)', facultyGroup: 'Sosial & Humaniora' },
  { id: 'psikologi', name: 'Psikologi', facultyGroup: 'Sosial & Humaniora' },
  { id: 'hukum', name: 'Ilmu Hukum', facultyGroup: 'Sosial & Humaniora' },
  { id: 'adm-publik', name: 'Administrasi Publik / Negara', facultyGroup: 'Sosial & Humaniora' },
  { id: 'sosiologi', name: 'Sosiologi', facultyGroup: 'Sosial & Humaniora' },
  { id: 'sastra-inggris', name: 'Sastra Inggris / Bahasa & Komunikasi', facultyGroup: 'Sosial & Humaniora' },

  // Teknik & Rekayasa
  { id: 'te', name: 'Teknik Elektro', facultyGroup: 'Teknik & Rekayasa' },
  { id: 'ti-ind', name: 'Teknik Industri', facultyGroup: 'Teknik & Rekayasa' },
  { id: 'ts', name: 'Teknik Sipil', facultyGroup: 'Teknik & Rekayasa' },
  { id: 'tm', name: 'Teknik Mesin', facultyGroup: 'Teknik & Rekayasa' },
  { id: 'arsitektur', name: 'Arsitektur', facultyGroup: 'Teknik & Rekayasa' },
  { id: 'pwk', name: 'Perencanaan Wilayah & Kota (PWK)', facultyGroup: 'Teknik & Rekayasa' },
  { id: 'teknik-lingkungan', name: 'Teknik Lingkungan', facultyGroup: 'Teknik & Rekayasa' },
  { id: 'teknik-biomedis', name: 'Teknik Biomedis', facultyGroup: 'Teknik & Rekayasa' },

  // Sains, Matematika & Kesehatan
  { id: 'statistika', name: 'Statistika / Sains Aktuaria', facultyGroup: 'Sains & Kesehatan' },
  { id: 'matematika', name: 'Matematika', facultyGroup: 'Sains & Kesehatan' },
  { id: 'farmasi', name: 'Farmasi', facultyGroup: 'Sains & Kesehatan' },
  { id: 'kesehatan-masyarakat', name: 'Kesehatan Masyarakat / Gizi', facultyGroup: 'Sains & Kesehatan' },
  { id: 'bioteknologi', name: 'Bioteknologi / Biologi', facultyGroup: 'Sains & Kesehatan' }
]
