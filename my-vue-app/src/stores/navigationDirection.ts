import { defineStore } from 'pinia'
import { ref } from 'vue'

export type NavigationDirection = 'forward' | 'back'

export const useNavigationDirectionStore = defineStore('navigation-direction', () => {
  const direction = ref<NavigationDirection>('forward')
  const preparedDirection = ref<NavigationDirection | null>(null)

  const setDirection = (value: NavigationDirection) => {
    direction.value = value
  }

  const prepareDirectionOnce = (value: NavigationDirection) => {
    preparedDirection.value = value
  }

  const consumePreparedDirection = () => {
    const next = preparedDirection.value
    preparedDirection.value = null
    return next
  }

  return {
    direction,
    setDirection,
    prepareDirectionOnce,
    consumePreparedDirection,
  }
})
