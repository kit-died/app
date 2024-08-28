<template>
  <div class="bg-transparent" :style="`height: ${$q.screen.height}px`">
    <q-layout view="hHh LpR fFf" container>
      <q-header class="bg-app text-white">
        <div class="row items-center bg-app top-bar q-px-sm">
          <div class="col row items-center" style="margin-top: -2px;">
            <q-btn
              v-if="false"
              dense
              flat
              round
              icon="sym_o_menu"
              @click="toggleLeftDrawer"
            />
            <div class="col">
              <div class="q-px-md text-weight-bold">Betelgeuse</div>
            </div>
            <q-btn
              dense
              flat
              round
              size="md"
              class="q-mr-xs"
              color="app-3"
              icon="sym_o_settings"
              :to="{ name: 'settings' }"
            />
            <profile-button />
          </div>
        </div>
      </q-header>

      <q-drawer
        v-model="leftDrawerOpen"
        class="bg-app"
        side="left"
        :width="200"
        :mini="leftMiniState"
        show-if-above
      >
        <template #mini>
          <q-scroll-area class="fit mini-slot">
            <div class="">
              <q-list dense class="q-py-lg text-caption text-weight-bold">
                <nav-link
                  v-for="link in navLinks"
                  :key="link.title"
                  :="link"
                  mini
                />
              </q-list>
            </div>
          </q-scroll-area>
        </template>
        <q-scroll-area class="fit">
          <q-list dense class="q-py-lg text-caption text-weight-bold">
            <nav-link v-for="link in navLinks" :key="link.title" :="link" />
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <router-view
          :left-open="leftMiniState"
          @drawer-toggle="leftMiniState = !leftMiniState"
        />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup lang="ts">
import NavLink from 'components/NavLink.vue'
import { useQuasar } from 'quasar'
import { navLinks } from 'src/common/constants'
import ProfileButton from 'src/components/ProfileButton.vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const $q = useQuasar()

defineOptions({
  name: 'MainLayout',
})

const leftMiniState = ref(false)
const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const route = useRoute()
const router = useRouter()

</script>
