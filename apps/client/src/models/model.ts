export type Simplify<T> = { [K in keyof T]: T[K] }

export type Model<
  T extends Record<string, unknown>,
  P extends string | Record<string, unknown> = 'id'
> = P extends string
  ? Simplify<{ [K in keyof T]: T[K] } & { [K in P]: number }>
  : P extends Record<string, unknown>
    ? Simplify<{ [K in keyof T]: T[K] } & { [K in keyof P]: P[K] }>
    : never
