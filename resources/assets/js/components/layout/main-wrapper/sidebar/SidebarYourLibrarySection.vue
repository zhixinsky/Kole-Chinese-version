<template>
  <SidebarSection>
    <template #header>
      <a href="/#/home" style="color: inherit; text-decoration: none;">
        <SidebarSectionHeader>首页</SidebarSectionHeader>
      </a>
    </template>

    <ul class="menu">
      <SidebarItem :href="url('songs.index')" screen="Songs">
        <template #icon>
          <Icon :icon="faMusic" fixed-width />
        </template>
        全部歌曲
      </SidebarItem>
      <SidebarItem :href="url('albums.index')" screen="Albums">
        <template #icon>
          <Icon :icon="faCompactDisc" fixed-width />
        </template>
        专辑
      </SidebarItem>
      <SidebarItem :href="url('artists.index')" screen="Artists">
        <template #icon>
          <MicVocalIcon size="16" />
        </template>
        艺术家
      </SidebarItem>
      <!--
        <SidebarItem :href="url('genres.index')" screen="Genres">
        <template #icon>
          <GuitarIcon size="16" />
        </template>
        流派
      </SidebarItem>

      <YouTubeSidebarItem v-if="youtubeVideoTitle" data-testid="youtube">
        {{ youtubeVideoTitle }}
      </YouTubeSidebarItem>
      <SidebarItem :href="url('podcasts.index')" screen="Podcasts">
        <template #icon>
          <Icon :icon="faPodcast" fixed-width />
        </template>
        播客
      </SidebarItem>
      -->
    </ul>
  </SidebarSection>
</template>

<script lang="ts" setup>
import { faCompactDisc, faMusic } from '@fortawesome/free-solid-svg-icons'
import { MicVocalIcon } from 'lucide-vue-next'
import { unescape } from 'lodash'
import { ref } from 'vue'
import { eventBus } from '@/utils/eventBus'
import { useRouter } from '@/composables/useRouter'

import SidebarSection from '@/components/layout/main-wrapper/sidebar/SidebarSection.vue'
import SidebarSectionHeader from '@/components/layout/main-wrapper/sidebar/SidebarSectionHeader.vue'
import SidebarItem from '@/components/layout/main-wrapper/sidebar/SidebarItem.vue'

const youtubeVideoTitle = ref<string | null>(null)
const { url } = useRouter()

eventBus.on('PLAY_YOUTUBE_VIDEO', payload => (youtubeVideoTitle.value = unescape(payload.title)))
</script>
