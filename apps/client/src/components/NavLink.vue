<template>
  <q-item
    clickable
    class="nav-link"
    :class="{ mini }"
    :active-class="activeClass"
    :exact-active-class="exactActiveClass"
    :to="to"
  >
    <q-item-section v-if="icon" class="nav-link-avatar" avatar>
      <q-avatar>
        <q-icon :name="icon" />
      </q-avatar>
    </q-item-section>

    <q-item-section v-if="!mini">
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption v-if="caption">{{ caption }}</q-item-label>
    </q-item-section>
    <q-item-section v-if="!mini" side class="nav-link-side">
      <q-badge
        v-if="count"
        :label="count.toLocaleString()"
        color="app-5"
        text-color="white"
      />
    </q-item-section>
    <q-tooltip v-if="mini">
      {{ title }}
    </q-tooltip>
  </q-item>
</template>

<script setup lang="ts">
import { RouteLocationRaw } from 'vue-router'

defineOptions({
  name: 'NavLink',
})

export type NavLinkProps = {
  title: string
  caption?: string
  to?: RouteLocationRaw
  icon?: string
  count?: number
  mini?: boolean
  activeClass?: string
  exactActiveClass?: string
}

withDefaults(defineProps<NavLinkProps>(), {
  caption: '',
  icon: '',
  mini: false,
})
</script>

<style scoped lang="scss">
.nav-link {
  color: white;
  margin-left: 8px;
  border-radius: 8px;
  padding: 0 8px 0 0 !important;
  font-size: 11px;

  .nav-link-avatar {
    height: 34px;
    width: 34px;
    min-width: 48px;
    padding-right: 8px;
  }

  .nav-link-side {
    padding-left: 8px;
  }

  &.mini {
    width: 40px;
  }
}
</style>
