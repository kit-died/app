<template>
  <q-card-section class="q-pt-none">
    <select-box
      v-model:model="selected"
      @update:model="selected && $emit('selected', selected)"
      :select-props="selectProps"
    >
      <template #append>
        <q-icon dense color="white" name="sym_o_search" />
      </template>
      <template
        #option="{
          itemProps,
          selected,
          focused,
          opt,
        }: TypedQSelectSlot<'option', User>"
      >
        <q-item
          v-bind="itemProps"
          class="text-white q-pa-sm"
          :class="selected ? 'bg-app-7' : focused ? 'bg-app-6' : 'bg-app-5'"
        >
          <q-item-section>
            <q-item-label>#{{ opt.name }}</q-item-label>
            <q-item-label caption class="text-app-2">{{
              opt.username
            }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <template
        #selected-item="{ opt }: TypedQSelectSlot<'selected-item', User>"
      >
        <q-item>
          <q-item-section>
            <q-item-label>#{{ opt.name }}</q-item-label>
            <q-item-label caption class="text-app-3">{{
              opt.username
            }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </select-box>
  </q-card-section>
</template>

<script setup lang="ts">
import { QSelectProps } from 'quasar'
import SelectBox from 'src/components/SelectBox.vue'
import { usersList } from 'src/mock/index'
import { User } from 'src/models/user'
import { TypedQSelectSlot } from 'src/types/utils'
import { ref } from 'vue'

defineEmits<{
  (e: 'selected', user: User): void
}>()

const query = ref('')
const selectProps = ref<
  Omit<QSelectProps, 'label' | 'modelValue' | 'options'> & {
    options: User[]
  }
>({
  autofocus: true,
  dark: true,
  color: 'secondary',
  inputDebounce: 50,
  emitValue: true,
  useInput: true,
  options: [],
  onFilter: (val, update) => {
    query.value = val

    if (!val) {
      update(() => (selectProps.value.options = []))
      return
    }

    update(() => {
      const needle = val.trim().toLowerCase()
      searchUsers(needle)
    })
  },
})

const selected = ref<User | null>()

function searchUsers(val: string) {
  selectProps.value.options = usersList
    .filter(
      (user) =>
        user.name.toLowerCase().includes(val.trim().toLowerCase()) ||
        user.username.toLowerCase().includes(val.trim().toLowerCase()),
    )
    .slice(0, 10)
}
</script>
