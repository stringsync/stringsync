<template>
  <v-app-bar app>
    <v-toolbar-title class="headline">
      <span class="font-weight-light">StringSync</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click.stop="toggleIsAppNavOpened">
      <v-icon>mdi-account-circle</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';

export default Vue.extend({
  methods: {
    ...mapActions('ui', ['toggleIsAppNavOpened']),
  },
});
</script>
