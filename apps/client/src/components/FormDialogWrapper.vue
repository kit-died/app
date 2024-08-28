<template>
  <q-dialog ref="dialogRef">
    <q-card :style="`width: ${width}px; max-width: 90vw`">
      <q-form @submit="submit">
        <q-card-section v-if="title" class="q-pb-sm text-weight-bold text-subtitle1 text-app-7">
          {{ title }}
        </q-card-section>
        <slot></slot>
        <q-card-actions align="right" class="q-pb-md q-px-md">
          <q-btn flat round icon="sym_o_close" :disable="loading" @click="cancel" />
          <q-btn flat round icon="sym_o_check" type="submit" :loading="loading" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { QDialog } from 'quasar'
import { onMounted, ref } from 'vue'

defineProps({
  loading: { type: Boolean, default: false },
  title: { type: String, default: null },
  width: { type: Number, default: 350 },
})

const emits = defineEmits(['on-mount', 'submit', 'cancelled'])

const dialogRef = ref<InstanceType<typeof QDialog>>()

onMounted(() => {
  emits('on-mount', dialogRef.value)
})

function submit(event: SubmitEvent | Event) {
  emits('submit', event)
}

function cancel() {
  emits('cancelled')
}
</script>
