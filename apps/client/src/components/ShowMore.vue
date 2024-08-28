<template>
  <div>
    <q-separator v-if="!hideSeparator" />
    <q-btn
      v-bind="buttonProps"
      :flat="buttonProps?.flat ?? true"
      :no-caps="buttonProps?.noCaps ?? true"
      :padding="buttonProps?.padding ?? 'sm md'"
      :disable="!hasMoreRows"
      :loading="loading"
      class="full-width not-rounded"
      @click="$emit('on-click')"
    >
      <span :class="textClass">
        {{ hasMoreRows ? 'Show More' : 'No more records' }}
      </span>
      <q-space />
      <span :class="textClass">Showing {{ count }} records</span>
      <template #loading>
        <q-spinner-dots />
      </template>
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { QBtnProps } from 'quasar'

defineEmits<{ (e: 'on-click'): void }>()

withDefaults(defineProps<{
  count: number
  hasMoreRows: boolean
  loading: boolean
  hideSeparator?: boolean
  buttonProps?: QBtnProps
  textClass?: string
}>(), {
  textClass: 'text-caption',
  buttonProps: undefined
})
</script>
