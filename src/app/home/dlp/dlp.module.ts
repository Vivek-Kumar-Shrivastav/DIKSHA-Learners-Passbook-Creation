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
import { SummariserService } from './summariser/summariser.service';
import { SelectDocsComponent } from './select-docs/select-docs.component';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [
    UserComponent,
    CertificateComponent,
    CoCurricularComponent,
    ExtraCurricularComponent,
    TableComponent,
    DlpComponent,
    SummariserComponent,
    SelectDocsComponent,
    LoaderComponent,
  ],
  imports: [CommonModule, FormsModule, FileSaverModule],
  exports: [DlpComponent],
  providers: [SummariserService]
})
export class DLPModule {}
