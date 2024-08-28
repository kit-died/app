import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'root',
    component: () => import('layouts/main-layout/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('pages/dashboard-page/DashboardPage.vue'),
      },
      
      {
        path: 'settings',
        name: 'settings',
        component: () => import('pages/settings-page/SettingsPage.vue'),
        children: [
          {
            path: 'users',
            name: 'settings-users',
            component: () => import('pages/settings-page/ManageUsers.vue'),
          }
        ]
      },
    ],
  },
  {
    path: '/oauth/callback',
    name: 'oauth-callback',
    component: () => import('pages/OauthCallback.vue')
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
