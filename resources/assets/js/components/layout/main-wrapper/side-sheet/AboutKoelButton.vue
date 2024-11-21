<!--
<template>
  <a
    href="https://emby.dokor.cn"
    :title="shouldNotifyNewVersion ? 'New version available!' : '电影'"

    class="relative inline-flex items-center"
    v-koel-tooltip.left
    target="_blank"
    rel="noopener noreferrer"
  >
    <Icon :icon="faVideo" />

    <span
      v-if="shouldNotifyNewVersion"
      class="absolute w-[10px] aspect-square right-px top-px rounded-full bg-k-highlight"
      data-testid="new-version-indicator"
    />
  </a>
</template>
-->

<template>
  <a
    v-koel-tooltip.left
    title="电影"
    href="https://emby.dokor.cn"
    class="relative flex items-center justify-center h-[42px] aspect-square rounded-full bg-none md:bg-black/30 text-xl opacity-70 transition-opacity duration-200 ease-in-out text-current cursor-pointer hover:active-state active:scale-90"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Icon :icon="faVideo" />

  </a>
</template>

<script lang="ts" setup>
import { faVideo } from '@fortawesome/free-solid-svg-icons'
import { eventBus } from '@/utils/eventBus'
import { useNewVersionNotification } from '@/composables/useNewVersionNotification'

const { shouldNotifyNewVersion } = useNewVersionNotification()

const openAboutKoelModal = () => eventBus.emit('MODAL_SHOW_ABOUT_KOEL')
</script>
