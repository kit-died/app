import { computed, ref } from 'vue'
import { useLazyQuery } from '@vue/apollo-composable'
import { debounce } from 'quasar'
import { FieldNode, OperationDefinitionNode } from 'graphql'
import type { ApolloQueryResult, TypedDocumentNode } from '@apollo/client/core'

const DEFAULT_TAKE = 10

export type DefaultPagedVariables = {
  where?: unknown
  skip?: number
  take?: number
  sort?: string
}

type PagedOptions = {
  useCache?: boolean
  autoload?: boolean
  buildFilter?: () => DefaultPagedVariables['where']
  buildVariables?: (v: DefaultPagedVariables) => DefaultPagedVariables
}

type InferQueryType<T extends TypedDocumentNode> = T extends TypedDocumentNode<infer Query> ? Query : never;

export function useGetPaged<
  TDocumentNode extends TypedDocumentNode,
  TResult extends InferQueryType<TDocumentNode> = InferQueryType<TDocumentNode>,
  TKey extends keyof Omit<TResult, '__typename'> = keyof Omit<TResult, '__typename'>,
>(
  document: TDocumentNode,
  options: PagedOptions = {},
  variables?: DefaultPagedVariables,
) {
  let initialLoad = true
  const key = ((document.definitions[0] as OperationDefinitionNode).selectionSet.selections[0] as FieldNode).name.value

  options.autoload = options.autoload ?? true

  const items = computed<TResult[TKey]>(() => result.value?.[key] || [] as TResult[TKey])

  const hasMoreRows = ref(true)

  let _variables: DefaultPagedVariables = {
    ...variables,
    take: (variables?.take || DEFAULT_TAKE) + 1,
  } as DefaultPagedVariables

  if (options.buildVariables) _variables = options.buildVariables(_variables)

  const { loading, result, load, fetchMore, onResult, refetch } = useLazyQuery<TResult>(
    document,
    _variables,
    {
      fetchPolicy: options.useCache === false ? 'network-only' : undefined
    }
  )

  onResult((param: ApolloQueryResult<TResult>) => {
    if (initialLoad && param.data?.[key]) {
      result.value = {
        [key]: getReducedList(param.data[key], variables?.take || DEFAULT_TAKE)
      } as TResult
    }
  })

  function updateQuery(
    prev: TResult,
    { fetchMoreResult }: { fetchMoreResult?: TResult }
  ): TResult {

    if (!fetchMoreResult) return prev

    const next = getReducedList(fetchMoreResult[key], variables?.take || DEFAULT_TAKE)

    let previous = prev[key]

    if ((next as []).length > 0) {
      if (previous[previous.length - 1].id === next[0].id)
        previous = previous.slice(0, -1)
    }

    return {
      [key]: [...previous, ...next],
    } as TResult
  }

  const query = debounce(async () => {
    initialLoad = true

    _variables.skip = 0
    _variables.where = options.buildFilter?.()

    if (options.buildVariables) _variables = options.buildVariables(_variables)


    await (refetch(_variables) || load(null, _variables))
  }, 400)

  async function showMore(): Promise<void> {
    initialLoad = false

    _variables.skip = (items.value as []).length
    _variables.where = options.buildFilter?.()

    if (options.buildVariables) _variables = options.buildVariables(_variables)

    await fetchMore({
      variables: _variables,
      updateQuery,
    })
  }

  function getReducedList(results: TResult[TKey], requestedLength = 0): TResult[TKey] {
    hasMoreRows.value = (results as []).length > requestedLength
    return hasMoreRows.value ? results.slice(0, -1) : results
  }

  if (options.autoload === true) setTimeout(() => load(), 10)

  return {
    items,
    hasMoreRows,
    loading,
    result,
    query,
    load,
    showMore,
    onResult,
    refetch,
  } as const
}
