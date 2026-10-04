Aplikasi dashboard **Growvia** dibangun dengan **Next.js 16 (App Router)** dan **MUI v7**, di atas template Vuexy.
Dokumen ini menjelaskan cara menjalankan proyek, struktur folder, serta **cara memanggil (menggunakan) setiap komponen** yang tersedia di proyek ini.

> Hanya komponen yang benar-benar dipakai yang disisakan di repo ini. Daftar file yang dihapus ada di bagian [Catatan Pembersihan](#10-catatan-pembersihan).

## Daftar Isi

1. [Tech Stack](#1-tech-stack)
2. [Menjalankan Proyek](#2-menjalankan-proyek)
3. [Environment](#3-environment)
4. [Struktur Folder](#4-struktur-folder)
5. [Alias Path](#5-alias-path)
6. [Routing & Layout](#6-routing--layout)
7. [Pemanggilan Komponen](#7-pemanggilan-komponen)
8. [Menambah Halaman Baru](#8-menambah-halaman-baru)
9. [Tema & Pengaturan](#9-tema--pengaturan)
10. [Catatan Pembersihan](#10-catatan-pembersihan)

---

## 1. Tech Stack

| Teknologi | Versi | Keterangan |
| --- | --- | --- |
| Next.js | 16.1.1 | App Router + Turbopack |
| React | 19.2.3 | Server & Client Components |
| MUI (Material UI) | 7.3.6 | `@mui/material`, `@mui/lab`, CSS Variables |
| Emotion | 11.14 | Styling engine MUI + `@emotion/styled` |
| TypeScript | 5.9 | Strict mode |
| Tailwind CSS | 4.1 | Utility class (layout/spacing) |
| CSS Modules | - | Styling lokal komponen (`*.module.css`) |
| Iconify | - | Ikon Tabler (`tabler-*`) |
| Lainnya | - | `classnames`, `react-use`, `react-perfect-scrollbar`, `react-colorful` |

---

## 2. Menjalankan Proyek

```bash
# 1. Install dependency
npm install

# 2. Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Halaman `/` otomatis di-redirect ke `/home`.

### Scripts

| Script | Perintah | Fungsi |
| --- | --- | --- |
| `dev` | `next dev --turbopack` | Menjalankan server development |
| `build` | `next build` | Build produksi |
| `start` | `next start` | Menjalankan hasil build |
| `lint` | `eslint . --ext .js,.jsx,.ts,.tsx` | Cek kualitas kode |
| `lint:fix` | `eslint ... --fix` | Perbaiki otomatis |
| `format` | `prettier --write "src/**/*.{js,jsx,ts,tsx}"` | Format kode |
| `build:icons` | `tsx src/assets/iconify-icons/bundle-icons-css.ts` | Generate CSS ikon Iconify |

> `npm install` menjalankan `postinstall` yang otomatis mem-build CSS ikon. Jika ikon baru tidak muncul, jalankan `npm run build:icons`.

---

## 3. Environment

Salin `.env.example` menjadi `.env.local` lalu sesuaikan bila perlu:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
BASEPATH=            # opsional, untuk deploy di sub-path
```

`BASEPATH` dibaca oleh `next.config.ts` sebagai `basePath`.

---

## 4. Struktur Folder

```
src/
├── app/                         # Next.js App Router (routing)
│   ├── layout.tsx               # Root layout (html/body, theme script)
│   ├── globals.css              # CSS global
│   ├── (dashboard)/             # Grup route dengan layout dashboard
│   │   ├── layout.tsx           # Providers + LayoutWrapper + Navbar/Sidebar/Footer
│   │   ├── home/page.tsx        # Halaman /home
│   │   └── about/page.tsx       # Halaman /about
│   ├── (blank-layout-pages)/    # Grup route tanpa navbar/sidebar
│   │   ├── layout.tsx           # Providers + BlankLayout
│   │   └── login/page.tsx       # Halaman /login
│   └── [...not-found]/page.tsx  # Halaman 404
│
├── views/                       # Konten halaman (Login.tsx, NotFound.tsx)
├── components/                  # Komponen aplikasi
│   ├── Link.tsx                 # Pembungkus next/link
│   ├── Providers.tsx            # Provider global (theme, settings, nav)
│   ├── GenerateMenu.tsx         # Generator menu dari data array
│   ├── theme/                   # ThemeProvider + ModeChanger + deklarasi tipe theme
│   └── layout/                  # Komponen layout vertikal/horizontal/shared
│
├── @core/                       # Inti template (jangan diubah sembarangan)
│   ├── components/
│   │   ├── mui/                 # Pembungkus komponen MUI (TextField, Chip)
│   │   ├── custom-inputs/       # Custom input radio/checkbox (Horizontal/Vertical/Image)
│   │   └── scroll-to-top/       # Tombol scroll ke atas
│   ├── contexts/settingsContext.tsx
│   ├── hooks/                   # useSettings, useImageVariant, useObjectCookie, useLayoutInit
│   ├── styles/                  # Style menu horizontal & vertikal
│   ├── svg/Logo.tsx             # Logo SVG
│   ├── theme/                   # Theme MUI (colorSchemes, overrides, typography, dll)
│   ├── utils/serverHelpers.ts   # Helper server-side (cookie, mode)
│   └── types.ts                 # Tipe dasar (Mode, Skin, Layout, ThemeColor, ...)
│
├── @layouts/                    # Kerangka layout (VerticalLayout, HorizontalLayout, BlankLayout, LayoutWrapper)
├── @menu/                       # Sistem menu (vertical-menu & horizontal-menu + hooks)
├── configs/                     # themeConfig.ts, primaryColorConfig.ts
├── types/menuTypes.ts           # Tipe data menu
└── assets/iconify-icons/        # Build script + CSS ikon yang di-generate
```

---

## 5. Alias Path

Dikonfigurasi di `tsconfig.json`:

| Alias | Mengarah ke |
| --- | --- |
| `@/*` | `src/*` |
| `@core/*` | `src/@core/*` |
| `@layouts/*` | `src/@layouts/*` |
| `@menu/*` | `src/@menu/*` |
| `@assets/*` | `src/assets/*` |
| `@components/*` | `src/components/*` |
| `@configs/*` | `src/configs/*` |
| `@views/*` | `src/views/*` |

Contoh: `import Link from '@components/Link'`.

---

## 6. Routing & Layout

Proyek menggunakan **App Router** dengan *route groups*:

| Route | Layout yang dipakai | Keterangan |
| --- | --- | --- |
| `/home` | `(dashboard)/layout.tsx` | Memakai sidebar/navbar + footer |
| `/about` | `(dashboard)/layout.tsx` | Memakai sidebar/navbar + footer |
| `/login` | `(blank-layout-pages)/layout.tsx` | Tanpa navbar/sidebar |
| `*` (404) | `[...not-found]/page.tsx` | Halaman tidak ditemukan |

Alur provider global (lihat `src/app/(dashboard)/layout.tsx`):

```
Providers  →  LayoutWrapper  →  (VerticalLayout | HorizontalLayout)  →  halaman
```

- **`Providers`** menyuntikkan `VerticalNavProvider`, `SettingsProvider`, dan `ThemeProvider`.
- **`LayoutWrapper`** memilih layout **vertical** atau **horizontal** berdasarkan `settings.layout`.
- `settings.layout` dapat diubah kapan saja lewat hook `useSettings` (mis. dari tombol di UI).

---

## 7. Pemanggilan Komponen

Semua contoh di bawah siap pakai. Perhatikan apakah komponen bersifat *client* (`'use client'`) atau *server*.

### 7.1 Komponen Dasar

#### `Link` — pembungkus `next/link`

```tsx
import Link from '@components/Link'

// Link biasa
<Link href='/about'>Tentang</Link>

// Dipakai sebagai komponen alternatif MUI (mis. pada Typography)
import Typography from '@mui/material/Typography'
<Typography component={Link} href='/login' color='primary.main'>
  Login
</Typography>
```

`Link` aman dipakai tanpa `href` (otomatis mencegah navigasi default).

#### `Providers` — provider global

Dipakai sekali di level layout. **Ini adalah Server Component (async).**

```tsx
import Providers from '@components/Providers'

export default async function Layout({ children }) {
  return <Providers direction='ltr'>{children}</Providers>
}
```

#### `ThemeProvider` — `@components/theme`

Biasanya tidak dipanggil manual karena sudah ada di dalam `Providers`. Tetap tersedia bila perlu:

```tsx
import ThemeProvider from '@components/theme'
import type { SystemMode } from '@core/types'

<ThemeProvider direction='ltr' systemMode={'light' as SystemMode}>
  {children}
</ThemeProvider>
```

#### `ScrollToTop` — tombol kembali ke atas

```tsx
import ScrollToTop from '@core/components/scroll-to-top'
import Button from '@mui/material/Button'

<ScrollToTop className='mui-fixed'>
  <Button variant='contained' className='is-10 bs-10 rounded-full p-0 min-is-0'>
    <i className='tabler-arrow-up' />
  </Button>
</ScrollToTop>
```

---

### 7.2 Komponen Input & Form

#### `CustomTextField` — `@core/components/mui/TextField`

Pembungkus MUI `TextField` dengan gaya template (variant `filled` + label di atas). Default `size='small'`.

```tsx
import CustomTextField from '@core/components/mui/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'

// Sederhana
<CustomTextField fullWidth label='Email' placeholder='Masukkan email' />

// Dengan ikon di akhir input (mis. toggle password)
<CustomTextField
  fullWidth
  label='Password'
  type='password'
  slotProps={{
    input: {
      endAdornment: (
        <InputAdornment position='end'>
          <IconButton edge='end'>
            <i className='tabler-eye' />
          </IconButton>
        </InputAdornment>
      )
    }
  }}
/>

// Sebagai Select
<CustomTextField select fullWidth label='Kategori' defaultValue=''>
  <MenuItem value='a'>A</MenuItem>
  <MenuItem value='b'>B</MenuItem>
</CustomTextField>
```

#### `CustomChip` — `@core/components/mui/Chip`

MUI `Chip` dengan tambahan prop `round` (`'true' | 'false'`).

```tsx
import CustomChip from '@core/components/mui/Chip'

<CustomChip label='Baru' size='small' round='true' color='primary' variant='tonal' />
<CustomChip label='Selesai' size='small' color='success' />
```

#### Custom Input (Radio/Checkbox) — `@core/components/custom-inputs`

Kartu pilihan berbentuk **horizontal**, **vertical**, atau **gambar**. Ketiganya mendukung `type='radio'` atau `type='checkbox'`.

```tsx
import CustomInputHorizontal from '@core/components/custom-inputs/Horizontal'
import CustomInputVertical from '@core/components/custom-inputs/Vertical'
import CustomCheckboxImg from '@core/components/custom-inputs/Image'

// Contoh state (di dalam komponen client)
const [selected, setSelected] = useState('')
const handleChange = (value: string) => setSelected(value)

<CustomInputHorizontal
  type='radio'
  name='paket'
  selected={selected}
  handleChange={handleChange}
  gridProps={{ size: { xs: 12, sm: 6 } }}
  data={{ title: 'Paket A', meta: 'Rp100.000', value: 'a', content: 'Deskripsi paket A' }}
/>

<CustomInputVertical
  type='radio'
  name='tema'
  selected={selected}
  handleChange={handleChange}
  gridProps={{ size: 6 }}
  data={{ title: 'Terang', value: 'light', asset: <i className='tabler-sun text-2xl' /> }}
/>

<CustomCheckboxImg
  type='checkbox'
  name='gambar'
  selected={['1']}
  handleChange={handleChange}
  gridProps={{ size: 4 }}
  data={{ alt: 'contoh', img: '/images/avatars/1.png', value: '1' }}
/>
```

> **Catatan tipe:** untuk `type='checkbox'` gunakan `selected: string[]`; untuk `type='radio'` gunakan `selected: string`. Definisi tipe ada di `@core/components/custom-inputs/types`.

---

### 7.3 Menu & Navigasi (`@menu`)

#### Menu Vertikal (default `@menu/vertical-menu`)

```tsx
import VerticalNav, { Menu, MenuItem, SubMenu, MenuSection, NavHeader, NavCollapseIcons } from '@menu/vertical-menu'

<VerticalNav collapsedWidth={71} backgroundColor='var(--mui-palette-background-paper)'>
  <NavHeader>
    {/* logo / tombol collapse */}
  </NavHeader>
  <Menu>
    <MenuItem href='/home' icon={<i className='tabler-smart-home' />}>Home</MenuItem>

    <SubMenu label='Akun' icon={<i className='tabler-user' />}>
      <MenuItem href='/profile'>Profil</MenuItem>
      <MenuItem href='/settings'>Pengaturan</MenuItem>
    </SubMenu>
  </Menu>
</VerticalNav>
```

#### Menu Horizontal (default `@menu/horizontal-menu`)

```tsx
import HorizontalNav, { Menu, MenuItem, SubMenu } from '@menu/horizontal-menu'

<HorizontalNav switchToVertical verticalNavContent={VerticalNavContent}>
  <Menu>
    <MenuItem href='/home'>Home</MenuItem>
    <MenuItem href='/about'>About</MenuItem>
  </Menu>
</HorizontalNav>
```

> `VerticalNavContent` adalah komponen `@components/layout/horizontal/VerticalNavContent` (dipakai untuk mengubah menu horizontal menjadi vertikal di layar kecil).

#### `GenerateMenu` — membuat menu dari data array

Jika menu didefinisikan sebagai data (bukan JSX manual), gunakan generator dari `@components/GenerateMenu`:

```tsx
import { GenerateVerticalMenu, GenerateHorizontalMenu } from '@components/GenerateMenu'
import type { VerticalMenuDataType } from '@/types/menuTypes'
import { Menu } from '@menu/vertical-menu'

const menuData: VerticalMenuDataType[] = [
  { label: 'Home', href: '/home', icon: 'tabler-smart-home' },
  { label: 'About', href: '/about', icon: 'tabler-info-circle' },
  {
    label: 'Transaksi',
    icon: 'tabler-credit-card',
    children: [{ label: 'Baru', href: '/transaksi/baru' }]
  }
]

<Menu>
  <GenerateVerticalMenu menuData={menuData} />
</Menu>
```

Tipe data menu (`VerticalMenuDataType`, `HorizontalMenuDataType`, dll.) ada di `@/types/menuTypes`.
`prefix` / `suffix` dapat berupa `ReactNode` atau objek `ChipProps` (otomatis dirender sebagai `CustomChip`).

#### Hook navigasi

```tsx
import useVerticalNav from '@menu/hooks/useVerticalNav'
import useHorizontalNav from '@menu/hooks/useHorizontalNav'

const { isCollapsed, isHovered, toggleVerticalNav, collapseVerticalNav, isBreakpointReached } = useVerticalNav()
const { isBreakpointReached: horizontalBreakpoint } = useHorizontalNav()
```

| Hook | Nilai penting |
| --- | --- |
| `useVerticalNav()` | `isCollapsed`, `isHovered`, `isBreakpointReached`, `transitionDuration`, `toggleVerticalNav()`, `collapseVerticalNav(bool)` |
| `useHorizontalNav()` | `isBreakpointReached` |

---

### 7.4 Komponen Layout

#### Kerangka layout (`@layouts`)

```tsx
import LayoutWrapper from '@layouts/LayoutWrapper'
import VerticalLayout from '@layouts/VerticalLayout'
import HorizontalLayout from '@layouts/HorizontalLayout'
import BlankLayout from '@layouts/BlankLayout'

<LayoutWrapper
  systemMode='light'
  verticalLayout={
    <VerticalLayout navigation={<Navigation />} navbar={<Navbar />} footer={<Footer />}>
      {children}
    </VerticalLayout>
  }
  horizontalLayout={
    <HorizontalLayout header={<Header />} footer={<Footer />}>
      {children}
    </HorizontalLayout>
  }
/>
```

| Komponen | Props | Keterangan |
| --- | --- | --- |
| `LayoutWrapper` | `systemMode`, `verticalLayout`, `horizontalLayout` | Memilih layout sesuai `settings.layout` |
| `VerticalLayout` | `navigation`, `navbar`, `footer` | Layout sidebar vertikal |
| `HorizontalLayout` | `header`, `footer` | Layout header horizontal |
| `BlankLayout` | `systemMode` | Layout polos tanpa chrome |

#### Komponen layout siap pakai (`@components/layout/...`)

```tsx
// Vertikal
import Navigation from '@components/layout/vertical/Navigation'
import Navbar from '@components/layout/vertical/Navbar'
import NavbarContent from '@components/layout/vertical/NavbarContent'
import NavToggle from '@components/layout/vertical/NavToggle'
import VerticalMenu from '@components/layout/vertical/VerticalMenu'
import VerticalFooter from '@components/layout/vertical/Footer'

// Horizontal
import Header from '@components/layout/horizontal/Header'
import HorizontalMenu from '@components/layout/horizontal/HorizontalMenu'
import HorizontalFooter from '@components/layout/horizontal/Footer'

// Shared
import Logo from '@components/layout/shared/Logo'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'
```

- `Navigation` (vertikal) butuh prop `mode`: `<Navigation mode='light' />`.
- `NavbarContent`, `NavToggle`, `ModeDropdown`, `UserDropdown`, `Logo`, `Footer` dapat dipanggil tanpa prop: `<UserDropdown />`.
- `ModeDropdown` menampilkan pilihan tema **Light / Dark / System** (mengubah `settings.mode`).
- `Logo` menampilkan ikon `@core/svg/Logo` + nama dari `themeConfig.templateName`.

---

### 7.5 Hooks (`@core/hooks`)

#### `useSettings`

```tsx
import { useSettings } from '@core/hooks/useSettings'

const { settings, updateSettings, resetSettings, updatePageSettings, isSettingsChanged } = useSettings()

updateSettings({ mode: 'dark' })            // simpan ke cookie
updateSettings({ layout: 'horizontal' })    // 'vertical' | 'collapsed' | 'horizontal'
```

Nilai `settings`: `mode`, `skin`, `semiDark`, `layout`, `navbarContentWidth`, `contentWidth`, `footerContentWidth`, `primaryColor`.

> Harus dipanggil di dalam `SettingsProvider` (sudah otomatis lewat `Providers`).

#### `useImageVariant`

Memilih path gambar sesuai mode terang/gelap (dan skin bordered).

```tsx
import { useImageVariant } from '@core/hooks/useImageVariant'

const img = useImageVariant(mode, lightImg, darkImg)
const imgBordered = useImageVariant(mode, lightImg, darkImg, lightBordered, darkBordered)

<img src={img} alt='ilustrasi' />
```

#### `useObjectCookie`

Menyimpan objek ke cookie.

```tsx
import { useObjectCookie } from '@core/hooks/useObjectCookie'

const [value, setValue] = useObjectCookie<{ name: string }>('my-key', { name: 'default' })
setValue({ name: 'baru' })
```

#### `useLayoutInit`

Menginisialisasi preferensi warna pada pemuatan pertama. Sudah dipanggil otomatis di `LayoutWrapper` / `BlankLayout`.

---

### 7.6 Helper Server (`@core/utils/serverHelpers`)

Modul ini berjalan **hanya di server** (`import 'server-only'`) dan dipakai di Server Components/layout untuk membaca mode & cookie.

```tsx
import { getMode, getSystemMode, getServerMode, getSettingsFromCookie, getSkin } from '@core/utils/serverHelpers'

const mode = await getMode()          // 'system' | 'light' | 'dark'
const systemMode = await getSystemMode() // 'light' | 'dark'
const serverMode = await getServerMode() // mode efektif untuk render awal
const settings = await getSettingsFromCookie()
const skin = await getSkin()
```

> Jangan import modul ini di Client Component (`'use client'`).

---

### 7.7 Konfigurasi (`@configs`)

```tsx
import themeConfig from '@configs/themeConfig'
import primaryColorConfig from '@configs/primaryColorConfig'

themeConfig.templateName       // 'Vuexy' — nama brand
themeConfig.mode               // default mode saat awal
themeConfig.layout             // 'vertical' | 'collapsed' | 'horizontal'
themeConfig.settingsCookieName // nama cookie pengaturan

primaryColorConfig[0].main     // warna primary default (#7367F0)
```

Ubah warna brand default dengan mengedit `primaryColorConfig` / mengubah `settings.primaryColor` lewat `useSettings`.

---

## 8. Menambah Halaman Baru

1. **Halaman dengan dashboard** (navbar + sidebar): buat folder baru di dalam `src/app/(dashboard)/`.

   Contoh `src/app/(dashboard)/produk/page.tsx` → URL `/produk`:

   ```tsx
   export default function Page() {
     return <h1>Halaman Produk</h1>
   }
   ```

2. **Halaman tanpa dashboard** (login/register): buat folder di `src/app/(blank-layout-pages)/`.

3. **Tambahkan ke menu**: edit `src/components/layout/vertical/VerticalMenu.tsx` (dan `horizontal/HorizontalMenu.tsx`), tambahkan `<MenuItem>`:

   ```tsx
   <MenuItem href='/produk' icon={<i className='tabler-box' />}>
     Produk
   </MenuItem>
   ```

   Atau gunakan `GenerateVerticalMenu` dengan array data menu (lihat bagian 7.3).

> Disarankan menaruh markup halaman di `src/views/` (seperti `Login.tsx`, `NotFound.tsx`) lalu `page.tsx` hanya me-render view tersebut. Halaman yang memakai hook/state harus diawali `'use client'`.

---

## 9. Tema & Pengaturan

- **Tema MUI** dibangun di `src/@core/theme/index.ts` (color schemes, typography, shadows, overrides) lalu digabung dengan warna primary dari settings di `src/components/theme/index.tsx`.
- **Deklarasi tipe theme** ada di `src/components/theme/types.ts` (mis. `theme.shape.customBorderRadius`, `theme.customShadows`). Jangan dihapus karena dipakai di banyak komponen.
- **Mode (light/dark/system)** diatur lewat `settings.mode`; gunakan `ModeDropdown` atau hook `useSettings`.
- **Layout (vertical/horizontal/collapsed)** diatur lewat `settings.layout`.
- **Warna brand** diambil dari `settings.primaryColor` (default `primaryColorConfig[0].main`).
- Nilai awal pengaturan disimpan di cookie `themeConfig.settingsCookieName`; untuk mereset ke nilai `themeConfig`, panggil `resetSettings()` dari `useSettings`.

---

## 10. Catatan Pembersihan

Repo ini disisakan **hanya file yang dipakai aplikasi**. Berikut file bawaan template yang telah dihapus:

| File / Folder dihapus | Alasan |
| --- | --- |
| `src/@core/components/customizer/*` | Panel pengubah tema (demo) — tidak dipakai |
| `src/@core/svg/*` (kecuali `Logo.tsx`) | Ikon hanya untuk customizer |
| `src/@core/components/option-menu/*` | Tidak dipakai |
| `src/@core/components/mui/Autocomplete.tsx`, `Avatar.tsx`, `Badge.tsx`, `IconButton.tsx`, `TabList.tsx` | Tidak dipakai |
| `src/@core/styles/stepper.ts`, `src/@core/styles/table.module.css` | Tidak dipakai |
| `src/components/stepper-dot/*` | Tidak dipakai |
| `src/components/theme/mergedTheme.ts`, `userTheme.ts` | Contoh override tema yang tidak aktif |
| `src/data/navigation/*` | Data menu tidak dipakai (menu kini ditulis langsung) |
| `src/utils/getInitials.ts`, `string.ts` | Utilitas demo |

**Dipertahankan meski tidak diimport langsung** (karena dibutuhkan sistem):

- `src/components/theme/types.ts` — deklarasi tipe global untuk MUI theme.
- `src/@core/components/custom-inputs/*` — tipe-nya dipakai oleh `theme/types.ts`.
- `src/assets/iconify-icons/bundle-icons-css.ts` — dipakai oleh script `postinstall` / `build:icons`.

---

## Lisensi

Template dasar: **Vuexy — MUI Next.js Admin Dashboard** (Commercial). Proyek Growvia dibangun di atasnya untuk keperluan Lomba UIN.
