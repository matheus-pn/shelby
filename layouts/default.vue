<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      clipped
      fixed
      app
    >
      <v-list>
        <!-- UNGROUPED MENU -->
        <v-list-item
          v-for="(item, i) in menu.ungrouped"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="$t(item.title)" />
          </v-list-item-content>
        </v-list-item>
        <!-- GROUPED MENU -->
        <v-list-group
          v-for="item in menu.grouped"
          :key="item.title"
          :prepend-icon="item.action"
          :value="inNamespace(item.namespace)"
        >
          <template #activator>
            <v-list-item-content>
              <v-list-item-title v-text="$t(item.title)" />
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="child in item.items"
            :key="child.title"
            :to="child.to"
            router
            exact
          >
            <v-list-item-action>
              <v-icon>{{ child.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="$t(child.title)" />
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      clipped-left
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-menu offset-y>
        <template #activator="{ on, attrs }">
          <v-avatar
            color="accent"
            size="56"
            v-bind="attrs"
            v-on="on"
          >
            <span class="white--text headline">{{ userInitials() }}</span>
          </v-avatar>
        </template>
        <v-list>
          <v-list-item
            to="/logout"
            router
            exact
          >
            <v-list-item-action>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="$t('logout')" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-alert
          :value="!!$store.state.notice"
          border="left"
          dismissible
          type="info"
        >
          <template #close>
            <v-icon @click="dismissNotice()">mdi-close</v-icon>
          </template>
          {{ $store.state.notice }}
        </v-alert>
        <v-alert
          :value="!!$store.state.error"
          border="left"
          dismissible
          type="error"
        >
          <template #close>
            <v-icon @click="dismissError()">mdi-close</v-icon>
          </template>
          {{ $store.state.error }}
        </v-alert>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer
      absolute
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'

const menu = {
  ungrouped: [
    {
      icon: 'mdi-apps',
      title: 'welcome',
      to: '/'
    }
  ],

  grouped: [
    {
      title: 'technicalList.title',
      namespace: 'technical-list',
      items: [
        {
          icon: 'mdi-check-box-multiple-outline',
          title: 'technicalList.materialRules.title',
          to: '/technical-list/material-rules/all'
        }
      ]
    }
  ]
}

const defaultData = {
  drawer: false,
  fixed: false,
  menu,
  miniVariant: false,
  right: false,
  rightDrawer: false,
  title: 'Shelby.'
}

export default Vue.extend({
  data: () => (defaultData),

  methods: {
    userInitials (): string {
      const name = (this.$auth.user?.name ?? '') as string
      return name.split(/\s+/).map(n => n.charAt(0).toUpperCase()).join('')
    },
    inNamespace (namespace: string): boolean {
      const path = this.$nuxt.$route.path
      return path.split('/').some(n => n.match(namespace))
    },
    dismissNotice () {
      this.$store.commit('unsetNotice')
    },
    dismissError () {
      this.$store.commit('unsetError')
    }
  }
})
</script>
