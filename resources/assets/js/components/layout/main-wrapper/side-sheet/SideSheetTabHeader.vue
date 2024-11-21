<template>
  <SideSheetButton
    id="extraTabLyrics"
    v-koel-tooltip.left
    :class="{ active: value === 'Lyrics' }"
    title="歌词"
    @click.prevent="toggleTab('Lyrics')"
  >
    <Icon :icon="faFeather" fixed-width />
  </SideSheetButton>
  <SideSheetButton
    id="extraTabArtist"
    v-koel-tooltip.left
    :class="{ active: value === 'Artist' }"
    title="艺术家"
    @click.prevent="toggleTab('Artist')"
  >
    <MicVocalIcon size="18" />
  </SideSheetButton>
  <SideSheetButton
    id="extraTabAlbum"
    v-koel-tooltip.left
    :class="{ active: value === 'Album' }"
    title="专辑"
    @click.prevent="toggleTab('Album')"
  >
    <Icon :icon="faCompactDisc" fixed-width />
  </SideSheetButton>
</template>

<script lang="ts" setup>
import { faCompactDisc, faFeather } from '@fortawesome/free-solid-svg-icons'
import { MicVocalIcon } from 'lucide-vue-next'
import { computed } from 'vue'
import { useThirdPartyServices } from '@/composables/useThirdPartyServices'

import SideSheetButton from '@/components/layout/main-wrapper/side-sheet/SideSheetButton.vue'

const props = withDefaults(defineProps<{ modelValue?: ExtraPanelTab | null }>(), {
  modelValue: null,
})

const emit = defineEmits<{ (e: 'update:modelValue', value: ExtraPanelTab | null): void }>()

const { useYouTube } = useThirdPartyServices()

const value = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const toggleTab = (tab: ExtraPanelTab) => (value.value = value.value === tab ? null : tab)
</script>
