<template>
  <FormBase>
    <form @submit.prevent="submit" @keydown.esc="maybeClose">
      <header>
        <h1>新建智能播放列表</h1>
      </header>

      <main class="space-y-5">
        <FormRow :cols="2">
          <FormRow>
            <template #label>名称</template>
            <TextInput v-model="name" v-koel-focus name="name" placeholder="播放列表名称" required />
          </FormRow>
          <FormRow>
            <template #label>文件夹</template>
            <SelectBox v-model="folderId">
              <option :value="null" />
              <option v-for="folder in folders" :key="folder.id" :value="folder.id">{{ folder.name }}</option>
            </SelectBox>
          </FormRow>
        </FormRow>

        <div v-koel-overflow-fade class="group-container space-y-5 overflow-auto max-h-[480px]">
          <RuleGroup
            v-for="(group, index) in collectedRuleGroups"
            :key="group.id"
            :group="group"
            :is-first-group="index === 0"
            @input="onGroupChanged"
          />
          <Btn class="btn-add-group" small success title="添加新组" uppercase @click.prevent="addGroup">
            <Icon :icon="faPlus" />
            组合
          </Btn>
        </div>

        <div v-if="isPlus" class="form-row">
          <label class="text-k-text-secondary">
            <CheckBox v-model="ownSongsOnly" />
            仅包含我自己库中的歌曲。
          </label>
        </div>
      </main>

      <footer>
        <Btn type="submit">保存</Btn>
        <Btn class="btn-cancel" white @click.prevent="maybeClose">取消</Btn>
      </footer>
    </form>
  </FormBase>
</template>

<script lang="ts" setup>
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { ref, toRef } from 'vue'
import { playlistFolderStore } from '@/stores/playlistFolderStore'
import { playlistStore } from '@/stores/playlistStore'
import { useDialogBox } from '@/composables/useDialogBox'
import { useErrorHandler } from '@/composables/useErrorHandler'
import { useMessageToaster } from '@/composables/useMessageToaster'
import { useModal } from '@/composables/useModal'
import { useOverlay } from '@/composables/useOverlay'
import { useSmartPlaylistForm } from '@/composables/useSmartPlaylistForm'
import { useRouter } from '@/composables/useRouter'
import { useKoelPlus } from '@/composables/useKoelPlus'

import CheckBox from '@/components/ui/form/CheckBox.vue'
import TextInput from '@/components/ui/form/TextInput.vue'
import FormRow from '@/components/ui/form/FormRow.vue'
import SelectBox from '@/components/ui/form/SelectBox.vue'

const emit = defineEmits<{ (e: 'close'): void }>()

const {
  Btn,
  FormBase,
  RuleGroup,
  collectedRuleGroups,
  addGroup,
  onGroupChanged,
} = useSmartPlaylistForm()

const { showOverlay, hideOverlay } = useOverlay()
const { toastSuccess } = useMessageToaster()
const { showConfirmDialog } = useDialogBox()
const { go, url } = useRouter()
const { isPlus } = useKoelPlus()

const targetFolder = useModal().getFromContext<PlaylistFolder | null>('folder')

const name = ref('')
const folderId = ref(targetFolder?.id)
const folders = toRef(playlistFolderStore.state, 'folders')
const ownSongsOnly = ref(false)

const close = () => emit('close')

const isPristine = () => name.value === ''
  && folderId.value === targetFolder?.id
  && collectedRuleGroups.value.length === 0

const maybeClose = async () => {
  if (isPristine()) {
    close()
    return
  }

  await showConfirmDialog('放弃所有更改？') && close()
}

const submit = async () => {
  showOverlay()

  try {
    const playlist = await playlistStore.store(name.value, {
      rules: collectedRuleGroups.value,
      folder_id: folderId.value,
      own_songs_only: ownSongsOnly.value,
    })

    close()
    toastSuccess(`Playlist "${playlist.name}" created.`)
    go(url('playlists.show', { id: playlist.id }))
  } catch (error: unknown) {
    useErrorHandler('dialog').handleHttpError(error)
  } finally {
    hideOverlay()
  }
}
</script>

<style lang="postcss" scoped>
.group-container {
  scrollbar-gutter: stable;
}
</style>
