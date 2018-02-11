import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


import { AppComponent } from './app.component';
import { ArticlesComponent } from './articles/articles.component';
import { FeedsComponent } from './feeds/feeds.component';
import { EditorComponent } from './editor/editor.component';

import { UiService } from './ui.service';
import { UserService } from './user.service';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './/app-routing.module';
import { UserComponent } from './user/user.component';

@NgModule({
  declarations: [
    AppComponent,
    ArticlesComponent,
    FeedsComponent,
    EditorComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    NgbModule.forRoot(),
  ],
  providers: [UiService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
