'use strict';
class HssList {

    beforeRegister() {
        this.is = 'hss-list';
        this.properties = {
            items: {
                type: Array,
                value: function() {
                    return [];
                }
            },
            dataUrl: {
                type: String
            },
            filter: {
                type: String,
                value: () => {
                    return '';
                }
            }
        };
    }

    ready() {
        addEventListener('hss-submit-search', () => {
            if(this.querySelectorAll('hss-sound-item').length === 1) {
                var soundItem = this.querySelectorAll('hss-sound-item').item(0);
                soundItem.onSoundClick();
            }

        });
    }

    _filter(filter) {
        if(filter === '') {
            return null;
        }
        return (item) => {
            return item[1].toLowerCase().indexOf(filter.toLowerCase()) > -1;
        };
    }
}
Polymer(HssList);
