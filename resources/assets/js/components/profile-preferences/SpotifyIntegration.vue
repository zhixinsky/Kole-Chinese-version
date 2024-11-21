<template>
  <section class="text-k-text-secondary">
    <h3 class="text-2xl mb-2">
      <span class="mr-2 text-[#1db954]">
        <Icon :icon="faSpotify" />
      </span>
      Spotify 集成
    </h3>

    <div v-if="useSpotify">
      <p>
        Spotify 集成已启用。
        如果需要，播放歌曲时，Koel 会尝试从 Spotify 检索专辑封面和艺术家图像。
      </p>
    </div>
    <div v-else>
      <p>
        Spotify 集成未启用。
        <span v-if="isAdmin" data-testid="spotify-admin-instruction">
          请查看
          <a href="https://docs.koel.dev/service-integrations#spotify" target="_blank">
            文档
          </a>
          相关说明。
        </span>
      </p>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { faSpotify } from '@fortawesome/free-brands-svg-icons'
import { useAuthorization } from '@/composables/useAuthorization'
import { useThirdPartyServices } from '@/composables/useThirdPartyServices'

const { isAdmin } = useAuthorization()
const { useSpotify } = useThirdPartyServices()
</script>
