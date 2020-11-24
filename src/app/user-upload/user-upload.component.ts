import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-user-upload',
  templateUrl: './user-upload.component.html',
  styleUrls: ['./user-upload.component.styl']
})
export class UserUploadComponent implements OnInit {
  data:[][];
  reqData:any;
  lov: any = {
    "refHluttaw": [{ "value": "", "caption": "" }],
    "refDept": [{ "value": "", "caption": "" }],
    "refPosition": [{ "value": "", "caption": "" }],
  };
  constructor(
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.getHluttaw();
    this.getDepartment();
    this.getPosition();
  }
  onFileChange(evt:any){
    const target:DataTransfer =<DataTransfer>(evt.target);

    if(target.files.length != 1) throw new Error("Cannot use multiple files");
    const reader :FileReader = new FileReader();

    reader.onload = (e:any) =>{
      const bstr   : string         = e.target.result;
      const wb     : XLSX.WorkBook  = XLSX.read(bstr, {type: 'binary'});
      const wsname : string         = wb.SheetNames[0];
      const ws     : XLSX.WorkSheet = wb.Sheets[wsname];
      console.log(ws);

      this.data = (XLSX.utils.sheet_to_json(ws,{header: 1}))
      this.data = this.data.splice(1, this.data.length);
      console.log(this.data);
    };
    reader.readAsBinaryString(target.files[0]);
  }
  getHluttaw() {
    const url = 'http://localhost:8080/setUp/getHluttaw';
    const json = {"":""}
    try {
        this.http.post(url,json).subscribe(
            (data:any) => {
                if (data != null && data != undefined) {
                    this.lov.refHluttaw = data.refHluttaw;
                    //let obj=this.lov.refHluttaw[0].value;
                   // this.getDepartment(obj);
                }
            },
            error => {
                if (error._body.type == 'error') {
                    alert("Connection Timed Out!");
                }
                else {
  
                }
            }, () => { });
    } catch (e) {
        alert(e);
    }
  }
  
  getDepartment() {
    const url = 'http://localhost:8080/setUp/getDepartmentAll';
    const json = {"":""}
    try {
        this.http.post(url,json).subscribe(
            (data:any) => {
                if (data != null && data != undefined) {
                  this.lov.refDept = data.refDept;
                  // for(let j = 0; j< data.refDept.length; j++){
                  //   for(let i = 0; i< this.lov.refHluttaw.length; i++){
                  //     if(this.lov.refHluttaw[i].value == data.refDept[j].joinid)
                  //     this.lov.refDept[j] = data.refDept[j];
                  //   }
                  // }
              }
            },
            error => {
                if (error._body.type == 'error') {
                    alert("Connection Timed Out!");
                }
                else {
  
                }
            }, () => { });
    } catch (e) {
        alert(e);
    }
  }
  
  getPosition() {
    const url = 'http://localhost:8080/setUp/getPosition';
    const json = {"":""}
    try {
        this.http.post(url,json).subscribe(
            (data:any) => {
                if (data != null && data != undefined) {
                    this.lov.refPosition = data.refPosition;
                }
            },
            error => {
                if (error._body.type == 'error') {
                    alert("Connection Timed Out!");
                }
                else {
  
                }
            }, () => { });
    } catch (e) {
        alert(e);
    }
  }
  goSave(){
    this.Validation();
  }
  Validation(){
    this.reqData = this.data;
    for(let i = 0; i<this.lov.refHluttaw.length; i++){
      for(let j = 0; j<this.reqData.length; j++){
        if(this.lov.refHluttaw[i].caption == this.reqData[j][3]){
          this.reqData[j][3] = this.lov.refHluttaw[i].value;

          for(let k = 0; k<this.lov.refDept.length; k++){
                if( this.reqData[j][3] == this.lov.refDept[k].joinid ){
                  if(this.lov.refDept[k].caption == this.reqData[j][4])
                  this.reqData[j][4] = this.lov.refDept[k].value;
              }
            }
          }
        }
      }
      for(let i = 0; i<this.lov.refPosition.length; i++){
        for(let j = 0; j< this.reqData.length; j++){
          if(this.lov.refPosition[i].caption == this.reqData[j][5])
          this.reqData[j][5] = this.lov.refPosition[i].value;
        }
      }
    }
//checkbox
task = {
  name: 'Indeterminate',
  completed: false,
  color: 'primary',
  subtasks: [
    {name: 'Primary', completed: false, color: 'primary'},
    {name: 'Accent', completed: false, color: 'accent'},
  ]
};

allComplete: boolean = false;

updateAllComplete() {
  this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
}

someComplete(): boolean {
  if (this.task.subtasks == null) {
    return false;
  }
  return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
}

setAll(completed: boolean) {
  this.allComplete = completed;
  if (this.task.subtasks == null) {
    return;
  }
  this.task.subtasks.forEach(t => t.completed = completed);
}
}
