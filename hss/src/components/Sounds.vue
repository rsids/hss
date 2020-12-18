<template>
  <div class="d-flex flex-wrap">
    <hss-sound v-for="(sound,i) of sounds" :key="i" :sound="sound" @play-sound="onClick(sound)"></hss-sound>
  </div>
</template>

<script>
import HssSound from "@/components/Sound";

export default {
  name: "HssSounds",
  components: {HssSound},
  props: [
    "settings"
  ],

  data() {
    return {
      sounds: null
    }
  },

  mounted() {
    this.axios.get('getSounds.php').then(sounds => {
      console.log("sounds", sounds)
      this.sounds = sounds.data.result
    })
  },

  methods: {
    onClick(sound) {
      this.$emit('play-sound', sound);
    }
  }

}
</script>

<style scoped>

</style>
