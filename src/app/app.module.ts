import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FileSaverModule } from 'ngx-filesaver';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthModule } from './auth/auth.module';
import { DLPModule } from './home/dlp/dlp.module';
import { HomeComponent } from './home/home.component';
import { CredentialsService } from './service/user-credentials.service';
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
    NgxExtendedPdfViewerModule,
  ],
  providers: [CredentialsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
