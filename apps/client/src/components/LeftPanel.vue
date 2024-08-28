<template>
  <div class="column left-panel border-r">
    <div :class="headerClass" class="border-b">
      <div class="row items-center q-gutter-md q-px-sm q-pt-md">
        <q-icon
          v-if="hideDrawerToggle === false"
          @click="$emit('drawer-toggle')"
          name="sym_o_sort"
          color="app-7"
          size="24px"
          class="cursor-pointer"
        />
        <span class="col text-weight-bold text-subtitle1 text-app-7"
          >{{ title }}</span
        >
        <slot name="header-append" />
      </div>
      <q-input class="q-mx-xs q-mt-xs rounded-borders" clearable borderless v-model="model" type="text" placeholder="Type to search..." dense>
        <template #prepend>
          <q-icon name="sym_o_search" class="q-ml-sm" />
        </template>
      </q-input>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">

defineEmits<{
  (e: 'drawer-toggle'): void
}>()

const model = defineModel<string>('model')

defineProps<{
  title: string
  hideDrawerToggle?: boolean
  headerClass?: string
}>()
</script>

<style scoped lang="scss">
.left-panel {
  min-width: 270px;
  width: 270px;
}
:deep(.q-field__control), :deep(.q-field__marginal) {
  height: 30px !important;
}
:deep(.q-field__control) {
  // padding: 0 8px;
}
</style>
