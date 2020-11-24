import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.styl']
})
export class SetupComponent implements OnInit {
  hlutawType = "";
  formid = "";
  constructor(
  private router: Router,
  private http: HttpClient,
  private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let cmd = params['cmd'];
      if (cmd != null && cmd != "" && cmd == "read") {
        this.formid = params['id'];
        if(this.formid == 'lov2')
          this.getPosition();
        else if(this.formid == 'lov1')
          this.getHluttaw();
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
    const url = 'http://localhost:8080/setUp/getPosition';
    const json = {"":""}
    try {
        this.http.post(url,json).subscribe(
            (data:any) => {
                if (data != null && data != undefined) {
                    this.lov.ref = data.refPosition;
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
  goBack(){
    this.router.navigate(['user']);  
  }
  goSave(){
    if(this.formid=='lov2')
      this.setPosition();
    else
      this.setDepartment();
  }
  setDepartment(){
    const url = 'http://localhost:8080/setUp/departmentSetup';
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

  setPosition(){
    const url = 'http://localhost:8080/setUp/positionSetup';
    let json = {
      "lov": this.lov.ref
    }
    try {
        this.http.post(url,json).subscribe(
            (data:any) => {
                if (data != null && data != undefined) {
                    this.lov.ref = data.lov;
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
    const url = 'http://localhost:8080/setUp/getDepartment';
    try {
        this.http.post(url,this.hlutawType).subscribe(
            (data:any) => {
                if (data != null && data != undefined) {
                    this.lov.ref = data.refDept;
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
    const url = 'http://localhost:8080/setUp/getHluttaw';
    const json = {"":""}
    try {
        this.http.post(url,json).subscribe(
            (data:any) => {
                if (data != null && data != undefined) {
                    this.lov.refHluttaw = data.refHluttaw;
                    if(this.hlutawType == "")
                      this.hlutawType=this.lov.refHluttaw[0].value;
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
  changeModule(){
    this.getDepartment();
  }
}
