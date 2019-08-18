<template>
  <div>
    The message from the server was:
    <em>{{msg}}</em>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg: string = '';

  async mounted() {
    fetch('http://localhost:8080/')
      .then((res) => res.json())
      .then((json) => {
        this.msg = json.msg;
      });
  }
}
</script>

<style scoped lang="scss">
</style>
