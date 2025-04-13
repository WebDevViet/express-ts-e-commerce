import { ObjectId } from 'mongodb'
import { z } from 'zod'
import { PASSWORD_REGEX, USERNAME_REGEX } from '~/global/constants/regex'

const userZod = z.object({
  id: z
    .string()
    .trim()
    .refine((value: string) => ObjectId.isValid(value), {
      message: 'Id is invalid'
    })
    .transform((value: string) => new ObjectId(value)),
  name: z
    .string()
    .trim()
    .min(1, { message: 'Name is required' })
    .max(50, { message: 'Name must be 1-50 characters long' }),
  email: z.string().trim().nonempty({ message: 'Please enter your email' }).email({ message: 'Email is invalid' }),
  password: z
    .string()
    .nonempty({ message: 'Please enter your password' })
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(100, { message: 'Password must not exceed 100 characters' })
    .regex(PASSWORD_REGEX, {
      message:
        'Password must include at least 1 special character (e.g., !, @, #, $), both uppercase and lowercase letters, and at least 1 digit'
    }),
  confirmPassword: z.string(),
  dateOfBirth: z
    .string()
    .datetime({ message: 'Date of birth is invalid' })
    .transform((value) => new Date(value)),
  avatar: z.string().url({ message: 'Avatar must be a valid URL' }),
  username: z
    .string()
    .trim()
    .min(4, { message: 'Username must be at least 4 characters long' })
    .max(15, { message: 'Username must not exceed 15 characters' })
    .regex(USERNAME_REGEX, {
      message:
        'Username must be 4-15 characters long and can only contain letters, numbers, and underscores. It also cannot be entirely numbers'
    }),
  bio: z.string().trim().max(160, { message: 'Bio must not exceed 160 characters' }),
  location: z.string().trim().max(100, { message: 'Location must not exceed 100 characters' }),
  website: z.string().url({ message: 'Website must be a valid URL' }),
  coverPhoto: z.string().url({ message: 'Cover photo must be a valid URL' })
})

export default userZod
