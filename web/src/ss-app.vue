<template>
  <v-app>
    <ss-app-bar :isAppNavVisible="isAppNavVisible"></ss-app-bar>
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

interface Data {}
interface Methods {}
interface Computed {
  isAppNavVisible: boolean;
}
interface Props {}

export default Vue.extend<Data, Methods, Computed, Props>({
  components: {
    ssAppBar,
    ssAppNav,
  },
  computed: {
    isAppNavVisible() {
      const pathname = this.$route.name;
      return pathname !== 'login' && pathname !== 'signup';
    },
  },
});
</script>
