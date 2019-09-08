<template>
  <v-navigation-drawer
    app
    temporary
    right
    bottom
    clipped
    v-model="isAppNavOpened"
  >
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
        :to="{ name: item.name }"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <template v-slot:append v-if="isLoggedIn" @click.stop="logout">
      <div class="pa-2">
        <v-btn block @click.stop="logout">Logout</v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue, { ComputedOptions } from 'vue';
import { mapActions, mapState } from 'vuex';

interface Item {
  title: string;
  icon: string;
  name: string;
}

interface Data {
  items: Item[];
}
interface Methods {
  logout(): void;
}
interface Computed {
  isAppNavOpened: ComputedOptions<boolean>;
  isLoggedIn: boolean;
}
interface Props {}

export default Vue.extend<Data, Methods, Computed, Props>({
  data() {
    return {
      items: [{ title: 'Library', icon: 'mdi-library-books', name: 'library' }],
    };
  },
  methods: {
    logout() {
      this.$store.dispatch('session/logout');
    },
  },
  computed: {
    isAppNavOpened: {
      get() {
        return this.$store.state.ui.isAppNavOpened;
      },
      set(isAppNavOpened) {
        this.$store.dispatch('ui/setIsAppNavOpened', { isAppNavOpened });
      },
    },
    isLoggedIn() {
      return this.$store.state.session.isLoggedIn;
    },
  },
});
</script>
