<template>
  <div>
    <div
      class="row items-center q-mb-xs text-weight-bold text-app-5 text-subtitle2"
      v-if="label"
    >
      <div>{{ label }}</div>
      <slot name="append-label" />
    </div>
    <q-select
      v-model="model"
      v-bind="selectProps"
      borderless
      dense
      :outlined="selectProps?.outlined !== false"
      :loading="loading"
    >
      <template v-if="$slots['no-option']" #no-option>
        <slot name="no-option">No options available</slot>
      </template>
      <template v-if="$slots.prepend" #prepend>
        <slot name="prepend" />
      </template>
      <template v-if="$slots.append" #append>
        <slot name="append" />
      </template>
      <template v-if="$slots.selected" #selected>
        <slot name="selected" />
      </template>
      <template v-if="$slots.option" #option="props">
        <slot name="option" v-bind="props" />
      </template>
      <template v-if="$slots['selected-item']" #selected-item="props">
        <slot name="selected-item" v-bind="props" />
      </template>
    </q-select>
  </div>
</template>

<script setup lang="ts" generic="T">
import { QSelectProps } from 'quasar'

export type SelectBoxProps = {
  label?: string
  selectProps?: Omit<QSelectProps, 'label' | 'modelValue'>
  loading?: boolean
}

const model = defineModel<T | null | undefined>()

defineProps<SelectBoxProps>()
</script>

<style scoped lang="scss">
:deep(.q-field__control) {
  border-radius: 8px;
}
</style>
