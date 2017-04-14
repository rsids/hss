import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {environment} from "../environments/environment";
import 'rxjs/add/operator/map';
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {WebsocketService} from "./websocket.service";

@Injectable()
export class SoundsService {

    constructor(private http: Http, private ws: WebsocketService) {
        this.hss = <Subject<any>>this.ws.connect()
            .map((response: MessageEvent) => {
                let data = JSON.parse(response.data);
                return data;
            });
    }

    public clientId:number;
    public hss: Subject<any>;


    getSounds(): Observable<any> {
        return this.http.get(`${environment.serverUrl}/getSounds.php`)
            .map(data => {
                let result = data.json();

                if (result.status === 200) {
                    return result.result.map(item => {
                        return {
                            sound: item[0],
                            title: item[1]
                        }
                    });
                }
                throw new Error('Could not get sounds')
            })
    }
}
