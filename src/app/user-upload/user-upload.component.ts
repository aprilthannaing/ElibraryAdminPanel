import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IntercomService } from '../framework/intercom.service';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';


const FileSaver = require('file-saver');
@Component({
  selector: 'app-user-upload',
  templateUrl: './user-upload.component.html',
  styleUrls: ['./user-upload.component.styl']
})
export class UserUploadComponent implements OnInit {
  comfirmationBox = false;
  loading = false;
  data = [];
  lov: any = {
    "refHluttaw": [{ "value": "", "caption": "" }],
    "refDept": [{ "value": "", "caption": "" }],
    "refPosition": [{ "value": "", "caption": "" }],
    "refconstituency": [{ "value": "", "caption": "" }]
  };
  userArrayList:any = this.getObj();
  checkArrayList:any = [];
  getObj() {
    return {
      "userArray":[]
    }
  }
  userObj = {"constituencyType":"","flag": false,"sessionId":"","boId": "", "name" : "", "email":"", "phoneNo":"","type":"","hlutawType":"","deptType":"","positionType":"","status":"","roleType":""} 
  constructor(
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private ics: IntercomService,
    private confirmationDialogService: ConfirmationDialogService
  ) { }

  ngOnInit(): void {
    this.getHluttaw();
    this.getDepartment();
    this.getPosition();
    this.getConstituency();
  }
  goClear(){
    this.data = [];
    this.userArrayList = this.getObj();
    this.checkArrayList = [];
  }

  selectAllChk(event) {
    this.checkArrayList = [];
    if (event) {
      for(let i=0; i< this.userArrayList.userArray.length; i++){
        this.checkArrayList.push(this.userArrayList.userArray[i]);
        this.userArrayList.userArray[i].flag = true;
      }
      
    }else{
      for(let i=0; i< this.userArrayList.userArray.length; i++){
        this.checkArrayList.splice(this.checkArrayList.indexOf(i),1);
        this.userArrayList.userArray[i].flag = false;
      }
    }
  }
  changeType(event, obj, j) {
    if (event.target.checked) {
        this.checkArrayList.push(obj);
    }else{
      const index = this.checkArrayList.findIndex(list => list.flag == false);
      this.checkArrayList.splice(index,1);
    }
  }
  //old
  onFileChange(evt:any){
      this.checkArrayList = [];
      this.userArrayList = this.getObj();
      const target:DataTransfer =<DataTransfer>(evt.target);
      if(target.files.length != 1) throw new Error("Cannot use multiple files");
      const reader :FileReader = new FileReader();
      reader.onload = (e:any) =>{
        const bstr   : string         = e.target.result;
        const wb     : XLSX.WorkBook  = XLSX.read(bstr, {type: 'binary'});
        const wsname : string         = wb.SheetNames[0];
        const ws     : XLSX.WorkSheet = wb.Sheets[wsname];
        this.data = (XLSX.utils.sheet_to_json(ws,{header: 1}))
        this.data = this.data.splice(1, this.data.length);
        
        //User
        for(let i=0;i<this.data.length;i++){
          this.userObj = {"constituencyType":"","flag": false,"sessionId":"","boId": "", "name" : "", "email":"", "phoneNo":"","type":"","hlutawType":"","deptType":"","positionType":"","status":"","roleType":""} 
    
          for(let j=0;j<this.data[i].length+1;j++){
            if(j==0)
            this.userObj.name  = this.data[i][j];
            else if(j==1)
            this.userObj.email  = this.data[i][j];
            else if(j==2)
            this.userObj.phoneNo  = this.data[i][j];
            else if(j==3)
            this.userObj.hlutawType  = (this.data[i][j]==undefined ? "" : this.data[i][j]);
            else if(j==4)
            this.userObj.deptType  = (this.data[i][j]==undefined ? "" : this.data[i][j]);
            else if(j==5)
            this.userObj.positionType  = (this.data[i][j]==undefined ? "" : this.data[i][j]);
            else if(j==6)
            this.userObj.constituencyType = (this.data[i][j]==undefined ? "" : this.data[i][j]);
            else if(j==7)
            this.userObj.type  = this.data[i][j];
            else
            this.userObj.flag  = false;
          }
          this.userArrayList.userArray.push(this.userObj);
        }
      };
      reader.readAsBinaryString(target.files[0]);
  }
  getHluttaw() {
    const url = this.ics.apiRoute + '/setUp/getHluttaw';
    const json = {"type":""}
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
                if (error.name == "HttpErrorResponse") {
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
    const url = this.ics.apiRoute + '/setUp/getDepartmentAll';
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
                if (error.name == "HttpErrorResponse") {
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
    const url = this.ics.apiRoute + '/setUp/getPosition';
    const json = {"":""}
    try {
        this.http.post(url,json).subscribe(
            (data:any) => {
                if (data != null && data != undefined) {
                    this.lov.refPosition = data.refPosition;
                }
            },
            error => {
                if (error.name == "HttpErrorResponse") {
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
    let valid = false;
    if(this.userArrayList.userArray.length > 0){
      for(let i=0;i< this.userArrayList.userArray.length;i++){
        if(this.userArrayList.userArray[i].flag){
          valid = true;
          this.changeLOV();
          this.saveURL();
          //return;
        } 
      }
      if(!valid)
        this.showMessage("At least one checkbox must be selected.",false);
    }else{
      this.showMessage("No file chosen.",false);
    }
  }
  saveURL(){
    this.loading = true;
    const url = this.ics.apiRoute + '/user/setusers?sessionId=' + this.ics.token;
        try {
            this.http.post(url,this.checkArrayList).subscribe(
                (data:any) => {
                    if (data != null && data != undefined) {
                        if(data.code == "000"){
                          this.showMessage(data.desc,true);
                        }else{
                          this.showMessage(data.desc,false);
                        }
                    }
                    this.loading = false;
                },
                error => {
                    if (error.name == "HttpErrorResponse") {
                      console.log(error.error.message);
                      let errorMessage = error.error.message;
                      let message = errorMessage.substring(errorMessage.indexOf(":")+1,errorMessage.length);
                          message = message.substring(0,message.indexOf(":"));
                      alert(message);
                    }
                    else {

                    }
                    this.loading = false;
                }, () => { });
        } catch (e) {
          this.loading = false;
            alert(e);
        }
  }
    changeLOV(){
      if(this.lov.refHluttaw.length > 0){
        for(let i = 0; i<this.lov.refHluttaw.length; i++){
          for(let j = 0; j<this.checkArrayList.length; j++){
            if(this.lov.refHluttaw[i].caption == this.checkArrayList[j].hlutawType){
              this.checkArrayList[j].hlutawType = this.lov.refHluttaw[i].value;
                for (let k = 0; k < this.lov.refDept.length; k++) {
                  if (this.checkArrayList[j].hlutawType == this.lov.refDept[k].joinid) {
                    if(this.checkArrayList[j].type != "Representative"){
                      if(this.lov.refDept[k].caption == this.checkArrayList[j].deptType)
                        this.checkArrayList[j].deptType = this.lov.refDept[k].value;
                    }else{
                      if(this.lov.refDept[k].code == "0")
                      this.checkArrayList[j].deptType = this.lov.refDept[k].value;
                    }
                  }
                }
                //constituency
                  for (let k = 0; k < this.lov.refconstituency.length; k++) {
                    if (this.checkArrayList[j].hlutawType == this.lov.refconstituency[k].joinid) {
                      if(this.checkArrayList[j].type == "Representative"){
                        if(this.lov.refconstituency[k].caption == this.checkArrayList[j].constituencyType)
                          this.checkArrayList[j].constituencyType = this.lov.refconstituency[k].value;
                      }else{
                        if(this.lov.refconstituency[k].code == "0")
                        this.checkArrayList[j].constituencyType = this.lov.refconstituency[0].value;
                      }
                    }
                  }
            }
          }
        }
        
      }
      for(let i = 0; i<this.lov.refPosition.length; i++){
        for(let j = 0; j< this.checkArrayList.length; j++){
          if(this.checkArrayList[j].type != "Representative"){
            if(this.lov.refPosition[i].caption == this.checkArrayList[j].positionType)
              this.checkArrayList[j].positionType = this.lov.refPosition[i].value;
          }else{
            if(this.lov.refPosition[i].code == "0")
            this.checkArrayList[j].positionType = this.lov.refPosition[i].value;
          }
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
openConfirmationDialog() {
  this.confirmationDialogService.confirm('Please confirm', 'Do you really want to Download ?')
  .then((confirmed) => {
    if(confirmed){
      FileSaver.saveAs('./assets/User.xlsx',"User");
      this.showMessage("Download Successfully!",true);
    } 
  }).catch(() => 
    console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
}

getConstituency() {
  const url = this.ics.apiRoute + '/setUp/getConstituencyAll';
  const json = {"":""}
  try {
      this.http.post(url,json).subscribe(
          (data:any) => {
              if (data != null && data != undefined) {
                this.lov.refconstituency = data.refConst;
            }
          },
          error => {
              if (error.name == "HttpErrorResponse") {
                  alert("Connection Timed Out!");
              }
              else {

              }
          }, () => { });
  } catch (e) {
      alert(e);
  }
}
showMessage(msg, bool) {
  if (bool == true) { this.ics.sendBean({ "t1": "rp-alert", "t2": "success", "t3": msg }); }
  if (bool == false) { this.ics.sendBean({ "t1": "rp-alert", "t2": "warning", "t3": msg }); }
  if (bool == undefined) { this.ics.sendBean({ "t1": "rp-alert", "t2": "primary", "t3": msg }); }
}
}
