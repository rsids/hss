import {Component} from '@angular/core';
import {SoundsService} from "./sounds.service";
import {WebsocketService} from "./websocket.service";
import {until} from "selenium-webdriver";
import elementIsNotVisible = until.elementIsNotVisible;
import {environment} from "../environments/environment";

@Component({
    providers: [SoundsService, WebsocketService],
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    searchString:string;
    isServer: boolean = false;
    connectionIcon: string = 'cast';
    private channels: any;

    constructor(private soundService: SoundsService) {
        this.channels = {}
    }

    ngOnInit() {

        this.soundService.hss.subscribe(data => {
            switch (data.msg) {
                case 'clientRegistered':
                    this.soundService.clientId = data.data;
                    if(!this.isServer) {
                        this.toggleServer();
                    }
                    break;
                case 'playSound':
                    this.playSound(data.data, data.clientId);
                    break;
            }

        });

    }

    toggleServer() {
        let action: string = this.isServer ? 'disconnect' : 'registerServer';
        this.isServer = !this.isServer;
        this.connectionIcon = this.isServer ? 'cast_connected' : 'cast';
        this.soundService.hss.next({action: action});
    }

    private playSound(file, channel) {
        if (!this.channels.hasOwnProperty(channel)) {
            this.channels[channel] = new Audio();
        }
        this.channels[channel].src = environment.serverUrl + file;
        this.channels[channel].volume = 1;
        this.channels[channel].play();

        if (channel !== this.soundService.clientId) {
            // If another client wants to play a sound,
            // show the ripple effect
            // this.fire('hss-play-sound', {sound: file});
        }
    }
}
