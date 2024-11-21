<template>
  <div class="space-y-3">
    <FormRow v-if="isPlus">
      <div>
        <CheckBox v-model="preferences.make_uploads_public" name="make_upload_public" />
        默认将上传的歌曲公开
      </div>
    </FormRow>
    <FormRow>
      <div>
        <CheckBox v-model="preferences.continuous_playback" name="continuous_playback" />
        播放歌曲或节目会触发整个播放列表、专辑、艺术家、流派或播客的连续播放。
      </div>
    </FormRow>
    <FormRow v-if="onMobile">
      <div>
        <CheckBox v-model="preferences.show_now_playing_notification" name="notify" />
        显示“正在播放”通知
      </div>
    </FormRow>
    <FormRow v-if="!onMobile">
      <div>
        <CheckBox v-model="preferences.confirm_before_closing" name="confirm_closing" />
        关闭 Koel 前确认
      </div>
    </FormRow>
    <FormRow v-if="showTranscodingOption">
      <div>
        <CheckBox
          v-model="preferences.transcode_on_mobile"
          data-testid="transcode_on_mobile"
          name="transcode_on_mobile"
        />
        在指定位置转换并播放媒体
        <select
          v-model="preferences.transcode_quality"
          :disabled="!preferences.transcode_on_mobile"
          class="appearance-auto rounded"
        >
          <option v-for="quality in [64, 96, 128, 192, 256, 320]" :key="quality" :value="quality">{{ quality }}</option>
        </select>
        移动设备上 kbps
      </div>
    </FormRow>
    <FormRow>
      <div>
        <CheckBox v-model="preferences.show_album_art_overlay" name="show_album_art_overlay" />
        应用当前专辑封面模糊半透明覆盖层。
      </div>
    </FormRow>
  </div>
</template>

<script lang="ts" setup>
import isMobile from 'ismobilejs'
import { toRef } from 'vue'
import { commonStore } from '@/stores/commonStore'
import { preferenceStore as preferences } from '@/stores/preferenceStore'
import { useKoelPlus } from '@/composables/useKoelPlus'

import CheckBox from '@/components/ui/form/CheckBox.vue'
import FormRow from '@/components/ui/form/FormRow.vue'

const onMobile = isMobile.any
const { isPlus } = useKoelPlus()

const showTranscodingOption = toRef(commonStore.state, 'supports_transcoding')
</script>

<style lang="postcss" scoped>
label {
  @apply text-base;
}
</style>
