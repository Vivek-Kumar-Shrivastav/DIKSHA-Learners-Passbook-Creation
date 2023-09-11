import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FileSaverModule } from 'ngx-filesaver';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthModule } from './auth/auth.module';
import { DLPModule } from './home/dlp/dlp.module';
import { DlpComponent } from './home/dlp/dlp.component';
import { HomeComponent } from './home/home.component';
import { UserDataService } from './service/user-data.service';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';



@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AuthModule,
    DLPModule,
    HttpClientModule,
    FileSaverModule,
    NgxExtendedPdfViewerModule
  ],
  providers: [UserDataService],
  bootstrap: [AppComponent],
})
export class AppModule {}
