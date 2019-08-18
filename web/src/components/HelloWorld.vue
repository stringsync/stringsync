<template>
  <div>
    The message from the server was:
    <em>{{ msg }}</em>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios';

@Component
export default class HelloWorld extends Vue {
  private msg: string = '';

  async mounted() {
    axios('/').then((res) => (this.msg = res.data.msg));
  }
}
</script>

<style scoped lang="scss"></style>
