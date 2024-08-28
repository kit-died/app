<template>
  <q-btn v-if="user" dense flat round size="md" color="app-3" icon="sym_o_account_circle">
    <q-menu>
      <q-card class="profile-menu rounded-md">
        <q-item>
          <q-item-section top avatar>
            <q-avatar color="app" text-color="white">
              <img src="https://cdn.quasar.dev/img/avatar4.jpg" alt="Avatar" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ user.name }}</q-item-label>
            <q-item-label caption>{{ user.username }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item @click="logout" clickable>
          <q-item-section avatar>
            <q-icon color="app" name="sym_o_logout" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Logout</q-item-label>
          </q-item-section>
        </q-item>
      </q-card>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { logout, useAuth } from 'src/services/auth.service'

const { user } = useAuth()
</script>
<!-- scoped style scss with profile-menu min-width -->
<style scoped lang="scss">
.profile-menu {
  min-width: 250px;
}
</style>
