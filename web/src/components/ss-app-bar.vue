<template>
  <v-app-bar app flat :style="style">
    <v-toolbar-title>
      <span class="font-weight-thin">StringSync</span>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn icon @click.stop="toggleIsAppNavOpened">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';

export default Vue.extend({
  data() {
    return {
      style: {
        borderBottom: `1px solid ${this.$vuetify.theme.themes.light.border}`,
      },
    };
  },
  methods: {
    ...mapActions(['toggleIsAppNavOpened']),
  },
});
</script>
