<template>
  <span
    v-html="
      highlight
        ? text.replace(
            new RegExp(highlight, 'gi'),
            (match) => `<span class='${highlightClass}'>${match}</span>`,
          )
        : text
    "
  ></span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    text: string
    highlight?: string
    highlightClass?: string
  }>(),
  {
    highlightClass: 'text-weight-bold',
  },
)
</script>
