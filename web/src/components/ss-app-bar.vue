<template>
  <v-app-bar app flat clipped-right :value="isAppNavVisible" :style="style">
    <router-link :to="{ name: 'library' }">
      <v-toolbar-title class="toolbar-title">StringSync</v-toolbar-title>
    </router-link>

    <v-spacer></v-spacer>

    <v-btn icon @click.stop="toggleIsAppNavOpened">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';

interface Data {}
interface Methods {}
interface Computed {}
interface Props {
  isAppNavVisible: boolean;
}

export default Vue.extend<Data, Methods, Computed, Props>({
  props: {
    isAppNavVisible: {
      required: true,
      default: false,
    },
  },
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

<style lang="scss" scoped>
.toolbar-title {
  text-decoration: none;
}
</style>
