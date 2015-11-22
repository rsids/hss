'use strict';

class HssSoundItem {

    attached() {
        this.querySelector('.hss-paper').style.background = this.getColor(this.index);

        addEventListener('hss-play-sound', (e) => {
            if(e.detail.sound === this.sound[0]) {
                this.$.soundRipple.simulatedRipple();
            }
        });
    }

    beforeRegister() {
        this.is = 'hss-sound-item';
        this.properties = {
            sound: {
                type: Array,
                observer: '_soundChanged'
            },
            index: {
                type: Number
            }
        };

    }

    onSoundClick() {
        this.fire('play', {sound: this.soundLink});
    }

    getColor(idx) {
        const colors = [
            /*'#EF5350','#EC407A','#AB47BC',
             '#7E57C2','#5C6BC0','#42A5F5',*/
            '#29B6F6','#26C6DA','#26A69A',
            '#66BB6A','#9CCC65','#D4E157',
            '#FFEE58'/*,'#FFCA28','#FFA726',
             '#FF7043','#8D6E63'*/
        ];

        return colors[idx % colors.length];
    }

    _soundChanged(value) {
        this.soundLink = value[0];
        this.soundName = value[1];
    }
}
Polymer(HssSoundItem);
