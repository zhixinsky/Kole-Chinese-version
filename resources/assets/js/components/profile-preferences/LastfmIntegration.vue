<template>
  <section class="text-k-text-secondary">
    <h3 class="text-2xl mb-2">
      <span class="mr-2 text-[var(--lastfm-color)]">
        <Icon :icon="faLastfm" />
      </span>
      Last.fm 集成
    </h3>

    <div v-if="useLastfm" data-testid="lastfm-integrated">
      <p>Last.fm 集成已启用。Koel 将尝试从 Last.fm 检索专辑和艺术家信息。</p>
      <p v-if="connected">
        看来您也已连接了您的 Last.fm 帐户 – 太好了！
      </p>
      <p v-else>您还可以在此处连接您的 Last.fm 帐户。</p>
      <p>
        将 Koel 与您的 Last.fm 帐户连接可实现以下令人兴奋的功能
        <a href="https://www.last.fm/about/trackmymusic" rel="noopener" target="_blank">记录您的播放历史</a>.
      </p>
      <div class="buttons mt-4 space-x-2">
        <Btn class="!bg-[var(--lastfm-color)]" @click.prevent="connect">{{ connected ? 'Reconnect' : 'Connect' }}</Btn>
        <Btn v-if="connected" class="disconnect" gray @click.prevent="disconnect">断开</Btn>
      </div>
    </div>

    <div v-else data-testid="lastfm-not-integrated">
      <p>
        Last.fm 集成未启用。
        <span v-if="isAdmin" data-testid="lastfm-admin-instruction">
          请查看
          <a class="text-k-highlight" href="https://docs.koel.dev/service-integrations#last-fm" target="_blank">
            文档
          </a>
          相关说明。
        </span>
        <span v-else data-testid="lastfm-user-instruction">
          尝试请求管理员启用它。
        </span>
      </p>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { faLastfm } from '@fortawesome/free-brands-svg-icons'
import { computed, defineAsyncComponent } from 'vue'
import { authService } from '@/services/authService'
import { http } from '@/services/http'

import { useAuthorization } from '@/composables/useAuthorization'
import { useThirdPartyServices } from '@/composables/useThirdPartyServices'
import { forceReloadWindow } from '@/utils/helpers'

const Btn = defineAsyncComponent(() => import('@/components/ui/form/Btn.vue'))

const { currentUser, isAdmin } = useAuthorization()
const { useLastfm } = useThirdPartyServices()

const connected = computed(() => Boolean(currentUser.value.preferences!.lastfm_session_key))

/**
 * Connect the current user to Last.fm.
 * This method opens a new window.
 * Koel will reload once the connection is successful.
 */
const connect = () => window.open(
  `${window.BASE_URL}lastfm/connect?api_token=${authService.getApiToken()}`,
  '_blank',
  'toolbar=no,titlebar=no,location=no,width=1024,height=640',
)

const disconnect = async () => {
  await http.delete('lastfm/disconnect')
  forceReloadWindow()
}
</script>

<style lang="postcss" scoped>
section {
  --lastfm-color: #d31f27;
}
</style>
