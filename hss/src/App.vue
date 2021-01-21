<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <h1>Hidden Sound System</h1>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        v-if="!direct"
        @click="toggleServer"
        color="accent"
        small
        fab
      >
        <v-icon v-if="!socket">mdi-cast-off</v-icon>
        <v-icon v-else-if="!isServer">mdi-cast</v-icon>
        <v-icon v-else>mdi-cast-audio</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <hss-sounds v-if="settings" :settings="settings" @play-sound="requestPlay"/>
    </v-main>
  </v-app>
</template>

<script>
import HssSounds from "@/components/Sounds";

export default {
  name: 'App',

  components: {
    HssSounds,
  },

  mounted() {
    this.axios.get('settings.json').then(settings => {
      this.settings = settings.data;

      if(this.socket) {
        this.socket.close();
      }

      try {
        this.socket = new WebSocket(`ws://${this.settings.host}:${this.settings.port}`);
        this.socket.onopen = (msg) => {
          console.log('Socket opened ', msg);
        };

        this.socket.onerror = (err) => {
          console.error(err);
          this.direct = true;
        }

        this.socket.onmessage = (msg) => {
          let data = JSON.parse(msg.data);
          switch(data.action) {
            case 'playSound':
              this.playSound(data.data, data.clientId);
              break;

          }
        };

      } catch (ex) {
        console.log('ex', ex);
        this.direct = true;
      }
    })
  },

  data: () => ({
    direct: false,
    socket: null,
    settings: null,
    isServer: false,
    channels: {}
  }),

  methods: {
    toggleServer(){
      this.isServer = !this.isServer;
    },
    playSound(file, channel) {
      if(!this.isServer) {
        return;
      }
      if(!this.channels[channel]) {
        this.channels[channel] = new Audio();
      }
      //
      this.channels[channel].src = '//' + this.settings.server + '/sounds/' + file;
      this.channels[channel].volume = 1;
      this.channels[channel].play();
    },

    requestPlay(sound) {
      if(this.direct) {
        this.playSound(sound.file, 1);
      } else {
        this.socket.send(JSON.stringify({
          action: 'playSound',
          data: sound.file
        }));

      }
    }
  }
};
</script>
