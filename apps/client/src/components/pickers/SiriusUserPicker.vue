<template>
  <select-box
    :loading="loading"
    v-model="model"
    :select-props="selectProps"
    :label="label"
  >
    <template v-if="search" #no-option>
        <div class="q-pa-md text-center">
          No entity found matching <b>'{{ search }}'</b>
        </div>
    </template>
  </select-box>
</template>

<script setup lang="ts">
import { LocalStorage, QSelect, QSelectProps } from 'quasar'
import SelectBox from 'src/components/SelectBox.vue'
import { useSiriusFetch } from 'src/composables/use-sirius-fetch'
import { ISiriusUser } from 'src/models/user'
import { IOauthToken } from 'src/services/auth.service'
import { computed, ref, watch } from 'vue'

const model = defineModel<ISiriusUser>('modelValue', {
  type: Object
})

const emit = defineEmits(['update:modelValue'])

withDefaults(defineProps<{
  label?: string
}>(), {
  label: 'User'
})

const token = ref(LocalStorage.getItem<IOauthToken>('oauth-token')?.access_token)

const {
  result: siriusUsers,
  onResult: onSiriusResult,
  refetch: refetchSirius,
  loading,
  search
} = useSiriusFetch<ISiriusUser>(token.value)

const where = ref(JSON.stringify({
  username: {
    in: []
  }
}))

onSiriusResult(() => {
  // searches for users in sirius results
  where.value = JSON.stringify({
    username: {
      in: siriusUsers.value?.map(u => u.username) || []
    }
  })
  emit('update:modelValue', siriusUsers.value?.find(u => u.username === model.value?.username))
})

const onFilter: QSelect['onFilter'] = async (val, doneFn, abort) => {
  search.value = val

  const afterFn = async () => {
    const needle = val.toLowerCase()
    search.value = needle
    await refetchSirius()

    return (opt: ISiriusUser) => opt.name.toLowerCase().indexOf(needle) > -1
  }

  doneFn(afterFn)
}

const selectProps = computed<Omit<QSelectProps, 'label' | 'modelValue'>>(() => ({
  inputDebounce: 250,
  multiple: false,
  optionLabel: 'name',
  optionValue: 'id',
  useInput: true,
  options: siriusUsers.value,
  onFilter
}))

</script>
