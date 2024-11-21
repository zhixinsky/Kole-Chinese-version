<template>
  <ScreenBase>
    <template #header>
      <ScreenHeader>设置</ScreenHeader>
    </template>

    <p v-if="storageDriver !== 'local'" class="text-k-text-secondary">
      由于您没有使用云存储，因此无需设置媒体路径。
    </p>

    <form v-else class="space-y-6" @submit.prevent="confirmThenSave">
      <FormRow>
        <template #label>媒体路径</template>

        <template #help>
          <span id="mediaPathHelp">
            包含媒体的服务器目录的绝对路径。
            Koel 将扫描此目录中的歌曲并提取任何可用信息。<br>
            扫描可能需要一段时间，尤其是当您有很多歌曲时，所以请耐心等待。
          </span>
        </template>

        <TextInput
          v-model="mediaPath"
          aria-describedby="mediaPathHelp"
          class="w-full md:!w-2/3"
          name="media_path"
          placeholder="您的媒体路径"
        />
      </FormRow>

      <FormRow>
        <div>
          <Btn data-testid="submit" type="submit">扫描</Btn>
        </div>
      </FormRow>
    </form>
  </ScreenBase>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { commonStore } from '@/stores/commonStore'
import { settingStore } from '@/stores/settingStore'
import { useRouter } from '@/composables/useRouter'
import { useDialogBox } from '@/composables/useDialogBox'
import { useMessageToaster } from '@/composables/useMessageToaster'
import { useOverlay } from '@/composables/useOverlay'
import { useErrorHandler } from '@/composables/useErrorHandler'

import ScreenHeader from '@/components/ui/ScreenHeader.vue'
import Btn from '@/components/ui/form/Btn.vue'
import TextInput from '@/components/ui/form/TextInput.vue'
import ScreenBase from '@/components/screens/ScreenBase.vue'
import FormRow from '@/components/ui/form/FormRow.vue'

const { toastSuccess } = useMessageToaster()
const { showConfirmDialog } = useDialogBox()
const { go, url } = useRouter()
const { showOverlay, hideOverlay } = useOverlay()

const storageDriver = ref(commonStore.state.storage_driver)
const mediaPath = ref(settingStore.state.media_path)
const originalMediaPath = mediaPath.value

const shouldWarn = computed(() => {
  // Warn the user if the media path is not empty and about to change.
  if (!originalMediaPath || !mediaPath.value) {
    return false
  }

  if (storageDriver.value !== 'local') {
    return false
  }

  return originalMediaPath !== mediaPath.value.trim()
})

const save = async () => {
  showOverlay({ message: 'Scanning…' })

  try {
    await settingStore.update({ media_path: mediaPath.value })
    toastSuccess('Settings saved.')
    // Make sure we're back to home first.
    go(url('home'), true)
  } catch (error: unknown) {
    useErrorHandler('dialog').handleHttpError(error)
  } finally {
    hideOverlay()
  }
}

const confirmThenSave = async () => {
  if (shouldWarn.value) {
    await showConfirmDialog('Changing the media path will essentially remove all existing local data – songs, artists, \
          albums, favorites, etc. Sure you want to proceed?', 'Confirm')
          && await save()
  } else {
    await save()
  }
}
</script>
