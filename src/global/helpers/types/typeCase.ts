type toCamelCase<S extends string> = S extends `${infer T}_${infer U}` ? `${T}${Capitalize<toCamelCase<U>>}` : S

export type TCamelCase<T> = {
  [K in keyof T as K extends string ? toCamelCase<K> : K]: T[K]
}

type toSnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Capitalize<T> ? '_' : ''}${Lowercase<T>}${toSnakeCase<U>}`
  : S

export type TSnakeCase<T> = {
  [K in keyof T as K extends string ? toSnakeCase<K> : K]: T[K]
}
