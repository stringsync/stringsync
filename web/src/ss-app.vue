<template>
  <v-app>
    <ss-app-bar></ss-app-bar>
    <ss-app-nav></ss-app-nav>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import ssAppBar from '@/components/ss-app-bar.vue';
import ssAppNav from '@/components/ss-app-nav.vue';

export default Vue.extend({
  components: {
    ssAppBar,
    ssAppNav,
  },
});
</script>
