'use strict';
class HssMain {

    beforeRegister() {
        this.is = 'hss-main';
        this.properties = {
            dataUrl: {
                type: String
            },
            filter: {
                type: String
            }
        };
    }

    handleResponse() {
        if(this.ajaxResponse.hasOwnProperty('status') && this.ajaxResponse.status === 200) {
            this.items = this.ajaxResponse.result;
        }
    }
}
Polymer(HssMain);
