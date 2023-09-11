import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { CertificateComponent } from './certificate/certificate.component';
import { CoCurricularComponent } from './co-curricular/co-curricular.component';
import { TableComponent } from './table/table.component';
import { FormsModule } from '@angular/forms';
import { DlpComponent } from './dlp.component';
import { ExtraCurricularComponent } from './extra-curricular/extra-curricular.component';
import { FileSaverModule } from 'ngx-filesaver';
import { SummariserComponent } from './summariser/summariser.component';

@NgModule({
  declarations: [
    UserComponent,
    CertificateComponent,
    CoCurricularComponent,
    ExtraCurricularComponent,
    TableComponent,
    DlpComponent,
    SummariserComponent,
  ],
  imports: [CommonModule, FormsModule, FileSaverModule, SummariserComponent],
  exports: [DlpComponent],
})
export class DLPModule {}
