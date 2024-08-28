<template>
  <left-panel title="Settings" @drawer-toggle="$emit('drawer-toggle')">
    <q-list separator>
      <q-item :to="link.to" clickable v-for="link in links" :key="link.title">
        <q-item-section top avatar>
          <q-icon :name="link.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ link.title }}</q-item-label>
          <q-item-label v-if="link.caption" caption>{{ link.caption }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <q-separator />
  </left-panel>
</template>

<script setup lang="ts">
import LeftPanel from 'src/components/LeftPanel.vue'

defineEmits<{
  (e: 'drawer-toggle'): void
}>()

const links = [
  {
    icon: 'sym_o_group',
    title: 'Users',
    caption: 'Manage users and assign roles',
    to: { name: 'settings-users' },
  },
  {
    icon: 'sym_o_barcode',
    title: 'Assets',
    caption: 'Add/remove assets',
    to: { name: 'settings-assets' },
  },
  {
    icon: 'sym_o_network_node',
    title: 'Entities',
    caption: 'Manage branches and departments',
    to: { name: 'settings-entities' },
  },
]
</script>
