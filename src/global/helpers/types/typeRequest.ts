import type { z } from 'zod'

export type BaseSchemaType<T, U> = {
  [K in Exclude<keyof T, keyof U>]: T[K] extends z.ZodType<any, any, any> ? z.infer<T[K]> : never
}

export type SchemaTypes<T> = {
  [K in keyof T]: T[K] extends z.ZodType<any, any, any> ? z.infer<T[K]> : never
}
