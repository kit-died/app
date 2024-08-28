import { ApolloError } from '@apollo/client/core'
import { useMutation } from '@vue/apollo-composable'
import { noCase, sentenceCase } from 'change-case'
import { DocumentNode } from 'graphql'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { Model } from 'src/models/model'
import { computed, ref, UnwrapRef } from 'vue'

type PropType = {
  input?: Model<Record<string, unknown>>
  [key: string]: object | object | string | number | boolean | undefined
}

interface IFormDialogOptions<ModelType> {
  key?: string
  createQuery?: DocumentNode
  updateQuery?: DocumentNode
  props?: PropType
  defaultModel?: Partial<ModelType>
  refetchQueries?: string[]
  dialogRequestTransform: () => ModelType
  onSave?: (data?: ModelType) => Promise<void>
  onCreateError?: (error: ApolloError) => void
  onUpdateError?: (error: ApolloError) => void
  onCreateErrorMessage?: (error: ApolloError) => string
  onUpdateErrorMessage?: (error: ApolloError) => string
}

export function useFormDialog<ModelType extends Record<string, unknown>>(
  options: IFormDialogOptions<ModelType> = {} as IFormDialogOptions<ModelType>,
) {
  const $q = useQuasar()

  const isEdit = computed(() => !!options.props?.input?.id)

  const model = ref<ModelType>({
    ...options.defaultModel,
    ...options.props?.input,
  } as ModelType)

  const loading = ref(false)

  const { dialogRef, onDialogCancel, onDialogHide, onDialogOK } =
    useDialogPluginComponent()

  const {
    mutate: createItem,
    loading: creating,
    onDone: onCreated,
    onError: onCreateError,
  } = useMutation(options.createQuery!, { refetchQueries: options?.refetchQueries })

  const {
    mutate: updateItem,
    loading: updating,
    onDone: onUpdated,
    onError: onUpdateError,
  } = useMutation(options.updateQuery!, { refetchQueries: options?.refetchQueries })

  onCreated(() => success())
  onCreateError((param: ApolloError) => {
    if (options.onCreateError) options.onCreateError(param)
    else {
      $q.notify({
        type: 'negative',
        icon: 'sym_o_warning',
        message: options.onCreateErrorMessage
          ? options.onCreateErrorMessage(param)
          : `Unable to create ${sentenceCase(options.key || 'item')}.`,
      })
    }
  })

  onUpdated(() => success())
  onUpdateError((param: ApolloError) => {
    if (options.onUpdateError) options.onUpdateError(param)
    else {
      $q.notify({
        type: 'negative',
        icon: 'sym_o_warning',
        message: options.onUpdateErrorMessage
          ? options.onUpdateErrorMessage(param)
          : `Unable to update ${sentenceCase(options.key || 'item')}.`,
      })
    }
  })

  function success() {
    $q.notify({
      type: 'positive',
      icon: 'sym_o_check_circle',
      message: isEdit.value
        ? `${sentenceCase(options.key || 'item')} updated.`
        : `New ${noCase(options.key || 'item')} added.`,
    })
  }

  function onDialogShow() {
    if (options.props?.input?.id)
      model.value = Object.assign({}, options.props.input) as UnwrapRef<ModelType>
  }

  async function onOKClick(): Promise<void> {
    let res
    try {
      loading.value = true

      if (isEdit.value) {
        res = await updateItem({
          id: model.value.id,
          data: options.dialogRequestTransform(),
        })
      } else {
        res = await createItem({ data: options.dialogRequestTransform() })
      }

      if (options.onSave) await options.onSave()
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }

    onDialogOK(res?.data)
  }

  return {
    isEdit,
    model,
    loading,
    dialogRef,
    onDialogShow,
    onOKClick,
    onDialogCancel,
    onDialogHide,
    onDialogOK,
    creating,
    onCreated,
    onCreateError,
    updating,
    onUpdated,
    onUpdateError,
  }
}
