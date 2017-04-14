import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {
    MdButtonModule, MdButtonToggleModule, MdIconModule, MdInputModule,
    MdToolbarModule
} from "@angular/material";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { ListComponent } from './list/list.component';

@NgModule({
    declarations: [
        AppComponent,
        ListComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        MdToolbarModule,
        MdButtonModule,
        MdButtonToggleModule,
        MdIconModule,
        MdInputModule,
        BrowserAnimationsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
