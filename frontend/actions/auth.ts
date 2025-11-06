'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import z from 'zod'

import { SignUpFormSchema, type FormState } from '@/validations/auth'
import { registerUserService } from '@/lib/strapi'

const cookieConfig = {
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
  httpOnly: true,
  domain: process.env.HOST ?? 'localhost',
  secure: process.env.NODE_ENV === 'production',
}

export async function registerUserAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const fields = {
    username: formData.get('username') as string,
    password: formData.get('password') as string,
    email: formData.get('email') as string,
  }

  const validatedFields = SignUpFormSchema.safeParse(fields)

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error)

    return {
      success: false,
      message: 'Validation failed',
      strapiErrors: null,
      zodErrors: flattenedErrors.fieldErrors,
      data: {
        ...prevState.data,
        ...fields,
      },
    }
  }
  const response = await registerUserService(validatedFields.data)

  if (!response || response.error) {
    return {
      success: false,
      message: 'Registration failed',
      strapiErrors: response?.error,
      zodErrors: null,
      data: fields,
    }
  }

  const cookieStore = await cookies()
  cookieStore.set('jwt', response.jwt, cookieConfig)
  redirect('/dashboard')
}
