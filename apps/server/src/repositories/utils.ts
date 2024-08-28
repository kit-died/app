import { Column, SQL, and, or, eq, gt, gte, ilike, inArray, isNotNull, isNull, lt, lte, ne, notIlike, notInArray, between, notBetween } from 'drizzle-orm'
import { ColumnName, Entity, OnlyColumns, SchemaTables } from '../../drizzle/db'

export function buildWhere<N extends Entity>(table: SchemaTables[N], where: WhereClause<N>, customFilters?: CustomFilters, returnArray?: false): SQL | undefined
export function buildWhere<N extends Entity>(table: SchemaTables[N], where: WhereClause<N>, customFilters?: CustomFilters, returnArray?: true): SQL[]
export function buildWhere<N extends Entity>(table: SchemaTables[N], where: WhereClause<N>, customFilters: CustomFilters = {}, returnArray = false): SQL[] | SQL | undefined {
  const conditions: SQL[] = []

  Object.entries(where).forEach(([key, values]) => {
    if (['and', 'or'].includes(key)) {
      const nested = values.flatMap((w: WhereClause<N>) => buildWhere(table, w, customFilters, true))
      conditions.push((key === 'and' ? and(...nested) : or(...nested)) as SQL)
    } else if (key in customFilters) {
      const condition = customFilters[key](values)
      if (condition) conditions.push(condition)
    } else {
      Object.entries(values).forEach(([op, opValue]) => {
        const condition = buildOpValue(table, op as keyof WhereOps<N, ColumnName<N>>, key as ColumnName<N>, opValue)
        if (condition) conditions.push(condition)
      })
    }
  })

  if (conditions.length === 0) return
  if (returnArray === true) return conditions.filter(c => c)
  if (conditions.length === 1) return conditions[0]
  return and(...conditions)
}

export function buildOpValue<
  N extends Entity,
  K extends ColumnName<N>,
  Op extends keyof WhereOps<N, K>
>(
  table: SchemaTables[N],
  op: Op,
  columnName: K,
  value: WhereOps<N, K>[Op]
): SQL | undefined {
  const column = table[columnName] as Column
  if (typeof value === 'undefined') return

  let operator: typeof between | typeof notBetween | typeof inArray | typeof notInArray

  switch (op) {
    case 'eq': return value === null ? isNull(column) : eq(column, value)
    case 'ne': return value === null ? isNotNull(column) : ne(column, value)
    case 'gt': return gt(column, value)
    case 'gte': return gte(column, value)
    case 'lt': return lt(column, value)
    case 'lte': return lte(column, value)
    case 'contains': return ilike(column, `%${value}%`)
    case 'notContains': return notIlike(column, `%${value}%`)
    case 'between':
    case 'notBetween':
    case 'in':
    case 'notIn':
      if (!Array.isArray(value) || value.some(v => typeof v === 'undefined' || v === null)) throw new Error(`Invalid value for ${op}`)
      if (value.length === 0) return
      if (op === 'between' || op === 'notBetween') {
        if (value.length !== 2) throw new Error(`Invalid value for ${op}`)
        operator = op === 'between' ? between : notBetween
        return operator(column, value[0], value[1])
      }
      operator = op === 'in' ? inArray : notInArray
      return operator(column, value)
    default: throw new Error(`Invalid operator: ${op}`)
  }
}

export type CustomFilters = Record<string, (ops: WhereOps<Entity, ColumnName<Entity>>) => SQL>
export type WhereAnd<N extends Entity> = { and: WhereClause<N>[] }
export type WhereOr<N extends Entity> = { or: WhereClause<N>[] }
export type OpValue<N extends Entity, K extends keyof SchemaTables[N], IsArray extends boolean = false> =
  IsArray extends true ? OnlyColumns<SchemaTables[N][K]>['data'][] : OnlyColumns<SchemaTables[N][K]>['data']

export type WhereOps<N extends Entity, K extends ColumnName<N>> = {
  eq?: OpValue<N, K> | null
  ne?: OpValue<N, K> | null
  gt?: OpValue<N, K>
  gte?: OpValue<N, K>
  lt?: OpValue<N, K>
  lte?: OpValue<N, K>
  contains?: OpValue<N, K>
  notContains?: OpValue<N, K>
  in?: OpValue<N, K, true>
  notIn?: OpValue<N, K, true>
  between?: [OpValue<N, K>, OpValue<N, K>]
  notBetween?: [OpValue<N, K>, OpValue<N, K>]
}

export type WhereFields<N extends Entity> = {
  [K in ColumnName<N>]?: WhereOps<N, K>
}

export type WhereClause<N extends Entity> =
  | WhereFields<N>
  | WhereAnd<N>
  | WhereOr<N>

export type OrderType = 'asc' | 'desc'
export type OrderBy<N extends Entity> = [[ColumnName<N>, OrderType], ...[ColumnName<N>, OrderType][]]
export type Filter<N extends Entity> = {
  take?: number
  skip?: number
  sort?: OrderBy<N>
  where?: WhereClause<N>
}

export type InferPkType<
  N extends Entity,
  Cols extends readonly [ColumnName<N>, ...ColumnName<N>[]] | ColumnName<N>,
> = Cols extends ColumnName<N>
  ? OnlyColumns<SchemaTables[N][Cols]>['data']
  : Cols extends [ColumnName<N>, ...ColumnName<N>[]]
  ? { [K in Cols[number]]: OnlyColumns<SchemaTables[N][K]>['data'] }
  : never