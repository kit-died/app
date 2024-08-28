
import { useQuery } from '@vue/apollo-composable'
import { camelCase } from 'change-case'
import { DocumentNode } from 'graphql/language/ast'
import { computed } from 'vue'
import { Model } from '../models/model'


interface IGetOneOptions {
  key: string
  id: number
  idKey?: string
  getQuery: DocumentNode
}

export function useGetOne<T extends Model<Record<string, unknown>>>(options: IGetOneOptions) {
  const item = computed<T>(() => result.value?.[camelCase(options.key)])

  const { loading, result, onResult, refetch } = useQuery(options.getQuery, {
    [options.idKey || 'id']: options.id,
  })

  return {
    item,
    loading,
    onResult,
    refetch,
  }
}
