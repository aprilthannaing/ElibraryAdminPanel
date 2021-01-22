import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IntercomService } from '../framework/intercom.service';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.styl']
})
export class UserComponent implements OnInit {
  loading = false;
  deleteFlag:boolean = true;
  emailFlag:boolean = false;
  radioFlag:boolean = false;
  json:any = this.userObj();
  userObj(){ 
      return { "sessionId":"","boId": "", "name" : "", "email":"", "phoneNo":"","type":"","hlutawType":"","deptType":"","positionType":"","status":"","roleType":"","permanentAddress":"","currentAddress":"","constituencyType":""
  }
}
lov: any = {
  "refConstituency": [{ "value": "", "caption": "" }],
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
    this.getHluttaw();
    this.getPosition();
}

ngOnInit() {
    this.route.params.subscribe(params => {
      let cmd = params['cmd'];
      if (cmd != null && cmd != "" && cmd == "read") {
        let id = params['id'];
        this.goReadByKey(id);
        this.deleteFlag = false;
        this.emailFlag = true;
      }
    });
    if(this.ics.userRole == "Admin" || this.ics.userRole == "SuperLibrarian")
        this.radioFlag = false;
    else
        this.radioFlag = true;
    this.json.status = this.lov.refStatus[0].value;
  }

  goReadByKey(id){
    this.loading = true;
    const url = this.ics.apiRoute + '/user/selectUserbykey';
    try {
        this.http.post(url,id).subscribe(
            (data:any) => {
                if (data != null && data != undefined) {
                    this.json = data;
                    this.getDepartment();
                    this.getConstituency();
                }
            this.loading = false;
            },
            error => {
                if (error.name == "HttpErrorResponse") {
                    alert("Connection Timed Out!");
                }
                this.loading = false;
            }, () => { });
    } catch (e) {
        alert(e);
        this.loading = false;
    }
  }
changeUserLevel(){
    this.getHluttaw();
}
getHluttaw() {
  const url = this.ics.apiRoute + '/setUp/getHluttaw';
  const json = {"type": ""}
  try {
      this.http.post(url,json).subscribe(
          (data:any) => {
              if (data != null && data != undefined) {
                  this.lov.refHluttaw = data.refHluttaw;
                  if(this.json.type === "Representative"){
                    const index = this.lov.refHluttaw.findIndex(list => list.value == 2);
                    this.lov.refHluttaw.splice(index,1);
                  }
                  if(this.json.hlutawType == "")
                    this.json.hlutawType=this.lov.refHluttaw[0].value;
                this.getDepartment();
                this.getConstituency();
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
  const url = this.ics.apiRoute + '/setUp/getDepartment';
  try {
      this.http.post(url,this.json.hlutawType).subscribe(
          (data:any) => {
              if (data != null && data != undefined) {
                  this.lov.refDept = data.refDept;
                  for(let i = 0; i< this.lov.refDept.length; i++){
                    if(this.lov.refDept[i].status == "INACTIVE"){
                        this.lov.refDept.splice(i,1);
                        i--;
                    }
                  }
                  if(this.json.deptType == "")
                  this.json.deptType=this.lov.refDept[0].value;
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
                  if(this.json.positionType == "")
                    this.json.positionType=this.lov.refPosition[0].value;
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
goDelete(){
    this.loading = true;
    this.json.sessionId = this.ics.token;
    if(this.json.boId == ""){
        console.log("User Id not Found");
        this.showMessage("User Id not Found",false);   
    }else{
        const url = this.ics.apiRoute + '/user/deleteUserinfo';
        try {
            this.http.post(url,this.json).subscribe(
                (data:any) => {
                    this.loading = false;
                    if (data != null && data != undefined) {
                        if(data.code == "000"){
                            this.goNew();
                            this.showMessage(data.desc,true);   
                        }else
                            this.showMessage(data.desc,false);   
                        console.log(data.desc);
                      
                    }
                },
                error => {
                    this.loading = false;
                    if (error.name == "HttpErrorResponse") {
                        alert("Connection Timed Out!");
                    }
                    else {
      
                    }
                }, () => { });
        } catch (e) {
            this.loading = false;
            alert(e);
        }
    }
}
goSave(){
    this.json.sessionId = this.ics.token;
    console.log("session Id : " ,this.ics.token)
    if(this.json.name === ""){
        this.showMessage("Please fill correct User Name",false);   
        console.log("Please fill correct User Name");
        return false;
    }
    if(this.json.email === ""){
        this.showMessage("Please fill correct User Email",false);   
        console.log("Please fill correct User Email");
        return false;
    }
    if(this.json.phoneNo === ""){
        this.showMessage("Please fill correct User Phone No",false);   
        console.log("Please fill correct User Phone No");
        return false;
    }
    if(this.json.roleType === ""){
        this.showMessage("Choose User Role",false);   
        console.log("Choose User Role");
        return false;
    }

    if(this.json.type === ""){
        this.showMessage("Choose User Level",false);   
        console.log("Choose User Level");
        return false;
    }
    if(this.json.hlutawType === 1){
        this.showMessage("Choose Hlutaw Type",false); 
        console.log("Choose hlutaw Type");
        return false;
    }
    if(this.json.type === 'Representative' ){
        if(this.json.constituencyType === ''){
            this.showMessage("Choose Constituency Type",false); 
            console.log("Choose department Type");
            return false;
        }
        this.json.deptType = this.lov.refDept[0].value;
        this.json.positionType = this.lov.refPosition[0].value;
    }else{
        if(this.json.deptType === ''){
            this.showMessage("Choose Department Type",false); 
            console.log("Choose department Type");
            return false;
        }
        if(this.json.positionType === ''){
            this.showMessage("Choose Position Type",false); 
            console.log("Choose position Type");
            return false;
        }

        this.json.constituencyType = this.lov.refConstituency[0].value;
    }
    if(this.json.currentAddress === "" || this.json.currentAddress === null ){
        this.showMessage("Please fill correct Current Address",false); 
        return false;
    }
    if(this.json.permanentAddress === "" || this.json.permanentAddress === null ){
        this.showMessage("Please fill correct Permanent Address",false); 
        return false;
    }
        this.goSaveURL();
}
goSaveURL() {
    this.loading = true;
    const url = this.ics.apiRoute + '/user/setuserinfo';
  try {
      this.http.post(url,this.json).subscribe(
          (data:any) => {
            this.loading = false;
              if (data != null && data != undefined) {
                  if(data.code == "000"){
                    this.deleteFlag = false;
                    this.json = data.userList;
                    this.showMessage(data.desc,true);
                  }else{
                    this.showMessage(data.desc,false);
                  }
                   
                console.log(data.desc);
              }
          },
          error => {
            this.loading = false;
              if (error.name == "HttpErrorResponse") {
                  alert("Connection Timed Out!");
              }
              else {

              }
          }, () => { });
  } catch (e) {
    this.loading = false;
      alert(e);
  }
}
getConstituency() {
    const url = this.ics.apiRoute + '/setUp/getConstituency';
    try {
        this.http.post(url,this.json.hlutawType).subscribe(
            (data:any) => {
                if (data != null && data != undefined) {
                    this.lov.refConstituency = data.refConst;
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

changeModule() {
   // if(this.json.type === "Representative")
   // else
    this.getConstituency();
    this.getDepartment();
}
goList(){
    this.router.navigate(['/userList']);  
}
goSetup(id){
    this.router.navigate(['/setup', 'read', id]);
}
goNew() {
    this.json = this.userObj();
    this.emailFlag = false;
    this.json.status = this.lov.refStatus[0].value;
    //this.router.navigate(['/user']);
}
goUpload(){
    this.router.navigate(['/user-upload']);
}
showMessage(msg, bool) {
    if (bool == true) { this.ics.sendBean({ "t1": "rp-alert", "t2": "success", "t3": msg }); }
    if (bool == false) { this.ics.sendBean({ "t1": "rp-alert", "t2": "warning", "t3": msg }); }
    if (bool == undefined) { this.ics.sendBean({ "t1": "rp-alert", "t2": "primary", "t3": msg }); }
}
}
