import { z } from 'zod'

export const experienceTypes = [
  'organisation',
  'committee',
  'internship',
  'freelance',
  'project',
  'competition',
  'other'
] as const

export const experienceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Judul pengalaman minimal 3 karakter')
    .max(150, 'Judul pengalaman maksimal 150 karakter'),
  type: z.enum(experienceTypes, {
    message: 'Pilih tipe pengalaman yang valid'
  }),
  role: z
    .string()
    .trim()
    .min(2, 'Peran/posisi minimal 2 karakter')
    .max(100, 'Peran/posisi maksimal 100 karakter'),
  institutionName: z
    .string()
    .trim()
    .max(150, 'Nama institusi/organisasi maksimal 150 karakter')
    .optional()
    .default(''),
  startDate: z
    .string()
    .min(4, 'Tanggal/bulan mulai wajib diisi'),
  endDate: z
    .string()
    .optional()
    .nullable(),
  isOngoing: z
    .boolean()
    .default(false),
  description: z
    .string()
    .trim()
    .min(50, 'Deskripsi minimal 50 karakter agar AI dapat mengekstrak skill secara akurat')
    .max(1000, 'Deskripsi maksimal 1000 karakter'),
  proofUrl: z
    .string()
    .trim()
    .url('Tautan bukti harus berupa URL yang valid (diawali http:// atau https://)')
    .optional()
    .or(z.literal(''))
    .nullable()
}).refine(
  data => {
    if (!data.isOngoing && data.endDate && data.startDate) {
      const start = new Date(data.startDate).getTime()
      const end = new Date(data.endDate).getTime()
      if (!isNaN(start) && !isNaN(end) && end < start) {
        return false
      }
    }
    return true
  },
  {
    message: 'Tanggal selesai tidak boleh lebih awal dari tanggal mulai',
    path: ['endDate']
  }
)

export type ExperienceInput = z.infer<typeof experienceSchema>
