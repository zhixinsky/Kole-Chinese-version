import { ref } from 'vue'
import { screen, waitFor } from '@testing-library/vue'
import { expect, it } from 'vitest'
import UnitTestCase from '@/__tests__/UnitTestCase'
import factory from '@/__tests__/factory'
import { MessageToasterStub } from '@/__tests__/stubs'
import { ModalContextKey } from '@/symbols'
import { userStore } from '@/stores/userStore'
import EditUserForm from './EditUserForm.vue'

new class extends UnitTestCase {
  protected test () {
    it('edits a user', async () => {
      const updateMock = this.mock(userStore, 'update')
      const alertMock = this.mock(MessageToasterStub.value, 'success')

      const user = ref(factory('user', { name: 'John Doe' }))

      this.render(EditUserForm, {
        global: {
          provide: {
            [<symbol>ModalContextKey]: [ref({ user })],
          },
        },
      })

      await this.type(screen.getByRole('textbox', { name: 'Name' }), 'Jane Doe')
      await this.type(screen.getByTitle('Password'), 'new-password-duck')
      await this.user.click(screen.getByRole('button', { name: 'Update' }))

      await waitFor(() => {
        expect(updateMock).toHaveBeenCalledWith(user.value, {
          name: 'Jane Doe',
          email: user.value.email,
          is_admin: user.value.is_admin,
          password: 'new-password-duck',
        })

        expect(alertMock).toHaveBeenCalledWith('User profile updated.')
      })
    })
  }
}
