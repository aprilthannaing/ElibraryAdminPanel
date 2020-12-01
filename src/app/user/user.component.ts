import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IntercomService } from '../framework/intercom.service';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.styl']
})
export class UserComponent implements OnInit {
  json:any = this.userObj();
  userObj(){ 
      return { "boId": "", "name" : "", "email":"", "phoneNo":"","type":"","hlutawType":"","deptType":"","positionType":"","status":"","roleType":""
  }
}
lov: any = {
  "refHluttaw"  : [{ "value": "", "caption": "" }],
  "refDept"     : [{ "value": "", "caption": "" }],
  "refPosition" : [{ "value": "", "caption": "" }],
  "refStatus"   : [{ "value": "NEW", "caption": "NEW" },{ "value": "ACTIVE", "caption": "ACTIVE" },{ "value": "EXPIRED", "caption": "EXPIRED" }],
  "refUserType" : [{ "value": "", "caption": "" },{ "value": "Representative", "caption": "Representative" },{ "value": "Staff", "caption": "Staff" }],
  "refRole"     : [{ "value": "", "caption": "" },{ "value": "Admin", "caption": "Admin" },{ "value": "SuperLibrarian", "caption": "Supervisor Librarian" },
                    { "value": "Librarian", "caption": "Librarian" },{ "value": "User", "caption": "User" }],
};

constructor(
  private router: Router,
  private http: HttpClient,
  private route: ActivatedRoute,
  private ics: IntercomService
) { 
}

ngOnInit() {
    this.route.params.subscribe(params => {
      let cmd = params['cmd'];
      if (cmd != null && cmd != "" && cmd == "read") {
        let id = params['id'];
        this.goReadByKey(id);
      }
    });
    this.json.status = this.lov.refStatus[0].value;
    this.getHluttaw();
    this.getPosition();
  }

  goReadByKey(id){
    const url = this.ics.apiRoute + '/user/selectUserbykey';
    try {
        this.http.post(url,id).subscribe(
            (data:any) => {
                if (data != null && data != undefined) {
                    this.json = data;
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

getHluttaw() {
  const url = this.ics.apiRoute + '/setUp/getHluttaw';
  const json = {"":""}
  try {
      this.http.post(url,json).subscribe(
          (data:any) => {
              if (data != null && data != undefined) {
                  this.lov.refHluttaw = data.refHluttaw;
                  if(this.json.hlutawType == "")
                    this.json.hlutawType=this.lov.refHluttaw[0].value;
                  this.getDepartment();
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
  const url = this.ics.apiRoute + '/setUp/getDepartment';
  try {
      this.http.post(url,this.json.hlutawType).subscribe(
          (data:any) => {
              if (data != null && data != undefined) {
                  this.lov.refDept = data.refDept;
                  if(this.json.deptType == "")
                  this.json.deptType=this.lov.refDept[0].value;
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
  const url = this.ics.apiRoute + '/setUp/getPosition';
  const json = {"":""}
  try {
      this.http.post(url,json).subscribe(
          (data:any) => {
              if (data != null && data != undefined) {
                  this.lov.refPosition = data.refPosition;
                  if(this.json.positionType == "")
                    this.json.positionType=this.lov.refPosition[0].value;
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

goSave() {
    if(this.json.type === 'Representative' ){
        this.json.deptType = this.lov.refDept[0].value;
        this.json.positionType = this.lov.refPosition[0].value;
    }else{

    }
  const url = this.ics.apiRoute + '/user/setuserinfo';
  try {
      this.http.post(url,this.json).subscribe(
          (data:any) => {
              if (data != null && data != undefined) {
                    this.json = data;
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

changeModule() {
  this.getDepartment();
}
goList(){
    this.router.navigate(['userList']);  
}
goSetup(id){
    this.router.navigate(['setup', 'read', id]);
}
goNew() {
    this.router.navigate(['user']);
}
goUpload(){
    this.router.navigate(['user-upload']);
}

}
