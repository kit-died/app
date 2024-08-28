<template>
  <select-box
    v-model:model="user"
    @update:model="model = user"
    :select-props="selectProps"
    :label="label"
  >
    <template v-if="search" #no-option>
      <div class="q-pa-md text-center">
        No user found matching <b>'{{ search }}'</b>
      </div>
    </template>
  </select-box>
</template>

<script setup lang="ts">
import { useLazyQuery } from '@vue/apollo-composable'
import { QSelectProps } from 'quasar'
import SelectBox from 'src/components/SelectBox.vue'
import { GetUserListDocument, UserWhere } from 'src/gql/graphql'
import { User } from 'src/models/user'
import { ref } from 'vue'

const model = defineModel<User>()
const user = ref(model.value)

const {
  load,
  refetch,
  onResult
} = useLazyQuery(GetUserListDocument, {}, {fetchPolicy: 'network-only'})

const props = withDefaults(defineProps<{
  label?: string
  clearable?: boolean
}>(), {
  label: 'User'
})

const search = ref('')
const selectProps = ref<Omit<QSelectProps, 'label' | 'modelValue'>>({
  clearable: props.clearable,
  inputDebounce: 50,
  multiple: false,
  optionLabel: 'name',
  optionValue: 'id',
  useInput: true,
  options: [],
  onFilter: (val, update) => {
    search.value = val

    update(async () => {
      const where:UserWhere = {
        name: {
          contains: val
        }
      }

      await (refetch({ where }) || load(null, { where }))
    })
  },
})

onResult((res) => {
  if (res.data.users?.length) {
    selectProps.value.options = res.data.users
  }
})

</script>
