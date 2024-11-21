<template>
  <form @submit.prevent="submit" @keydown.esc="maybeClose">
    <header>
      <h1>编辑播放列表</h1>
    </header>

    <main>
      <FormRow :cols="2">
        <FormRow>
          <template #label>名称</template>
          <TextInput
            v-model="name"
            v-koel-focus
            name="name"
            placeholder="Playlist name"
            required
            title="Playlist name"
          />
        </FormRow>
        <FormRow>
          <template #label>文件夹</template>
          <SelectBox v-model="folderId">
            <option :value="null" />
            <option v-for="folder in folders" :key="folder.id" :value="folder.id">{{ folder.name }}</option>
          </SelectBox>
        </FormRow>
      </FormRow>
    </main>

    <footer>
      <Btn type="submit">保存</Btn>
      <Btn white @click.prevent="maybeClose">取消</Btn>
    </footer>
  </form>
</template>

<script lang="ts" setup>
import { ref, toRef } from 'vue'
import { playlistFolderStore } from '@/stores/playlistFolderStore'
import { playlistStore } from '@/stores/playlistStore'
import { useDialogBox } from '@/composables/useDialogBox'
import { useErrorHandler } from '@/composables/useErrorHandler'
import { useMessageToaster } from '@/composables/useMessageToaster'
import { useOverlay } from '@/composables/useOverlay'
import { useModal } from '@/composables/useModal'

import Btn from '@/components/ui/form/Btn.vue'
import TextInput from '@/components/ui/form/TextInput.vue'
import FormRow from '@/components/ui/form/FormRow.vue'
import SelectBox from '@/components/ui/form/SelectBox.vue'

const emit = defineEmits<{ (e: 'close'): void }>()

const { showOverlay, hideOverlay } = useOverlay()
const { toastSuccess } = useMessageToaster()
const { showConfirmDialog } = useDialogBox()
const playlist = useModal().getFromContext<Playlist>('playlist')

const name = ref(playlist.name)
const folderId = ref(playlist.folder_id)
const folders = toRef(playlistFolderStore.state, 'folders')

const close = () => emit('close')

const submit = async () => {
  showOverlay()

  try {
    await playlistStore.update(playlist, {
      name: name.value,
      folder_id: folderId.value,
    })

    toastSuccess('Playlist updated.')
    close()
  } catch (error: unknown) {
    useErrorHandler('dialog').handleHttpError(error)
  } finally {
    hideOverlay()
  }
}

const isPristine = () => playlist.name === name.value && playlist.folder_id === folderId.value

const maybeClose = async () => {
  if (isPristine()) {
    close()
    return
  }

  await showConfirmDialog('放弃所有更改？') && close()
}
</script>

<style lang="postcss" scoped>
form {
  min-width: 100%;
}

label.folder {
  flex: 0.6;
}
</style>
