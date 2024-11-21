<template>
  <form data-testid="update-profile-form" @submit.prevent="update">
    <AlertBox v-if="currentUser.sso_provider">
      <template v-if="currentUser.sso_provider === 'Reverse Proxy'">
        您已通过反向代理进行身份验证。
      </template>
      <template v-else>
        您正在通过以下方式登录 <strong>{{ currentUser.sso_provider }}</strong>.
      </template>
      您仍然可以在此处更新您的姓名和头像。
    </AlertBox>

    <div class="flex flex-col gap-3 md:flex-row md:gap-8 w-full md:w-[640px]">
      <div class="flex-1 space-y-5">
        <FormRow v-if="!currentUser.sso_provider">
          <template #label>当前密码</template>
          <TextInput
            v-model="profile.current_password"
            v-koel-focus
            data-testid="currentPassword"
            name="current_password"
            placeholder="需要更新您的个人资料"
            required
            type="password"
          />
        </FormRow>

        <FormRow>
          <template #label>姓名</template>
          <TextInput v-model="profile.name" data-testid="name" name="name" />
        </FormRow>

        <FormRow>
          <template #label>邮箱</template>
          <TextInput
            id="inputProfileEmail"
            v-model="profile.email"
            :readonly="currentUser.sso_provider"
            data-testid="email"
            name="email"
            required
            type="email"
          />
        </FormRow>

        <FormRow v-if="!currentUser.sso_provider">
          <template #label>新密码</template>
          <PasswordField
            v-model="profile.new_password"
            autocomplete="new-password"
            data-testid="newPassword"
            minlength="10"
            placeholder="留空以保留当前密码"
          />
          <template #help>至少10个字符，应包含字符、数字和符号。</template>
        </FormRow>
      </div>

      <div>
        <EditableProfileAvatar :profile="profile" />
      </div>
    </div>

    <footer class="mt-8">
      <Btn class="btn-submit" type="submit">保存</Btn>
      <span v-if="isDemo" class="text-[.95rem] opacity-70 ml-2">
        更改不会保存在演示版本中。
      </span>
    </footer>
  </form>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { UpdateCurrentProfileData } from '@/services/authService'
import { authService } from '@/services/authService'
import { useAuthorization } from '@/composables/useAuthorization'
import { useMessageToaster } from '@/composables/useMessageToaster'
import { useErrorHandler } from '@/composables/useErrorHandler'

import Btn from '@/components/ui/form/Btn.vue'
import PasswordField from '@/components/ui/form/PasswordField.vue'
import EditableProfileAvatar from '@/components/profile-preferences/EditableProfileAvatar.vue'
import AlertBox from '@/components/ui/AlertBox.vue'
import TextInput from '@/components/ui/form/TextInput.vue'
import FormRow from '@/components/ui/form/FormRow.vue'

const { toastSuccess } = useMessageToaster()
const { currentUser } = useAuthorization()

const profile = ref<UpdateCurrentProfileData>({} as UpdateCurrentProfileData)
const isDemo = window.IS_DEMO

onMounted(() => {
  profile.value = {
    name: currentUser.value.name,
    email: currentUser.value.email,
    avatar: currentUser.value.avatar,
    current_password: null,
  }
})

const update = async () => {
  if (!profile.value) {
    throw new Error('Profile data is missing.')
  }

  if (isDemo) {
    toastSuccess('Profile updated.')
    return
  }

  try {
    await authService.updateProfile(Object.assign({}, profile.value))
    profile.value.current_password = null
    delete profile.value.new_password
    toastSuccess('Profile updated.')
  } catch (error: unknown) {
    useErrorHandler('dialog').handleHttpError(error)
  }
}
</script>
