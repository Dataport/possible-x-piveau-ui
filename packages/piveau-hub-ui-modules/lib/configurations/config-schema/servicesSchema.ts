import * as z from 'zod'

export const servicesSchema = z.object({
  datasetService: z.function(),
  catalogService: z.function(),
  uploadService: z.function(),
  gazetteerService: z.function(),
})
