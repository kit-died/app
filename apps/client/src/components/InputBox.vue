<template>
  <div>
    <div
      class="q-mb-xs text-weight-bold text-app-5 text-subtitle2"
      v-if="label"
    >
      {{ label }}
    </div>
    <q-input v-model="model" v-bind="inputProps" borderless outlined dense>
      <template v-if="$slots.after" #after>
        <slot name="after" />
      </template>
      <template v-if="$slots.append" #append>
        <slot name="append" />
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import { QInputProps } from 'quasar'

export type InputBoxProps = {
  label?: string
  inputProps?: Omit<QInputProps, 'label' | 'modelValue'>
}

const model = defineModel<string | number | FileList | null | undefined>()

defineProps<InputBoxProps>()
</script>

<style scoped lang="scss">
:deep(.q-field__control) {
  border-radius: 8px;
}
</style>
