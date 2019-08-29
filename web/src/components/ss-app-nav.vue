<template>
  <v-navigation-drawer app temporary right bottom v-model="isAppNavOpened">
    <template v-slot:prepend>
      <v-list-item two-line>
        <template v-if="isLoggedIn">
          <v-list-item-avatar>
            <img src="https://randomuser.me/api/portraits/women/81.jpg" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>Jane Smith</v-list-item-title>
            <v-list-item-subtitle>Logged In</v-list-item-subtitle>
          </v-list-item-content>
        </template>
        <template v-else>
          <v-row>
            <v-col>
              <v-btn block color="primary" :to="{ name: 'login' }">Login</v-btn>
            </v-col>
            <v-col>
              <v-btn block text color="primary" :to="{ name: 'signup' }"
                >Signup</v-btn
              >
            </v-col>
          </v-row>
        </template>
      </v-list-item>
    </template>

    <v-divider></v-divider>

    <v-list dense>
      <v-list-item
        v-for="item in items"
        :key="item.title"
        @click="navigateTo(item.name)"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <template v-slot:append v-if="isLoggedIn">
      <div class="pa-2">
        <v-btn block>Logout</v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue, { ComputedOptions } from 'vue';
import { mapActions, mapGetters } from 'vuex';

interface Item {
  title: string;
  icon: string;
  name: string;
}

interface Data {
  items: Item[];
}
interface Methods {}
interface Computed {
  isAppNavOpened: ComputedOptions<boolean>;
}
interface Props {}

export default Vue.extend<Data, Methods, Computed, Props>({
  data() {
    return {
      items: [{ title: 'Library', icon: 'mdi-library-books', name: 'home' }],
    };
  },
  methods: {
    navigateTo(name: string) {
      this.$router.push({ name });
    },
  },
  computed: {
    isAppNavOpened: {
      get() {
        return this.$store.state.ui.isAppNavOpened;
      },
      set(isAppNavOpened) {
        this.$store.dispatch('setIsAppNavOpened', { isAppNavOpened });
      },
    },
    ...mapGetters(['isLoggedIn']),
  },
});
</script>
