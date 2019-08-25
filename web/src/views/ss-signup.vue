<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4" lg="3">
        <v-card>
          <v-card-title class="text-center">
            StringSync
          </v-card-title>
          <v-card-text>
            <v-form v-model="valid" lazy-validation>
              <v-text-field
                label="email"
                name="email"
                type="text"
                required
                autofocus
                v-model="email"
                :rules="emailRules"
              ></v-text-field>
              <v-text-field
                label="password"
                name="password"
                type="password"
                required
                v-model="password"
                :rules="passwordRules"
              ></v-text-field>
              <v-text-field
                label="confirm password"
                name="confirm password"
                type="password"
                required
                v-model="confirmPassword"
                :rules="confirmPasswordRules"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn text block color="primary">
              Signup
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
            Already have an account?
            <router-link :to="{ name: 'login' }">Login</router-link>
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

interface Data {
  valid: boolean;
  email: string;
  emailRules: FieldValidator[];
  password: string;
  passwordRules: FieldValidator[];
  confirmPassword: string;
  confirmPasswordRules: FieldValidator[];
}
interface Methods {}
interface Computed {}
interface Props {}

export default Vue.extend<Data, Methods, Computed, Props>({
  data() {
    return {
      valid: false,
      email: '',
      emailRules: [emailIsRequired, emailFormat],
      password: '',
      passwordRules: [passwordIsRequired],
      confirmPassword: '',
      confirmPasswordRules: [
        passwordIsRequired,
        () => this.password === this.confirmPassword || 'passwords must match',
      ],
    };
  },
});
</script>
