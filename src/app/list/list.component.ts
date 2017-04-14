import {Component, OnInit} from '@angular/core';
import {SoundsService} from "../sounds.service";

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

    sounds: Array<any> = [];

    constructor(private soundService: SoundsService) {

    }

    playSound(sound: any): void {
        this.soundService.hss.next({
            action: 'playSound',
            data: sound.sound,
            clientId: this.soundService.clientId
        })
    }

    ngOnInit() {
        this.soundService.getSounds().subscribe(data => {
            this.sounds = data;
            this.soundService.hss.next({action: 'registerClient'});
        });
    }

}
