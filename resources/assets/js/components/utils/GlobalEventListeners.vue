<template>
  <slot />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRouter } from '@/composables/useRouter'
import { useMessageToaster } from '@/composables/useMessageToaster'
import { useDialogBox } from '@/composables/useDialogBox'
import { eventBus } from '@/utils/eventBus'
import { playlistFolderStore } from '@/stores/playlistFolderStore'
import { playlistStore } from '@/stores/playlistStore'
import { authService } from '@/services/authService'
import { forceReloadWindow } from '@/utils/helpers'

let toastSuccess: ReturnType<typeof useMessageToaster>['toastSuccess']
let showConfirmDialog: ReturnType<typeof useDialogBox>['showConfirmDialog']
let go: ReturnType<typeof useRouter>['go']
let url: ReturnType<typeof useRouter>['url']

onMounted(() => {
  toastSuccess = useMessageToaster().toastSuccess
  showConfirmDialog = useDialogBox().showConfirmDialog
  go = useRouter().go
  url = useRouter().url
})

eventBus.on('PLAYLIST_DELETE', async playlist => {
  if (await showConfirmDialog(`删除"${playlist.name}"播放列表?`)) {
    await playlistStore.delete(playlist)
    toastSuccess(`"${playlist.name}" 播放列表已删除`)
    go(url('home'))
  }
}).on('PLAYLIST_FOLDER_DELETE', async folder => {
  if (await showConfirmDialog(`删除"${folder.name}"文件夹?`)) {
    await playlistFolderStore.delete(folder)
    toastSuccess(`"${folder.name}"文件夹已删除。`)
    go(url('home'))
  }
}).on('LOG_OUT', async () => {
  await authService.logout()
  forceReloadWindow()
})
</script>
