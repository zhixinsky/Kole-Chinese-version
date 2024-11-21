<template>
  <ContextMenu ref="base" data-testid="album-context-menu" extra-class="album-menu">
    <template v-if="album">
      <li @click="play">播放全部</li>
      <li @click="shuffle">随机全部</li>
      <li class="separator" />
      <li v-if="isStandardAlbum" @click="viewAlbumDetails">转到专辑</li>
      <li v-if="isStandardArtist" @click="viewArtistDetails">转到艺术家</li>
      <template v-if="isStandardAlbum && allowDownload">
        <li class="separator" />
        <li @click="download">下载</li>
      </template>
    </template>
  </ContextMenu>
</template>

<script lang="ts" setup>
import { computed, ref, toRef } from 'vue'
import { albumStore } from '@/stores/albumStore'
import { artistStore } from '@/stores/artistStore'
import { commonStore } from '@/stores/commonStore'
import { songStore } from '@/stores/songStore'
import { downloadService } from '@/services/downloadService'
import { playbackService } from '@/services/playbackService'
import { useContextMenu } from '@/composables/useContextMenu'
import { useRouter } from '@/composables/useRouter'
import { eventBus } from '@/utils/eventBus'

const { go, url } = useRouter()
const { base, ContextMenu, open, trigger } = useContextMenu()

const album = ref<Album>()
const allowDownload = toRef(commonStore.state, 'allows_download')

const isStandardAlbum = computed(() => !albumStore.isUnknown(album.value!))

const isStandardArtist = computed(() => {
  return !artistStore.isUnknown(album.value!.artist_id) && !artistStore.isVarious(album.value!.artist_id)
})

const play = () => trigger(async () => {
  playbackService.queueAndPlay(await songStore.fetchForAlbum(album.value!))
  go(url('queue'))
})

const shuffle = () => trigger(async () => {
  playbackService.queueAndPlay(await songStore.fetchForAlbum(album.value!), true)
  go(url('queue'))
})

const viewAlbumDetails = () => trigger(() => go(url('albums.show', { id: album.value!.id })))
const viewArtistDetails = () => trigger(() => go(url('artists.show', { id: album.value!.artist_id })))
const download = () => trigger(() => downloadService.fromAlbum(album.value!))

eventBus.on('ALBUM_CONTEXT_MENU_REQUESTED', async ({ pageX, pageY }, _album) => {
  album.value = _album
  await open(pageY, pageX)
})
</script>
