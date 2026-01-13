import { z } from 'zod'

export const signUpBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  accountType: z
    .enum(['INDIVIDUAL', 'ORGANIZATION'])
    .optional()
    .default('INDIVIDUAL'),
  orgType: z.enum(['PROVIDER', 'CLIENT']).optional(),
})

export type SignUpBodySchema = z.infer<typeof signUpBodySchema>
