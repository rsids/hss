<template>
  <v-card v-if="sound" width="150" class="ma-4 pa-4 sound" height="150" @click="onClick">
    <div>{{sound.name}}</div>
  </v-card>
</template>

<script>
export default {
  name: "HssSound",
  props: [
    "sound"
  ],

  methods: {
    onClick() {
      this.$emit('play-sound', {sound: this.sound});
    }
  }
}
</script>

<style scoped>
  .sound {
    align-items: center;
    display: flex;
    justify-content: center;
    text-align: center;
    font-size: 18px;
    word-break: break-word;
  }
</style>
