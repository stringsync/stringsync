<template>
  <v-navigation-drawer
    app
    temporary
    right
    bottom
    v-model="isAppNavOpened"
  ></v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';

export default Vue.extend({
  computed: {
    isAppNavOpened: {
      get() {
        return this.$store.getters.isAppNavOpened;
      },
      set(isAppNavOpened) {
        this.$store.dispatch('setIsAppNavOpened', { isAppNavOpened });
      },
    },
  },
});
</script>
