<template>
  <v-app>
    <v-main
      class="primary shelby-bg"
    >
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<style>
.shelby-bg {
  background-image: url('/wpp.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}
</style>
