<template>
  <div
    @click.stop.prevent
    class="row no-wrap"
    :class="{ 'cursor-pointer': clickable }"
    :style="`margin-left: ${sizePx - offset}px;`"
  >
    <div
      v-for="i in Math.min(options.length, max)"
      :key="i"
      :style="overlapStyle"
      class="overlapping"
    >
      <q-avatar :size="`${sizePx}px`" color="app-5" text-color="white">
        <q-icon v-if="options[i - 1]?.icon" :name="options[i - 1].icon" />
        <img
          v-else-if="options[i - 1]?.src"
          :src="options[i - 1].src ?? undefined"
          :alt="(options[i - 1].char ?? options[i - 1].title[0]).toUpperCase()"
        />
        <span v-else>{{
          (options[i - 1].char ?? options[i - 1].title[0]).toUpperCase()
        }}</span>
        <q-tooltip v-if="!tooltip"><strong>Assigned to:</strong> {{ options[i - 1].title }} {{ '<' + options[i - 1].subtitle + '>' }}</q-tooltip>
      </q-avatar>
    </div>
    <div v-if="options.length > max" :style="overlapStyle" class="overlapping">
      <q-avatar :size="`${sizePx}px`" color="app-5" text-color="white">
        +{{ options.length - max }}
      </q-avatar>
    </div>
    <q-menu v-if="clickable">
      <q-list separator>
        <q-item>
          <q-item-section class="text-body1 text-app text-weight-bold">Assigned To</q-item-section>
        </q-item>
        <q-item v-for="(option, i) in options" :key="i" class="q-py-xs">
          <q-item-section side>
            <q-avatar color="app-5" text-color="white" size="sm">
              <q-icon v-if="option.icon" :name="option.icon" />
              <img v-else-if="option.src" :src="option.src" />
              <span v-else>{{
                (option.char ?? option.title[0]).toUpperCase()
              }}</span>
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ option.title }}</q-item-label>
            <q-item-label caption v-if="option.subtitle">{{
              option.subtitle
            }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
    <q-tooltip v-if="tooltip" :anchor="tooltipAnchor">{{ tooltip }}</q-tooltip>
  </div>
</template>

<script setup lang="ts">
import { QTooltipProps } from 'quasar'
import { computed } from 'vue'

export type OverlapAvatarProps = {
  max?: number
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  offset?: number
  clickable?: boolean
  tooltip?: string
  tooltipAnchor?: QTooltipProps['anchor']
  options: Array<{
    title: string
    subtitle?: string
    icon?: string
    char?: string
    src?: string | null
  }>
}

const props = withDefaults(defineProps<OverlapAvatarProps>(), {
  max: 5,
  offset: 15,
  clickable: true,
})

const sizePx = computed(() => {
  if (props.size === 'xs') return 18
  if (props.size === 'sm') return 24
  if (props.size === 'md') return 32
  if (props.size === 'lg') return 38
  if (props.size === 'xl') return 46
  if (!props.size) return 48
  return props.size
})

const overlapStyle = {
  borderWidth: sizePx.value < 25 ? '1px' : '2px',
  marginLeft: `-${sizePx.value - props.offset}px`,
}
</script>

<style lang="scss">
.overlapping {
  display: flex;
  border: 2px solid white;
  border-radius: 50%;
  overflow: hidden;
  z-index: 0;
  .q-avatar__content,
  &.q-avatar img:not(.q-icon):not(.q-img__image) {
    border-radius: unset;
  }
}
</style>
