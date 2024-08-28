<template>
  <div class="column fullscreen items-center justify-center">
    <div class="text-h6">Redirecting...</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { LocalStorage } from 'quasar'
import { useRouter } from 'vue-router'
import { fetchOauthAccessToken, exchangeAccessTokenForJWT } from 'src/services/auth.service'

const router = useRouter()

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)

  if (!urlParams.get('code') || !urlParams.get('state')) {
    return router.push('/')
  }

  const oauthToken = await fetchOauthAccessToken(urlParams.get('code') as string, urlParams.get('state') as string)
  LocalStorage.set('oauth-token', oauthToken)

  const {user, ...jwtToken } = await exchangeAccessTokenForJWT(oauthToken.access_token)
  LocalStorage.set('jwt-token', jwtToken)

  LocalStorage.set('user', user)

  const returnUrl = LocalStorage.getItem('return-url') as string
  returnUrl ? window.location.href = returnUrl : router.push('/')
})
</script>
