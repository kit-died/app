<template>
  <q-popup-proxy>
    <q-banner>
      <div class="text-h6">{{ title ?? 'Confirm' }}</div>
      <div v-if="messageHtml" class="text-subtitle2" v-html="messageHtml" />
      <div v-else class="text-subtitle2">{{ message }}</div>
      <template #action>
        <q-btn
          v-bind="cancelButtonProps"
          :flat="cancelButtonProps?.flat ?? true"
          :no-caps="cancelButtonProps?.noCaps ?? true"
          :color="cancelButtonProps?.color ?? 'accent'"
          :label="cancelButtonProps?.label ?? 'Cancel'"
          @click="$emit('cancel')"
          v-close-popup
        />
        <q-btn
          v-bind="confirmButtonProps"
          :unelevated="confirmButtonProps?.unelevated ?? true"
          :no-caps="confirmButtonProps?.noCaps ?? true"
          :color="confirmButtonProps?.color ?? 'positive'"
          :label="confirmButtonProps?.label ?? 'Ok'"
          @click="$emit('ok')"
          v-close-popup
        />
      </template>
    </q-banner>
  </q-popup-proxy>
</template>

<script setup lang="ts">
import { QBtnProps } from 'quasar'

defineEmits<{
  (e: 'cancel'): void
  (e: 'ok'): void
}>()

const props = defineProps<{
  title?: string
  message?: string
  messageHtml?: string
  cancelButtonProps?: QBtnProps
  confirmButtonProps?: QBtnProps
}>()

if (!props.message && !props.messageHtml) {
  throw new Error('Missing required prop: message or messageHtml')
}
</script>
