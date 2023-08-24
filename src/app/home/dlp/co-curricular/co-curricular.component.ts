import { Component, Input } from '@angular/core';
import { Subject } from '../../HelperInterfaces/CertificateData';

@Component({
  selector: 'app-co-curricular',
  templateUrl: './co-curricular.component.html',
  styleUrls: ['./co-curricular.component.css']
})
export class CoCurricularComponent {
  @Input() certificate : string ="";
  @Input() subjects : Subject[] = [];
}
