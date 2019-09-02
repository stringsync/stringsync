<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4" lg="3">
        <v-card>
          <v-card-title class="text-center">StringSync</v-card-title>
          <v-card-text>
            <v-form id="ss-login-form" v-model="valid" @submit.prevent="login">
              <v-text-field
                label="email"
                name="email"
                type="text"
                required
                autofocus
                v-model="email"
                :rules="emailRules"
              >
              </v-text-field>
              <v-text-field
                label="password"
                name="password"
                type="password"
                required
                v-model="password"
                :rules="passwordRules"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              text
              block
              type="submit"
              color="primary"
              form="ss-login-form"
            >
              Login
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-spacer></v-spacer>
      </v-col>
    </v-row>

    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4" lg="3">
        <v-card>
          <v-card-text class="text-center">
            Don't have an account?
            <router-link :to="{ name: 'signup' }">Signup</router-link>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  emailIsRequired,
  emailFormat,
  passwordIsRequired,
} from '../util/validators';
import { FieldValidator } from '../types/field-validator';

interface Data {
  valid: boolean;
  email: string;
  emailRules: FieldValidator[];
  password: string;
  passwordRules: FieldValidator[];
}
interface Methods {
  login(event: Event): void;
}
interface Computed {
  shouldRedirect: boolean;
}
interface Props {}

const REDIRECT_PATH = Object.freeze({ name: 'library ' });

export default Vue.extend<Data, Methods, Computed, Props>({
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (vm['shouldRedirect']) {
        next(REDIRECT_PATH);
      }
    });
  },
  data() {
    return {
      valid: false,
      email: '',
      emailRules: [emailIsRequired, emailFormat],
      password: '',
      passwordRules: [passwordIsRequired],
    };
  },
  methods: {
    login(event: Event) {
      console.log('logging in');
      if (!this.valid) {
        return;
      }
      this.$store.dispatch('session/login', {
        username: this.email,
        password: this.password,
      });
    },
  },
  computed: {
    shouldRedirect() {
      return this.$store.state.session.isLoggedIn;
    },
  },
  watch: {
    shouldRedirect(shouldRedirect) {
      if (shouldRedirect) {
        this.$router.push(REDIRECT_PATH);
      }
    },
  },
});
</script>
