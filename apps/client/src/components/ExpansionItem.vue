<template>
  <q-expansion-item
    v-model="expanded"
    expand-icon="sym_o_keyboard_arrow_right"
    expand-icon-class="rounded-borders expander"
    header-class="header"
    @update:model-value="$emit('expanded', expanded)"
  >
    <template #header>
      <q-item-section>
        <div class="row items-center line-height-none">
          <div
            class="text-uppercase text-subtitle2 text-weight-bold text-app-5"
          >
            {{ label }}
          </div>
          <div v-if="badge !== undefined || badge !== null" class="q-ml-md">
            <q-badge
              :color="expanded ? 'white' : 'app-1'"
              text-color="app"
              :label="badge"
            />
          </div>
          <slot name="header-append" />
        </div>
      </q-item-section>
    </template>
    <q-separator size="2px" color="app-2" />
    <slot />
  </q-expansion-item>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  label: string
  badge?: number
}>()

const expanded = ref(false)
</script>

<style scoped lang="scss">
.q-expansion-item {
  :deep(.expander.q-item__section--side) {
    padding: 0px;
    background-color: $app-color-1;
    color: $app-color;
    height: 28px;
    width: 28px;
    .q-icon {
      font-size: 28px;
    }
  }
  :deep(.expander .q-expansion-item__toggle-icon--rotated) {
    transform: rotate(90deg);
  }
  :deep(.expander .q-hoverable:hover > .q-focus-helper) {
    background-color: $app-color-5 !important;
  }
}

.q-expansion-item--expanded {
  :deep(.header) {
    background-color: $app-color-1;
  }
}
</style>
