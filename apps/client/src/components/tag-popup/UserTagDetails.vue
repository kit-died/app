<template>
  <q-list dark separator>
    <q-item>
      <q-item-section avatar class="avatar-near">
        <q-avatar>
          <img v-if="user.avatar" :src="user.avatar" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ user.name }}</q-item-label>
        <q-item-label caption>Name</q-item-label>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section avatar class="avatar-near">
        <q-icon size="22px" name="sym_o_person" color="app-1" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ user.username }}</q-item-label>
        <q-item-label caption>Username</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { User } from 'src/models/user'

defineProps<{
  user: User
}>()
</script>
