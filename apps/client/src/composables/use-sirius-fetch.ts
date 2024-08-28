import { onMounted, ref, watch } from 'vue'

export const useSiriusFetch = <T>(token?: string, query?: string) => {
  interface ISiriusFetchResult {
    count: number
    page: {
      size: number
      number: number
    }
    rows: T[]
  }
  const rawResult = ref<ISiriusFetchResult>()
  const result = ref<T[]>()
  const loading = ref()
  const error = ref()
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }
  const search = ref(query || '')

  const siriusUrl = process.env.OAUTH_SERVER
  if (!token) {
    window.localStorage.clear()
    window.location.href = '/logout'
    throw new Error('Token is required, please sign in again')
  }

  const fetchData = async (query?: string) => {
    try {
      loading.value = true
      const response = await fetch(`${siriusUrl}/api/users?filter[query]=${query || search.value}`, {
        method: 'GET',
        headers,
      })
      rawResult.value = await response.json() as ISiriusFetchResult
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  const onResult = (callback: (data: ISiriusFetchResult | undefined) => void) => {
    watch(rawResult, (newValue) => {
      result.value = newValue?.rows
      callback(newValue)
    })
  }

  onMounted(async () => {
    await fetchData()
  })

  return {
    result,
    rawResult,
    loading,
    error,
    refetch: fetchData,
    onResult,
    search,
  }
}
