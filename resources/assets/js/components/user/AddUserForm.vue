<template>
  <form @submit.prevent="submit" @keydown.esc="maybeClose">
    <header>
      <h1>添加新用户</h1>
    </header>

    <main class="space-y-5">
      <FormRow>
        <template #label>姓名</template>
        <TextInput v-model="newUser.name" v-koel-focus name="name" required title="Name" />
      </FormRow>
      <FormRow>
        <template #label>邮箱</template>
        <TextInput v-model="newUser.email" name="email" required title="Email" type="email" />
      </FormRow>
      <FormRow>
        <template #label>密码</template>
        <TextInput
          v-model="newUser.password"
          autocomplete="new-password"
          name="password"
          required
          title="Password"
          type="password"
        />
        <template #help>至少10个字符，应包含字符、数字和符号。</template>
      </FormRow>
      <FormRow>
        <div>
          <CheckBox v-model="newUser.is_admin" name="is_admin" />
          用户是管理员
          <TooltipIcon title="管理员可以执行管理用户和上传歌曲等功能。" />
        </div>
      </FormRow>
    </main>

    <footer>
      <Btn class="btn-add" type="submit">保存</Btn>
      <Btn class="btn-cancel" white @click.prevent="maybeClose">取消</Btn>
    </footer>
  </form>
</template>

<script lang="ts" setup>
import { isEqual } from 'lodash'
import { reactive } from 'vue'
import type { CreateUserData } from '@/stores/userStore'
import { userStore } from '@/stores/userStore'
import { useDialogBox } from '@/composables/useDialogBox'
import { useErrorHandler } from '@/composables/useErrorHandler'
import { useMessageToaster } from '@/composables/useMessageToaster'
import { useOverlay } from '@/composables/useOverlay'

import Btn from '@/components/ui/form/Btn.vue'

import TooltipIcon from '@/components/ui/TooltipIcon.vue'
import CheckBox from '@/components/ui/form/CheckBox.vue'
import TextInput from '@/components/ui/form/TextInput.vue'
import FormRow from '@/components/ui/form/FormRow.vue'

const emit = defineEmits<{ (e: 'close'): void }>()
const { showOverlay, hideOverlay } = useOverlay()
const { toastSuccess } = useMessageToaster()
const { showConfirmDialog } = useDialogBox()

const emptyUserData: CreateUserData = {
  name: '',
  email: '',
  password: '',
  is_admin: false,
}

const newUser = reactive<CreateUserData>(Object.assign({}, emptyUserData))

const close = () => emit('close')

const submit = async () => {
  showOverlay()

  try {
    await userStore.store(newUser)
    toastSuccess(`用户 "${newUser.name}" 已创建。`)
    close()
  } catch (error: unknown) {
    useErrorHandler('dialog').handleHttpError(error)
  } finally {
    hideOverlay()
  }
}

const maybeClose = async () => {
  if (isEqual(newUser, emptyUserData)) {
    close()
    return
  }

  await showConfirmDialog('放弃所有更改？') && close()
}
</script>
