'use strict';

class HssApp {

    attached() {
        addEventListener('paper-header-transform', (e) => {
            var appName = document.querySelector('#mainToolbar .app-name');
            var middleContainer = document.querySelector('#mainToolbar .middle-container');
            var bottomContainer = document.querySelector('#mainToolbar .bottom-container');
            var detail = e.detail;
            var heightDiff = detail.height - detail.condensedHeight;
            var yRatio = Math.min(1, detail.y / heightDiff);
            // appName max size when condensed.
            // The smaller the number the smaller the condensed size.
            var maxMiddleScale = 0.50;
            var scaleMiddle = Math.max(
                maxMiddleScale,
                (heightDiff - detail.y) / (heightDiff / (1 - maxMiddleScale))  + maxMiddleScale);
            var scaleBottom = 1 - yRatio;

            // Move/translate middleContainer
            Polymer.Base.transform('translate3d(0,' + yRatio * 100 + '%,0)', middleContainer);

            // Scale bottomContainer and bottom sub title to nothing and back
            Polymer.Base.transform('scale(' + scaleBottom + ') translateZ(0)', bottomContainer);

            // Scale middleContainer appName
            Polymer.Base.transform('scale(' + scaleMiddle + ') translateZ(0)', appName);
        });

    }

    beforeRegister() {
        this.is = 'hss-app';
        this.isConnected = false;
        this.connectionIcon = 'hardware:cast';
        this.channels = {};
    }

    connect() {
        if(this.clientId) {

            let action = this.isConnected ? 'disconnect' : 'registerServer';
            this.socket.send(JSON.stringify({action: action}));
            this.isConnected = !this.isConnected;
            this.connectionIcon = this.isConnected ? 'hardware:cast-connected' : 'hardware:cast';
        }
    }

    reconnect() {
        if(this.serverUrl) {
            this.loadSocket();
        }
    }

    onPlay(e) {

        this.socket.send(JSON.stringify({
            action: 'playSound',
            data: e.detail.sound,
            clientId: this.clientId
        }));
    }

    onKeyUp(e) {
        if(e.which === 13) {
            this.fire('hss-submit-search', {query: e.currentTarget.value});
        }
    }

    handleResponse() {
        if(this.ajaxResponse) {
            this.serverUrl = `http://${this.ajaxResponse.server}/hss/`;
            this.socketUrl  = `ws://${this.ajaxResponse.server}:${this.ajaxResponse.port}/hss/socket/hssSocket.php`;
            this.dataUrl = this.serverUrl + 'getSounds.php';
        }
        this.loadSocket();
    }

    loadSocket() {
        if(this.socket) {
            this.socket.close();
        }

        try {
            this.socket = new WebSocket(this.socketUrl);
            this.socket.onopen = (msg) => {
                this.socket.send(JSON.stringify({action: 'registerClient'}));
                console.log('Socket opened ', msg);
            };

            this.socket.onmessage = (msg) => {
                let data = JSON.parse(msg.data);

                switch(data.msg) {
                    case 'clientRegistered':
                        this.clientId = data.data;
                        this.connect();
                        break;
                    case 'playSound':
                        this.playSound(data.data, data.clientId);
                        break;

                }
            };

        } catch (ex) {
            console.log('ex', ex);
        }
    }

    playSound(file, channel) {
        if(!this.channels.hasOwnProperty(channel)) {
            this.channels[channel] = new Audio();
        }

        this.channels[channel].src = this.serverUrl + file;
        this.channels[channel].volume = 1;
        this.channels[channel].play();

        if(channel !== this.clientId) {
            // If another client wants to play a sound,
            // show the ripple effect
            this.fire('hss-play-sound', {sound: file});
        }
    }

}
Polymer(HssApp);
