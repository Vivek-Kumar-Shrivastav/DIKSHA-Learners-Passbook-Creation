import { Component, OnInit, EventEmitter, Output} from '@angular/core';
import { DataBaseService } from 'src/app/service/data-base.service';

interface file{
  index: number;
  name : string;
  uri : string;
}

@Component({
  selector: 'app-select-docs',
  templateUrl: './select-docs.component.html',
  styleUrls: ['./select-docs.component.css']
})

export class SelectDocsComponent implements OnInit{
  @Output() commandEvent = new EventEmitter<number[]>();
  
   fileIndexUri : file[] = [];
   selectedFiles : number[] = [];
   constructor(private _dataBaseService : DataBaseService){}
   

   async ngOnInit() { 
      this.fileIndexUri = await this._dataBaseService.getIndexAndUri();
   }

   toggleSelection(index: number) {
    // Toggle the selection of the checkbox index
    if (this.selectedFiles.includes(index)) {
      this.selectedFiles = this.selectedFiles.filter(item => item !== index);
    } else {
      this.selectedFiles.push(index);
    }
  }

  generateNewDlp() {
    // This method is called when the "Show Selected Options" button is clicked
    console.log('Selected Options:', this.selectedFiles);
    this.commandEvent.emit(this.selectedFiles);
    // You can perform further actions with the selected options here
  }
}
