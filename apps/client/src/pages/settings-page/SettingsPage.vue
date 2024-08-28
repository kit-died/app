<template>
  <q-page
    class="bg-white shadow-6 row no-wrap items-stretch justify-start overflow-hidden"
    style="border-radius: 20px 0 0 0; margin-left: 14px"
  >
    <settings-panel @drawer-toggle="$emit('drawer-toggle')" />
    <div class="col bg-grey-2">
      <router-view />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import SettingsPanel from './SettingsPanel.vue'
defineOptions({
  name: 'SettingsPage',
})

defineEmits<{
  (e: 'drawer-toggle'): void
}>()
</script>
