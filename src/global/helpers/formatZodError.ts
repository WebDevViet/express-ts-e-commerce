import type { ZodError } from 'zod'

const formatZodError = (error: ZodError) =>
  error?.issues.reduce<Record<string, string>>((errors, issue) => {
    errors[issue.path.join('.')] = issue.message
    return errors
  }, {}) ?? null

export default formatZodError
