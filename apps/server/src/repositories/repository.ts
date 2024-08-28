import { AnyColumn, Column, ExtractTablesWithRelations, SQL, and, asc, desc, eq } from 'drizzle-orm'
import { RelationalQueryBuilder } from 'drizzle-orm/pg-core/query-builders/query'
import { ColumnKeys, ColumnName, DbSchema, Entity, SchemaTables, db } from '../../drizzle/db'
import * as schemas from '../../drizzle/schema'
import { CustomFilters, Filter, InferPkType, WhereClause, buildWhere } from './utils'

export abstract class Repository<
  N extends Entity,
  PK extends readonly [ColumnName<N>, ...ColumnName<N>[]] | ColumnName<N>,
> {
  protected readonly query: RelationalQueryBuilder<ExtractTablesWithRelations<DbSchema>, ExtractTablesWithRelations<DbSchema>[N]>
  protected readonly table: SchemaTables[N]
  protected readonly defaultLimit: number = 10 as const
  protected readonly db = db
  protected readonly schema = schemas
  protected customFilters?: CustomFilters

  constructor(protected name: N, protected readonly primaryKey: PK) {
    this.query = db.query[name]
    this.table = schemas[name]
  }

  findByPk(pk: InferPkType<N, PK>) {
    return this.query.findFirst({ where: this.buildPkFilter(pk) })
  }

  findOne(options: Pick<Filter<N>, 'where' | 'sort'> = {}) {
    return this.query.findFirst({
      orderBy: this.buildOrderBy(options.sort),
      where: this.buildWhere(options.where)
    })
  }

  findMany(options: Filter<N> = {}) {
    return this.query.findMany(this.buildOptions(options))
  }

  async create(data: typeof this.table.$inferInsert) {
    return (await db.insert(this.table).values(data as never).returning())[0]
  }

  async update(pk: InferPkType<N, PK>, data: Partial<typeof this.table.$inferInsert>) {
    return (await db.update(this.table).set(data as never).where(this.buildPkFilter(pk)).returning())[0]
  }

  createMany(data: typeof this.table.$inferInsert[]) {
    return db.insert(this.table).values(data as never[])
  }

  updateMany(where: Filter<N>['where'], data: Partial<typeof this.table.$inferInsert>) {
    return db.update(this.table).set(data as never).where(this.buildWhere(where))
  }

  async delete(pk: InferPkType<N, PK>) {
    return (await db.delete(this.table).where(this.buildPkFilter(pk)).returning())[0]
  }

  protected buildOrderBy(orderBy: Filter<N>['sort']) {
    return orderBy?.map(([column, order]) => order?.toLowerCase() === 'desc' ? desc(this.table[column] as AnyColumn) : asc(this.table[column] as AnyColumn))
  }

  protected buildWhere(where?: WhereClause<N>): SQL | undefined {
    if (!where || Object.keys(where).length === 0) return
    return buildWhere(this.table, where, this.customFilters)
  }

  protected buildOptions(options: Filter<N>) {
    return {
      orderBy: this.buildOrderBy(options.sort),
      limit: options.take ?? this.defaultLimit,
      offset: options.skip,
      where: this.buildWhere(options.where)
    }
  }

  protected buildPkFilter(pk: InferPkType<N, PK>): SQL {
    return Array.isArray(this.primaryKey)
      ? and(...this.primaryKey.map((k: keyof typeof pk & ColumnKeys<N>) => eq(this.table[k] as Column, pk[k]))) as SQL
      : eq(this.table[this.primaryKey as ColumnKeys<N>] as Column, pk)
  }
}
