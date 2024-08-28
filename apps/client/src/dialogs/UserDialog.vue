<template>
  <q-dialog ref="dialogRef" v-bind="$props">
    <q-card>

      <q-card-section class="q-pb-sm text-weight-bold text-subtitle1 text-app-7">
        {{ $props?.title }}
      </q-card-section>

      <q-form @submit="onSubmit">

      <q-card-section class="row q-col-gutter-md">
        <sirius-user-picker v-if="!props.user" v-model="siriusUser" label="Sirius User" class="col-12" />
        <input-box class="col-6" bottom-slots v-model="newUser.name" label="Name" :rules="[(val: string) => !!val || 'Required']"></input-box>
        <input-box class="col-6" v-model="newUser.username" label="Username"></input-box>
        <input-box class="col-6" :input-props="{type: 'email'}" v-model="newUser.email" label="Email"></input-box>
        <input-box :input-props="{type: 'tel'}" class="col-6" v-model="newUser.phone" label="Phone"></input-box>
        <select-box class="col-6" v-model="userStatus" :select-props="statusProps" label="Status"></select-box>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat round icon="sym_o_close" v-close-popup />
        <q-btn flat round icon="sym_o_check" type="submit" />
      </q-card-actions>
      
      </q-form>
      
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { QDialog, QDialogProps, useDialogPluginComponent } from 'quasar'
import InputBox from 'src/components/InputBox.vue'
// import EntityPicker from 'src/components/pickers/EntityPicker.vue'
import SiriusUserPicker from 'src/components/pickers/SiriusUserPicker.vue'
import SelectBox from 'src/components/SelectBox.vue'
import { CreateUserDto, UpdateUserDto, UserDto, UserStatus } from 'src/gql/graphql'
// // import { Entity } from 'src/models/entity'
import { ISiriusUser, User } from 'src/models/user'
import { computed, ref, watch } from 'vue'

// this method passes qdialog props as well as custom props
const props = defineProps<QDialogProps & {
  title?: string, 
  wide?: boolean,
  user?: User
}>()

const emit = defineEmits([...useDialogPluginComponent.emits])
const siriusUser = ref<ISiriusUser>()
// // const assignedEntity = ref<Entity>()

const newUser = ref<Omit<CreateUserDto | UpdateUserDto, 'status'>>({
  name: props.user?.name || '',
  username: props.user?.username || '',
  email: props.user?.email || '',
  phone: props.user?.phone || '',
  //  avatar: props.user?.avatar || '',
})

const userStatus = ref<UserStatus>(UserStatus.Active)


watch(siriusUser, (curr, prev) => {
  newUser.value = {
    ...newUser.value,
    name: curr?.name || '',
    username: curr?.username || '',
    email: curr?.email || '',
    phone: curr?.phone || ''
  }
})

// ensures that the input fields are disabled if the sirius user is not selected
const inputProps = computed(() => ({
  disable: !!!siriusUser.value?.username
}))

const statusProps = computed(() => ({
  options: Object.values(UserStatus),
  // should probably use a function to format the label like lodash _.toSentenceCase, must be a better way to do this
  optionLabel: (val: UserStatus) => val.toString()[0].toUpperCase() + val.toString().slice(1).toLowerCase(),
}))

const avatarProps = {
  type: 'File',
  accept: 'image/*',
  hint: 'Select an image file'
}

const onSubmit = () => {
  const data = {
    ...newUser.value,
    status: userStatus.value
  }
  onDialogOK(data)
}

const {
  dialogRef,
  onDialogOK
} = useDialogPluginComponent()


</script>

<style lang="scss" scoped>
  .q-card {
    width: clamp(300px, 50%, 600px);
  }
</style>