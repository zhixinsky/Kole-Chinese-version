<template>
  <article class="text-k-text-secondary">
    您无需输入密码，只需扫描下方二维码即可登录
    <a href="https://koel.dev/#mobile" target="_blank">Koel Player</a>
    在您的移动设备上。<br>
    二维码每10分钟刷新一次。
    <a role="button" @click.prevent="resetOneTimeToken">立即刷新</a>
    <img :src="qrCodeUrl" alt="QR Code" class="mt-4 rounded-4" height="192" width="192">
  </article>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { authService } from '@/services/authService'
import { base64Encode } from '@/utils/crypto'

const qrCodeData = ref('')
const oneTimeToken = ref('')

watch(oneTimeToken, () => {
  qrCodeData.value = base64Encode(JSON.stringify({
    token: oneTimeToken.value,
    host: window.BASE_URL,
  }))
})

const qrCodeUrl = useQRCode(qrCodeData, {
  width: window.devicePixelRatio === 1 ? 196 : 384,
  height: window.devicePixelRatio === 1 ? 196 : 384,
})

let oneTimeTokenTimeout: number | null = null

const resetOneTimeToken = async () => {
  oneTimeToken.value = await authService.getOneTimeToken()

  if (oneTimeTokenTimeout) {
    window.clearTimeout(oneTimeTokenTimeout)
  }

  oneTimeTokenTimeout = window.setTimeout(resetOneTimeToken, 60 * 10 * 1000)
}

onMounted(() => resetOneTimeToken())
</script>
