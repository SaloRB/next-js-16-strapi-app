import { z } from 'zod'

export const SignInFormSchema = z.object({
  identifier: z
    .string()
    .min(3, 'Username or email must be at least 3 characters'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be at most 100 characters'),
})

export const SignUpFormSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters'),
  email: z.email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be at most 100 characters'),
})

export type SignInFormValues = z.infer<typeof SignInFormSchema>
export type SignUpFormValues = z.infer<typeof SignUpFormSchema>

export type FormState = {
  success?: boolean
  message?: string
  data?: {
    identifier?: string
    username?: string
    email?: string
    password?: string
  }
  strapiErrors?: {
    status: number
    name: string
    message: string
    details?: Record<string, string>[]
  } | null
  zodErrors?: {
    identifier?: string[]
    username?: string[]
    email?: string[]
    password?: string[]
  } | null
}
