import { z } from 'zod'

export const signUpBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

export type SignUpBodySchema = z.infer<typeof signUpBodySchema>
