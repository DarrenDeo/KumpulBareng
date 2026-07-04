const { z } = require('zod');

// Daftar kategori yang valid
const VALID_CATEGORIES = [
  'Olahraga',
  'Film',
  'Musik',
  'Game',
  'Belajar',
  'Kuliner',
  'Seni',
  'Teknologi',
  'Lainnya',
];

const createEventSchema = z.object({
  title: z
    .string({ required_error: 'Judul event wajib diisi' })
    .min(3, 'Judul minimal 3 karakter')
    .max(200, 'Judul maksimal 200 karakter')
    .trim(),
  description: z
    .string({ required_error: 'Deskripsi wajib diisi' })
    .min(10, 'Deskripsi minimal 10 karakter')
    .max(5000, 'Deskripsi maksimal 5000 karakter')
    .trim(),
  category: z
    .string({ required_error: 'Kategori wajib diisi' })
    .refine((val) => VALID_CATEGORIES.includes(val), {
      message: `Kategori harus salah satu dari: ${VALID_CATEGORIES.join(', ')}`,
    }),
  location: z
    .string({ required_error: 'Lokasi wajib diisi' })
    .min(3, 'Lokasi minimal 3 karakter')
    .max(300, 'Lokasi maksimal 300 karakter')
    .trim(),
  eventDate: z
    .string({ required_error: 'Tanggal event wajib diisi' })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Format tanggal tidak valid',
    })
    .refine((val) => new Date(val) > new Date(), {
      message: 'Tanggal event harus di masa depan',
    }),
  price: z
    .number({ required_error: 'Harga wajib diisi', invalid_type_error: 'Harga harus berupa angka' })
    .int('Harga harus bilangan bulat')
    .min(0, 'Harga tidak boleh negatif'),
  maxParticipants: z
    .number({ required_error: 'Kapasitas peserta wajib diisi', invalid_type_error: 'Kapasitas harus berupa angka' })
    .int('Kapasitas harus bilangan bulat')
    .min(1, 'Kapasitas minimal 1 peserta')
    .max(10000, 'Kapasitas maksimal 10.000 peserta'),
});

// Schema untuk update — semua field opsional
const updateEventSchema = z.object({
  title: z
    .string()
    .min(3, 'Judul minimal 3 karakter')
    .max(200, 'Judul maksimal 200 karakter')
    .trim()
    .optional(),
  description: z
    .string()
    .min(10, 'Deskripsi minimal 10 karakter')
    .max(5000, 'Deskripsi maksimal 5000 karakter')
    .trim()
    .optional(),
  category: z
    .string()
    .refine((val) => VALID_CATEGORIES.includes(val), {
      message: `Kategori harus salah satu dari: ${VALID_CATEGORIES.join(', ')}`,
    })
    .optional(),
  location: z
    .string()
    .min(3, 'Lokasi minimal 3 karakter')
    .max(300, 'Lokasi maksimal 300 karakter')
    .trim()
    .optional(),
  eventDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Format tanggal tidak valid',
    })
    .refine((val) => new Date(val) > new Date(), {
      message: 'Tanggal event harus di masa depan',
    })
    .optional(),
  price: z
    .number({ invalid_type_error: 'Harga harus berupa angka' })
    .int('Harga harus bilangan bulat')
    .min(0, 'Harga tidak boleh negatif')
    .optional(),
  maxParticipants: z
    .number({ invalid_type_error: 'Kapasitas harus berupa angka' })
    .int('Kapasitas harus bilangan bulat')
    .min(1, 'Kapasitas minimal 1 peserta')
    .max(10000, 'Kapasitas maksimal 10.000 peserta')
    .optional(),
});

module.exports = { createEventSchema, updateEventSchema, VALID_CATEGORIES };
