<template>
  <template v-if="loading">
    <div @click.stop.prevent class="loading row items-center justify-center" />
    <div
      @click.stop.prevent
      class="loading-spinner row items-center justify-center"
    >
      <q-spinner-tail :color="color" :size="size" :thickness="5" />
    </div>
  </template>
</template>

<script setup lang="ts">
import { NamedColor } from 'quasar'

withDefaults(
  defineProps<{
    loading?: boolean
    size?: string | number | undefined
    color?: NamedColor
  }>(),
  {
    loading: false,
    size: '2rem',
    color: 'app',
  },
)
</script>

<style scoped lang="scss">
.loading,
.loading-spinner {
  cursor: progress;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.loading {
  background-color: $app-color-2;
  opacity: 0.7;
}
</style>
