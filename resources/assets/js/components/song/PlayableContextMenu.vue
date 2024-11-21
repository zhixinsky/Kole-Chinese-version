<template>
  <ContextMenu ref="base" data-testid="song-context-menu" extra-class="song-menu">
    <template v-if="onlyOneSongSelected">
      <li @click.stop.prevent="doPlayback">
        <span v-if="firstSongPlaying">暂停</span>
        <span v-else>播放</span>
      </li>
      <template v-if="isSong(playables[0])">
        <li @click="viewAlbum(playables[0])">转到专辑</li>
        <li @click="viewArtist(playables[0])">转到艺术家</li>
      </template>
      <template v-else>
        <li @click="viewPodcast(playables[0] as Episode)">转到播客</li>
        <li @click="viewEpisode(playables[0] as Episode)">查看光碟</li>
      </template>
    </template>
    <li class="has-sub">
      添加到
      <ul class="submenu menu-add-to context-menu">
        <template v-if="queue.length">
          <li v-if="currentSong" @click="queueAfterCurrent">当前歌曲之后</li>
          <li @click="queueToBottom">播放列表底部</li>
          <li @click="queueToTop">播放列表开头</li>
        </template>
        <li v-else @click="queueToBottom">播放队列</li>
        <template v-if="!isFavoritesScreen">
          <li class="separator" />
          <li @click="addToFavorites">喜欢的</li>
        </template>
        <li v-if="normalPlaylists.length" class="separator" />
        <template class="block">
          <ul v-if="normalPlaylists.length" v-koel-overflow-fade class="relative max-h-48 overflow-y-auto">
            <li v-for="p in normalPlaylists" :key="p.id" @click="addToExistingPlaylist(p)">{{ p.name }}</li>
          </ul>
        </template>
        <li class="separator" />
        <li @click="addToNewPlaylist">创建播放列表</li>
      </ul>
    </li>

    <template v-if="isQueueScreen">
      <li class="separator" />
      <li @click="removeFromQueue">从播放队列中移除</li>
      <li class="separator" />
    </template>

    <template v-if="isFavoritesScreen">
      <li class="separator" />
      <li @click="removeFromFavorites">从喜欢中移除</li>
    </template>

    <template v-if="visibilityActions.length">
      <li class="separator" />
      <li v-for="action in visibilityActions" :key="action.label" @click="action.handler">{{ action.label }}</li>
    </template>

    <li v-if="canEditSongs" @click="openEditForm">编辑</li>
    <li v-if="downloadable" @click="download">下载</li>
    <li v-if="onlyOneSongSelected && canBeShared" @click="copyUrl">复制可分享的URL</li>

    <template v-if="canBeRemovedFromPlaylist">
      <li class="separator" />
      <li @click="removePlayablesFromPlaylist">从播放列表中删除</li>
    </template>

    <template v-if="canEditSongs">
      <li class="separator" />
      <li @click="deleteFromFilesystem">从文件系统中删除</li>
    </template>
  </ContextMenu>
</template>

<script lang="ts" setup>
import { computed, ref, toRef } from 'vue'
import { pluralize } from '@/utils/formatters'
import { eventBus } from '@/utils/eventBus'
import { arrayify, copyText } from '@/utils/helpers'
import { getPlayableCollectionContentType, isSong } from '@/utils/typeGuards'
import { commonStore } from '@/stores/commonStore'
import { favoriteStore } from '@/stores/favoriteStore'
import { playlistStore } from '@/stores/playlistStore'
import { queueStore } from '@/stores/queueStore'
import { songStore } from '@/stores/songStore'
import { downloadService } from '@/services/downloadService'
import { playbackService } from '@/services/playbackService'
import { useRouter } from '@/composables/useRouter'
import { useMessageToaster } from '@/composables/useMessageToaster'
import { useDialogBox } from '@/composables/useDialogBox'
import { usePlaylistManagement } from '@/composables/usePlaylistManagement'
import { usePlayableMenuMethods } from '@/composables/usePlayableMenuMethods'
import { usePolicies } from '@/composables/usePolicies'
import { useContextMenu } from '@/composables/useContextMenu'
import { useKoelPlus } from '@/composables/useKoelPlus'

const { toastSuccess, toastError, toastWarning } = useMessageToaster()
const { showConfirmDialog } = useDialogBox()
const { go, getRouteParam, isCurrentScreen, url } = useRouter()
const { base, ContextMenu, open, close, trigger } = useContextMenu()
const { removeFromPlaylist } = usePlaylistManagement()
const { isPlus } = useKoelPlus()

const playables = ref<Playable[]>([])

const {
  queueAfterCurrent,
  queueToBottom,
  queueToTop,
  addToFavorites,
  addToExistingPlaylist,
  addToNewPlaylist,
} = usePlayableMenuMethods(playables, close)

const playlists = toRef(playlistStore.state, 'playlists')

const downloadable = computed(() => {
  if (!commonStore.state.allows_download) {
    return false
  }

  // If multiple playables are selected, make sure zip extension is available on the server
  return playables.value.length === 1 || commonStore.state.supports_batch_downloading
})

const queue = toRef(queueStore.state, 'playables')
const currentSong = toRef(queueStore, 'current')

const { currentUserCan } = usePolicies()

const contentType = computed(() => getPlayableCollectionContentType(playables.value))
const canEditSongs = computed(() => contentType.value === 'songs' && currentUserCan.editSong(playables.value as Song[]))
const onlyOneSongSelected = computed(() => playables.value.length === 1)
const firstSongPlaying = computed(() => playables.value.length ? playables.value[0].playback_state === 'Playing' : false)
const normalPlaylists = computed(() => playlists.value.filter(({ is_smart }) => !is_smart))
const canBeShared = computed(() => !isPlus.value || (isSong(playables.value[0]) && playables.value[0].is_public))

const makePublic = () => trigger(async () => {
  if (contentType.value !== 'songs') {
    throw new Error('Only songs can be marked as public or private')
  }

  await songStore.publicize(playables.value as Song[])
  toastSuccess(`Unmarked ${pluralize(playables.value, 'song')} as private.`)
})

const makePrivate = () => trigger(async () => {
  if (contentType.value !== 'songs') {
    throw new Error('Only songs can be marked as public or private')
  }

  const privatizedIds = await songStore.privatize(playables.value as Song[])

  if (!privatizedIds.length) {
    toastError('Songs cannot be marked as private if they’re part of a collaborative playlist.')
    return
  }

  if (privatizedIds.length < playables.value.length) {
    toastWarning('Some songs cannot be marked as private as they’re part of a collaborative playlist.')
    return
  }

  toastSuccess(`Marked ${pluralize(playables.value, 'song')} as private.`)
})

const visibilityActions = computed(() => {
  if (contentType.value !== 'songs' || !canEditSongs.value) {
    return []
  }

  if (!isPlus.value) {
    return []
  }

  const visibilities = Array.from(new Set((playables.value as Song[]).map(song => song.is_public
    ? 'public'
    : 'private',
  )))

  if (visibilities.length === 2) {
    return [
      {
        label: 'Unmark as Private',
        handler: makePublic,
      },
      {
        label: 'Mark as Private',
        handler: makePrivate,
      },
    ]
  }

  return visibilities[0] === 'public'
    ? [{ label: 'Mark as Private', handler: makePrivate }]
    : [{ label: 'Unmark as Private', handler: makePublic }]
})

const canBeRemovedFromPlaylist = computed(() => {
  if (!isCurrentScreen('Playlist')) {
    return false
  }
  const playlist = playlistStore.byId(getRouteParam('id')!)
  return playlist && !playlist.is_smart
})

const isQueueScreen = computed(() => isCurrentScreen('Queue'))
const isFavoritesScreen = computed(() => isCurrentScreen('Favorites'))

const doPlayback = () => trigger(async () => {
  if (!playables.value.length) {
    return
  }

  switch (playables.value[0].playback_state) {
    case 'Playing':
      playbackService.pause()
      break

    case 'Paused':
      await playbackService.resume()
      break

    default:
      await playbackService.play(playables.value[0])
      break
  }
})

const openEditForm = () => trigger(() =>
  playables.value.length
  && contentType.value === 'songs'
  && eventBus.emit('MODAL_SHOW_EDIT_SONG_FORM', playables.value as Song[]),
)

const viewAlbum = (song: Song) => trigger(() => go(url('albums.show', { id: song.album_id })))
const viewArtist = (song: Song) => trigger(() => go(url('artists.show', { id: song.artist_id })))
const viewPodcast = (episode: Episode) => trigger(() => go(url('podcasts.show', { id: episode.podcast_id })))
const viewEpisode = (episode: Episode) => trigger(() => go(url('episodes.show', { id: episode.id })))
const download = () => trigger(() => downloadService.fromPlayables(playables.value))

const removePlayablesFromPlaylist = () => trigger(async () => {
  const playlist = playlistStore.byId(getRouteParam('id')!)
  if (!playlist) {
    return
  }

  await removeFromPlaylist(playlist, playables.value)
})

const removeFromQueue = () => trigger(() => queueStore.unqueue(playables.value))
const removeFromFavorites = () => trigger(() => favoriteStore.unlike(playables.value))

const copyUrl = () => trigger(async () => {
  await copyText(songStore.getShareableUrl(playables.value[0]))
  toastSuccess('URL copied to clipboard.')
})

const deleteFromFilesystem = () => trigger(async () => {
  if (await showConfirmDialog('Delete selected song(s) from the filesystem? This action is NOT reversible!')) {
    await songStore.deleteFromFilesystem(playables.value as Song[])
    toastSuccess(`删除 ${pluralize(playables.value, 'song')} 从文件系统。`)
    eventBus.emit('SONGS_DELETED', playables.value as Song[])
  }
})

eventBus.on('PLAYABLE_CONTEXT_MENU_REQUESTED', async ({ pageX, pageY }, _songs) => {
  playables.value = arrayify(_songs)
  await open(pageY, pageX)
})
</script>
