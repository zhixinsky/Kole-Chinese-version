<template>
  <form class="md:w-[420px] min-w-full" @submit.prevent="submit" @keydown.esc="maybeClose">
    <header>
      <h1>新建播放列表文件夹</h1>
    </header>

    <main>
      <FormRow>
        <TextInput
          v-model="name"
          v-koel-focus
          name="name"
          placeholder="文件夹名称"
          required
        />
      </FormRow>
    </main>

    <footer>
      <Btn type="submit">保存</Btn>
      <Btn white @click.prevent="maybeClose">取消</Btn>
    </footer>
  </form>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { playlistFolderStore } from '@/stores/playlistFolderStore'
import { useDialogBox } from '@/composables/useDialogBox'
import { useErrorHandler } from '@/composables/useErrorHandler'
import { useMessageToaster } from '@/composables/useMessageToaster'
import { useOverlay } from '@/composables/useOverlay'

import Btn from '@/components/ui/form/Btn.vue'
import TextInput from '@/components/ui/form/TextInput.vue'
import FormRow from '@/components/ui/form/FormRow.vue'

const emit = defineEmits<{ (e: 'close'): void }>()

const { showOverlay, hideOverlay } = useOverlay()
const { toastSuccess } = useMessageToaster()
const { showConfirmDialog } = useDialogBox()

const name = ref('')

const close = () => emit('close')

const submit = async () => {
  showOverlay()

  try {
    const folder = await playlistFolderStore.store(name.value)
    close()
    toastSuccess(`"${folder.name}" 文件夹创建成功。`)
  } catch (error: unknown) {
    useErrorHandler('dialog').handleHttpError(error)
  } finally {
    hideOverlay()
  }
}

const maybeClose = async () => {
  if (name.value.trim() === '') {
    close()
    return
  }

  await showConfirmDialog('放弃所有更改？') && close()
}
</script>
