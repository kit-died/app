<template>
  <q-item
    class="bg-white border rounded-md overflow-hidden list-item"
  >
    <q-item-section>
      <q-item-label>
        <highlight-text :text="label" :highlight="query" />
      </q-item-label>
      <q-item-label v-if="caption" caption>
        <highlight-text :text="caption" :highlight="query" />
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <div>
        <q-btn v-if="onUpdate" @click="props.onUpdate?.()" round flat size="sm" color="app-2" icon="sym_o_edit" />
        <q-btn v-if="onDelete" :loading="deleting" round flat size="sm" color="app-2" icon="sym_o_delete">
          <confirm-popup
            @ok="confirmDelete"
            :confirm-button-props="{ label: confirmButton, color: 'warning', textColor: 'black' }"
            :title="confirmTitle"
            :message-html="confirmMessage"
          />
        </q-btn>
      </div>
    </q-item-section>
    <loading-box :loading="deleting" />
  </q-item>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUtils } from 'src/common/utils'
import { GraphQLError } from 'graphql/error'
import { RELATED_RECORDS_EXIST } from 'src/errors/messages'
import HighlightText from 'components/HighlightText.vue'
import ConfirmPopup from 'src/components/ConfirmPopup.vue'
import LoadingBox from 'src/components/LoadingBox.vue'

const emit = defineEmits<{
  (e: 'edit'): Promise<void>
}>()

const props = withDefaults(defineProps<{
  label: string
  caption?: string
  query?: string
  onDelete?: () => Promise<void>
  onUpdate?: () => Promise<void>
  resourceName?: string
  confirmButton?: string
  confirmTitle?: string
  confirmMessage?: string
}>(), {
  resourceName: 'item',
  confirmButton: 'Delete',
  confirmTitle: 'Delete',
  confirmMessage: 'Are you sure you want to delete this item?',
})

const { notify } = useUtils()

const deleting = ref(false)

async function confirmDelete() {
  deleting.value = true
  try {
    await props.onDelete?.()
  } catch (error) {
    if (error instanceof GraphQLError && error.message === RELATED_RECORDS_EXIST) {
      notify(`Cannot delete this ${props.resourceName} because it is related to other records`,  'negative')
    } else {
      notify(`Failed to delete the ${props.resourceName}`,  'negative')
    }
  } finally {
    deleting.value = false
  }
}
</script>
