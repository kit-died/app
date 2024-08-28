<template>
  <page-wrapper v-model:query="searchVal" @update:query="query" title="Manage Users" subtitle="Manage users and assign role permissions" icon="sym_o_group">
    <q-btn label="Add new user" icon="sym_o_add" class="not-rounded full-width" square unelevated @click="createUserDialog"></q-btn>
      <q-list class="q-gutter-xs q-mx-md q-mb-md">
        <transition-group appear enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutRight">
          <list-item
            v-for="user in items"
            :key="user.id"
            :label="user.name"
            :caption="user.username"
            :query="searchVal"
            :confirm-title="`Delete '${user.username}'`"
            :confirm-message="`Are you sure you want to delete the user <strong>${user.name}</strong>?`"
            :on-delete="async () => deleteUserDialog(user)"
            :on-update="async () => updateUserDialog(user)"
            resource-name="user"
          />
        </transition-group>
        <show-more
          :count="items.length"
          :hasMoreRows="hasMoreRows"
          :loading="loading"
          @on-click="showMore"
        />
      </q-list>
  </page-wrapper>
</template>

<script setup lang="ts">
import { useMutation } from '@vue/apollo-composable'
import { useQuasar } from 'quasar'
import ShowMore from 'src/components/ShowMore.vue'
import { useGetPaged } from 'src/composables/get-paged'
import UserDialog from 'src/dialogs/UserDialog.vue'
import { UpdateUserDocument, CreateUserDocument, CreateUserDto, DeleteUserDocument, GetUserListDocument, GetUserListQuery, UserWhere, UpdateUserDto } from 'src/gql/graphql'
import PageWrapper from 'src/layouts/PageWrapper.vue'
import { ref } from 'vue'
import ListItem from './ListItem.vue'

const $q = useQuasar()

const searchVal = ref('')

const { items, result, loading, hasMoreRows, query, showMore } = useGetPaged(GetUserListDocument, {
  useCache: false,
  buildVariables: () => ({ 
    where: buildFilter(), 
    sort: 'id', // without this, every time you update a user they go to the end of the list
  }),
})

function buildFilter(): UserWhere {
  if (!searchVal.value) return {}

  return {
    or: [
      { username: { contains: searchVal.value } },
      { name: { contains: searchVal.value } },
      { email: { contains: searchVal.value } },
      { phone: { contains: searchVal.value } },
    ]
  }
}

const { mutate: deleteUser } = useMutation(DeleteUserDocument)
const { mutate: createUser } = useMutation(CreateUserDocument)
const { mutate: updateUser } = useMutation(UpdateUserDocument)

async function deleteUserDialog(user: GetUserListQuery['users'][number]) {
  await deleteUser({ id: user.id })
  if (!result.value?.users?.length) return
  result.value = {
    ...result.value,
    users: result.value.users.filter((u) => u.id !== user.id) || []
  }
}

const createUserDialog = () => {
  $q.dialog({
    component: UserDialog,
    componentProps: {
      persistent: true,
      title: 'Create User',
      wide: true,
    },
  }).onOk(async (data: CreateUserDto) => {
    try {
      await createUser({ data }, { refetchQueries: ['GetUserList'] })
      $q.notify({ type: 'positive', message: 'Asset created successfully' })
    } catch (e) {
      $q.notify({ type: 'negative', message: 'Error creating asset' })
      console.error('Error creating asset:', e)
    }
  })
}

const updateUserDialog = (user: GetUserListQuery['users'][number]) => {
  $q.dialog({
    component: UserDialog,
    componentProps: {
      persistent: true,
      title: 'Update User',
      wide: true,
      user,
    },
  }).onOk(async (data: UpdateUserDto) => {
    const id = user.id
    try {
      await updateUser({ id,  data }, { refetchQueries: ['GetUserList'] })
      $q.notify({ type: 'positive', message: 'Asset updated successfully' })
    } catch (e) {
      $q.notify({ type: 'negative', message: 'Error updating asset' })
      console.error('Error updating asset:', e)
    }
  })
}

</script>

<style scoped lang="scss">
:deep(.q-field__control) {
  border-radius: 8px;
}
</style>
