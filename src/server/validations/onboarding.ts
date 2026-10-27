import { z } from 'zod'

export const onboardingProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Nama lengkap minimal 2 karakter')
    .max(100, 'Nama lengkap maksimal 100 karakter')
    .optional(),
  institution: z
    .string()
    .trim()
    .min(2, 'Nama institusi/universitas minimal 2 karakter')
    .max(150, 'Nama institusi maksimal 150 karakter'),
  major: z
    .string()
    .trim()
    .min(2, 'Jurusan/program studi minimal 2 karakter')
    .max(150, 'Jurusan maksimal 150 karakter'),
  graduationYear: z.coerce
    .number()
    .int('Tahun kelulusan harus berupa angka')
    .min(2010, 'Tahun kelulusan tidak valid (minimal 2010)')
    .max(2040, 'Tahun kelulusan maksimal 2040'),
  bio: z.string().trim().max(1000, 'Bio maksimal 1000 karakter').optional(),
  headline: z.string().trim().max(150, 'Headline maksimal 150 karakter').optional()
})

export const onboardingInterestsSchema = z.object({
  careerFieldIds: z
    .array(z.string().uuid('ID bidang karier tidak valid'))
    .min(1, 'Pilih minimal 1 bidang karier')
    .max(3, 'Maksimal 3 bidang karier yang dapat dipilih')
})

export const onboardingExperienceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Judul pengalaman minimal 3 karakter')
    .max(150, 'Judul pengalaman maksimal 150 karakter'),
  type: z.enum([
    'organisation',
    'committee',
    'internship',
    'freelance',
    'project',
    'competition',
    'other'
  ], {
    message: 'Tipe pengalaman tidak valid'
  }),
  role: z
    .string()
    .trim()
    .min(2, 'Peran/posisi minimal 2 karakter')
    .max(100, 'Peran/posisi maksimal 100 karakter'),
  institutionName: z
    .string()
    .trim()
    .min(2, 'Nama lembaga/perusahaan minimal 2 karakter')
    .max(150, 'Nama lembaga/perusahaan maksimal 150 karakter'),
  startDate: z.string().min(4, 'Tanggal/bulan mulai wajib diisi'),
  endDate: z.string().optional().nullable(),
  isOngoing: z.boolean().default(false),
  description: z.string().trim().max(2000, 'Deskripsi maksimal 2000 karakter').optional(),
  proofUrl: z.string().url('Tautan bukti harus berupa URL valid').optional().or(z.literal(''))
})

export type OnboardingProfileInput = z.infer<typeof onboardingProfileSchema>
export type OnboardingInterestsInput = z.infer<typeof onboardingInterestsSchema>
export type OnboardingExperienceInput = z.infer<typeof onboardingExperienceSchema>
