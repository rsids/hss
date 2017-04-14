import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {environment} from "../environments/environment";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";

@Injectable()
export class WebsocketService {
    private socket: Subject<MessageEvent>;

    constructor() {
    }

    public connect(): Subject<MessageEvent> {
        if (!this.socket) {
            this.socket = this.create(environment.socketUrl);
        }

        return this.socket;

    }

    private create(url: string): Subject<MessageEvent> {
        let ws = new WebSocket(url);

        let observable = Observable.create(
            (obs: Observer<MessageEvent>) => {
                ws.onmessage = obs.next.bind(obs);
                ws.onerror = obs.error.bind(obs);
                ws.onclose = obs.complete.bind(obs);

                return ws.close.bind(ws);
            });

        let observer = {
            next: (data: Object) => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify(data));
                }
            }
        };

        return Subject.create(observer, observable);
    }

}
