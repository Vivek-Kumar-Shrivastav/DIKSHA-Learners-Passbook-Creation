import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthModule } from './auth/auth.module';
import { DLPModule } from './home/dlp/dlp.module';
import { DlpComponent } from './home/dlp/dlp.component';
import { HomeComponent } from './home/home.component';
import { UserDataService } from './service/user-data.service';


@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AuthModule,
    DLPModule,
    HttpClientModule,
  ],
  providers: [UserDataService],
  bootstrap: [AppComponent],
})
export class AppModule {}
