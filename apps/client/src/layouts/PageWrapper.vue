<template>
  <div class="column">
    <div class="row items-center header-height text-app-8 bg-white border-b">
       <q-item class="col">
        <q-item-section avatar class="avatar-near">
          <q-icon color="app-8" :name="icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-h6">{{ title }}</q-item-label>
          <q-item-label v-if="subtitle" caption lines="1">{{ subtitle }}</q-item-label>
        </q-item-section>
       </q-item>
        <q-input class="col-6 q-ml-md q-mr-sm" clearable v-model="query" type="text" placeholder="Type to search..." standout="bg-app-5 text-white" dense>
          <template #prepend>
            <q-icon name="sym_o_search" />
          </template>
        </q-input>
       <slot name="header-append" />
    </div>
    <div class="content scroll-y">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">

const query = defineModel<string>('query')

defineProps<{
  icon: string
  title: string
  subtitle?: string
}>()
</script>

<style lang="scss" scoped>
.header-height {
  height: 61px;
}
.content {
  height: calc(100vh - 113px);
}
</style>
