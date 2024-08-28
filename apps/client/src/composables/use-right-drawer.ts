import { ref } from 'vue'

const rightDrawerOpen = ref(false)
const rightMiniState = ref(false)

export function useRightDrawer() {
  function toggleRightDrawer() {
    rightDrawerOpen.value = !rightDrawerOpen.value
  }

  return {
    rightDrawerOpen,
    rightMiniState,
    toggleRightDrawer,
  }
}
