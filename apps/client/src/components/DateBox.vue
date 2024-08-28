<template>
  <div>
    <div
      class="row items-end justify-between q-mb-xs text-weight-bold text-app-5 text-subtitle2"
      v-if="label"
    >
      <div>{{ label }}</div>
      <div v-if="date" class="text-weight-medium text-xs">
        {{ formatDate(date, 'D MMMM YYYY') }}
      </div>
    </div>
    <q-input
      v-model="date"
      v-bind="inputProps"
      mask="####-##-##"
      borderless
      outlined
      dense
    >
      <template #append>
        <q-icon name="sym_o_calendar_clock" class="cursor-pointer" />
        <q-popup-proxy
          ref="proxyRef"
          cover
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date
            v-model="date"
            @update:model-value="dateUpdated"
            mask="YYYY-MM-DD"
            minimal
          >
            <div class="row items-center-justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import { QInputProps, QPopupProxy } from 'quasar'
import { formatDate } from 'src/common/utils'
import { ref } from 'vue'

export type InputBoxProps = {
  label?: string
  inputProps?: Omit<QInputProps, 'label'>
}

const model = defineModel<string | null | undefined>('model')
const date = ref(model.value)

defineProps<InputBoxProps>()

const proxyRef = ref<InstanceType<typeof QPopupProxy>>()

function dateUpdated(value: string) {
  model.value = value
  proxyRef.value?.hide()
}
</script>

<style scoped lang="scss">
:deep(.q-field__control) {
  border-radius: 8px;
}
</style>
