<template>
  <form data-testid="edit-user-form" @submit.prevent="submit" @keydown.esc="maybeClose">
    <header>
      <h1>编辑用户</h1>
    </header>

    <main class="space-y-5">
      <AlertBox v-if="user.sso_provider" type="info">
        该用户通过 SSO 登录 {{ user.sso_provider }}.<br>
      </AlertBox>

      <FormRow>
        <template #label>姓名</template>
        <TextInput v-model="updateData.name" v-koel-focus name="name" required title="Name" />
      </FormRow>
      <FormRow>
        <template #label>邮箱</template>
        <TextInput
          v-model="updateData.email"
          :readonly="user.sso_provider"
          name="email"
          required
          title="Email"
          type="email"
        />
      </FormRow>
      <FormRow v-if="!user.sso_provider">
        <template #label>密码</template>
        <TextInput
          v-model="updateData.password"
          autocomplete="new-password"
          name="password"
          placeholder="Leave blank for no changes"
          title="Password"
          type="password"
        />
        <template #help>至少10个字符，应包含字符、数字和符号。</template>
      </FormRow>
      <FormRow>
        <div>
          <CheckBox v-model="updateData.is_admin" name="is_admin" />
          用户是管理员
          <TooltipIcon title="管理员可以执行管理用户和上传歌曲等功能。" />
        </div>
      </FormRow>
    </main>

    <footer>
      <Btn class="btn-update" type="submit">更新</Btn>
      <Btn class="btn-cancel" white @click.prevent="maybeClose">取消</Btn>
    </footer>
  </form>
</template>

<script lang="ts" setup>
import { isEqual } from 'lodash'
import { reactive, watch } from 'vue'
import type { UpdateUserData } from '@/stores/userStore'
import { userStore } from '@/stores/userStore'
import { useDialogBox } from '@/composables/useDialogBox'
import { useErrorHandler } from '@/composables/useErrorHandler'
import { useMessageToaster } from '@/composables/useMessageToaster'
import { useModal } from '@/composables/useModal'
import { useOverlay } from '@/composables/useOverlay'

import Btn from '@/components/ui/form/Btn.vue'
import TooltipIcon from '@/components/ui/TooltipIcon.vue'
import CheckBox from '@/components/ui/form/CheckBox.vue'
import AlertBox from '@/components/ui/AlertBox.vue'
import TextInput from '@/components/ui/form/TextInput.vue'
import FormRow from '@/components/ui/form/FormRow.vue'

const emit = defineEmits<{ (e: 'close'): void }>()

const { showOverlay, hideOverlay } = useOverlay()
const { toastSuccess } = useMessageToaster()
const { showConfirmDialog } = useDialogBox()

const user = useModal().getFromContext<User>('user')

let originalData: UpdateUserData
let updateData: UpdateUserData

watch(user, () => {
  originalData = {
    name: user.name,
    email: user.email,
    is_admin: user.is_admin,
  }

  updateData = reactive(Object.assign({}, originalData))
}, { immediate: true })

const close = () => emit('close')

const submit = async () => {
  showOverlay()

  try {
    await userStore.update(user, updateData)
    toastSuccess('User profile updated.')
    close()
  } catch (error: unknown) {
    useErrorHandler('dialog').handleHttpError(error)
  } finally {
    hideOverlay()
  }
}

const maybeClose = async () => {
  if (isEqual(originalData, updateData)) {
    close()
    return
  }

  await showConfirmDialog('放弃所有更改？') && close()
}
</script>
