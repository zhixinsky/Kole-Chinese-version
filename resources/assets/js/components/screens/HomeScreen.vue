<template>
  <ScreenBase id="homeWrapper">
    <template #header>
      <ScreenHeader layout="collapsed">{{ greeting }}</ScreenHeader>
    </template>

    <ScreenEmptyState v-if="libraryEmpty">
      <template #icon>
        <Icon :icon="faVolumeOff" />
      </template>
      未找到歌曲，
      <span class="secondary block">
        {{ isAdmin ? '你设置好音乐库了吗？' : '请联系管理员来设置你的音乐库。' }}
      </span>
    </ScreenEmptyState>

    <div v-else class="space-y-12">
      <div class="grid grid-cols-1 md:grid-cols-2 w-full gap-8 md:gap-4">
        <MostPlayedSongs :loading="loading" data-testid="most-played-songs" />
        <RecentlyPlayedSongs :loading="loading" data-testid="recently-played-songs" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 w-full gap-8 md:gap-4">
        <RecentlyAddedAlbums :loading="loading" data-testid="recently-added-albums" />
        <RecentlyAddedSongs :loading="loading" data-testid="recently-added-songs" />
      </div>

      <MostPlayedArtists :loading="loading" data-testid="most-played-artists" />
      <MostPlayedAlbums :loading="loading" data-testid="most-played-albums" />

      <BtnScrollToTop />
    </div>
  </ScreenBase>
</template>

<script lang="ts" setup>
import { faVolumeOff } from '@fortawesome/free-solid-svg-icons'
import { sample } from 'lodash'
import { computed, ref } from 'vue'
import { eventBus } from '@/utils/eventBus'
import { commonStore } from '@/stores/commonStore'
import { overviewStore } from '@/stores/overviewStore'
import { userStore } from '@/stores/userStore'
import { useRouter } from '@/composables/useRouter'
import { useAuthorization } from '@/composables/useAuthorization'
import { useErrorHandler } from '@/composables/useErrorHandler'

import MostPlayedSongs from '@/components/screens/home/MostPlayedSongs.vue'
import RecentlyPlayedSongs from '@/components/screens/home/RecentlyPlayedSongs.vue'
import RecentlyAddedAlbums from '@/components/screens/home/RecentlyAddedAlbums.vue'
import RecentlyAddedSongs from '@/components/screens/home/RecentlyAddedSongs.vue'
import MostPlayedArtists from '@/components/screens/home/MostPlayedArtists.vue'
import MostPlayedAlbums from '@/components/screens/home/MostPlayedAlbums.vue'
import ScreenHeader from '@/components/ui/ScreenHeader.vue'
import ScreenEmptyState from '@/components/ui/ScreenEmptyState.vue'
import BtnScrollToTop from '@/components/ui/BtnScrollToTop.vue'
import ScreenBase from '@/components/screens/ScreenBase.vue'

const { isAdmin } = useAuthorization()

const greetings = [
  '音乐是灵魂的语言，欢迎进入。',
  '在音符中发现你自己的世界。',
  '每一首歌，都是心灵的共鸣。',
  '让旋律带你穿越时空的边界。',
  '音乐，是心灵最美的旅行。',
  '每一首歌，都是一个故事。',
  '音乐，是记忆与梦想的桥梁。',
  '每一个音符，都在诉说无声的诗篇。',
  '音符流转，心灵与世界共鸣。',
]

const greeting = computed(() => userStore.current ? sample(greetings)!.replace('%s', userStore.current.name) : '')
const libraryEmpty = computed(() => commonStore.state.song_length === 0)

const loading = ref(false)
let initialized = false

eventBus.on('SONGS_DELETED', () => overviewStore.fetch())
  .on('SONGS_UPDATED', () => overviewStore.fetch())
  .on('SONG_UPLOADED', () => overviewStore.fetch())

useRouter().onScreenActivated('Home', async () => {
  if (!initialized) {
    loading.value = true
    try {
      await overviewStore.fetch()
      initialized = true
    } catch (error: unknown) {
      useErrorHandler('dialog').handleHttpError(error)
    } finally {
      loading.value = false
    }
  }
})
</script>
