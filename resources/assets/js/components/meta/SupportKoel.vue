<template>
  <div
    v-if="shown"
    class="bg-k-bg-primary text-[0.9rem] px-6 py-4 flex text-k-text-secondary z-10 space-x-3"
    data-testid="support-bar"
  >
    <p class="flex-1">
      喜欢Koel汉化版么？有任何建议可发送邮件至
      <a href="https://github.com/users/phanan/sponsorship" rel="noopener" target="_blank">sinoserve@gmail.com</a>
    </p>
    <button type="button" @click.prevent="close">隐藏</button>
    <span class="block after:content-['•'] after:block" />
    <button type="button" @click.prevent="stopBugging">
      不再出现
    </button>
  </div>
</template>

<script lang="ts" setup>
import isMobile from 'ismobilejs'
import { ref, watch } from 'vue'
import { preferenceStore } from '@/stores/preferenceStore'
import { useKoelPlus } from '@/composables/useKoelPlus'

const delayUntilShow = 30 * 60 * 1000 // 30 minutes

const shown = ref(false)

const { isPlus } = useKoelPlus()
const setUpShowBarTimeout = () => setTimeout(() => (shown.value = true), delayUntilShow)
const close = () => shown.value = false

const stopBugging = () => {
  preferenceStore.set('support_bar_no_bugging', true)
  close()
}

watch(preferenceStore.initialized, initialized => {
  if (!initialized) {
    return
  }
  if (preferenceStore.state.support_bar_no_bugging || isMobile.any) {
    return
  }
  if (isPlus.value) {
    return
  }

  setUpShowBarTimeout()
}, { immediate: true })
</script>

<style lang="postcss" scoped>
a {
  @apply text-k-text-primary hover:text-k-accent;
}

button {
  @apply text-k-text-primary text-[0.9rem] hover:text-k-accent;
}
</style>
