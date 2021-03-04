<template>
  <v-card
    class="center"
    @keyup.enter="submit"
  >
    <v-form>
      <v-container>
        <v-text-field
          v-model="email"
          label="Email"
          type="text"
          :error="!!errorMessages.length"
        />

        <v-text-field
          v-model="password"
          :loading="loading"
          :error-messages="errorMessages"
          type="password"
          label="Password"
        />

        <v-btn
          class="mr-4"
          color="info"
          @click="submit"
        >
          {{ $t('login') }}
        </v-btn>
      </v-container>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { HTTPResponse } from '@nuxtjs/auth-next'
import Vue from 'vue'

const defaultData = {
  email: '' as String,
  password: '' as String,
  loading: false as Boolean,
  errorMessages: [] as String[]
}

export default Vue.extend({
  layout: 'login',
  data: () => (defaultData),

  methods: {
    startSending (): void {
      this.loading = true
      this.errorMessages = []
    },

    finishedOk (): void {
      this.loading = false
    },

    finishedErr (): void {
      this.loading = false
      this.errorMessages.push('Wrong email/password, please try again.')
    },

    loginPayload () {
      return {
        data: {
          sign_in: {
            password: this.password,
            email: this.email
          }
        }
      }
    },

    async submit (): Promise<void | HTTPResponse> {
      try {
        await this.$auth
          .loginWith('local', this.loginPayload())
          .then(this.finishedOk)
      } catch (err: unknown) {
        this.finishedErr()
      }
    }
  }
})
</script>

<style>
.center {
  margin: 0;
  position: fixed;
  width: 20%;
  top: 40%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>
