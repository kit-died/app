import { QSelectSlots } from 'quasar'

type FunctionWithParameterKeys<T> = {
  [K in keyof T]: T[K] extends (...args: infer P) => unknown
    ? P extends [unknown, ...unknown[]]
      ? K
      : never
    : never
}[keyof T]

export type TypedQSelectSlot<
  TSlot extends FunctionWithParameterKeys<QSelectSlots>,
  U,
> = Omit<Parameters<QSelectSlots[TSlot]>[0], 'opt'> & { opt: U }
