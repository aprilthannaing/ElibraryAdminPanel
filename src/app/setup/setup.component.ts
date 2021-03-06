import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IntercomService } from '../framework/intercom.service';
@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.styl']
})
export class SetupComponent implements OnInit {
  loading = false;
  hlutawType = "";
  formid = "";
  title = "";
  constructor(
  private router: Router,
  private http: HttpClient,
  private route: ActivatedRoute,
  private ics: IntercomService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let cmd = params['cmd'];
      if (cmd != null && cmd != "" && cmd == "read") {
        this.formid = params['id'];
        if(this.formid == 'lov2'){
            this.getPosition();
            this.title = "Position Setup Form"
        }
        else if(this.formid == 'lov1'){
            this.title = "Department Setup Form";
            this.getHluttawByDept();
        }
        else if(this.formid == 'lov3'){
            this.title = "Constituency Setup Form";
            this.getHluttawByConst();
        }
      }
    });
  
  }
  lov: any = {
    "ref": [{ "value": "", "caption": "","code":"","status":"" }],
  };
  goRemove(value){
    for(let i = 0; i < this.lov.ref.length; i++){
      if(this.lov.ref[i].value== value)
       this.lov.ref[i].status = "INACTIVE";
      if(this.lov.ref[i].value== "")
      this.lov.ref.splice(this.lov.ref.length, 1);
    }
    
  }
  addLov(){
    let maxsrno = this.lov.ref.length;
    maxsrno = maxsrno + 1;
    this.lov.ref.push({ "value": "", "caption": "","code":"","status":"" });
  
  }
  getPosition() {
    const url = this.ics.apiRoute + '/setUp/getPosition';
    const json = {"":""}
    try {
        this.http.post(url,json).subscribe(
            (data:any) => {
                if (data != null && data != undefined) {
                    this.lov.ref = data.refPosition;
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
  goBack(){
    this.router.navigate(['user']);  
  }
  goSave(){
    if(this.formid=='lov2')
      this.setPosition();
    else if(this.formid=='lov1')
      this.setDepartment();
    else if(this.formid=='lov3')
        this.setConstituency();
  }
  setDepartment(){
    this.loading = true;
    const url = this.ics.apiRoute + '/setUp/departmentSetup';
    let json = {
        "code": this.hlutawType,
        "lov": this.lov.ref
      }
    try {
        this.http.post(url,json).subscribe(
            (data:any) => {
                if (data != null && data != undefined) {
                    this.lov.ref = data.lov;
                }
                this.loading = false;
                this.showMessage("Insert Successfully",true);
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

  setPosition(){
    this.loading = true;
    const url = this.ics.apiRoute + '/setUp/positionSetup';
    let json = {
      "lov": this.lov.ref
    }
    try {
        this.http.post(url,json).subscribe(
            (data:any) => {
                if (data != null && data != undefined) {
                    this.lov.ref = data.lov;
                }
                this.loading = false;
                this.showMessage("Insert Successfully",true);
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

  getDepartment() {
    const url = this.ics.apiRoute + '/setUp/getDepartment';
    try {
        this.http.post(url,this.hlutawType).subscribe(
            (data:any) => {
                if (data != null && data != undefined) {
                    this.lov.ref = data.refDept;
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

  getHluttawByDept() {
    const url = this.ics.apiRoute + '/setUp/getHluttaw';
    const json = {"type":""}
    try {
        this.http.post(url,json).subscribe(
            (data:any) => {
                if (data != null && data != undefined) {
                    this.lov.refHluttaw = data.refHluttaw;
                    if(this.hlutawType == "")
                      this.hlutawType=this.lov.refHluttaw[1].value;
                    this.getDepartment();
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
  changeModule(){
      if(this.formid == 'lov1')
        this.getDepartment();
    else if(this.formid == 'lov3')
    this.getConstituency();
  }
  setConstituency(){
    this.loading = true;
    const url = this.ics.apiRoute + '/setUp/constituencySetup';
    let json = {
        "code": this.hlutawType,
        "lov": this.lov.ref
      }
    try {
        this.http.post(url,json).subscribe(
            (data:any) => {
                if (data != null && data != undefined) {
                    this.lov.ref = data.lov;
                }
                this.loading = false;
                this.showMessage("Insert Successfully",true);
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
  getConstituency() {
    const url = this.ics.apiRoute + '/setUp/getConstituency';
    try {
        this.http.post(url,this.hlutawType).subscribe(
            (data:any) => {
                if (data != null && data != undefined) {
                    this.lov.ref = data.refConst;
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
  getHluttawByConst() {
    const url = this.ics.apiRoute + '/setUp/getHluttaw';
    //const json = {"type":"representative"}
    const json = {"type":""}
    try {
        this.http.post(url,json).subscribe(
            (data:any) => {
                if (data != null && data != undefined) {
                    this.lov.refHluttaw = data.refHluttaw;
                    if(this.hlutawType == "")
                      this.hlutawType=this.lov.refHluttaw[1].value;
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
  showMessage(msg, bool) {
    if (bool == true) { this.ics.sendBean({ "t1": "rp-alert", "t2": "success", "t3": msg }); }
    if (bool == false) { this.ics.sendBean({ "t1": "rp-alert", "t2": "warning", "t3": msg }); }
    if (bool == undefined) { this.ics.sendBean({ "t1": "rp-alert", "t2": "primary", "t3": msg }); }
  }
}
