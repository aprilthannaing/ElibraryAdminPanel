import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.styl']
})
export class UserListComponent implements OnInit {
  date:any;
  maxDate:any;
  minDate:any;

  jsonReq = {"searchText":"","hlutawType":"", "deptType":"", "positionType":"","fromDate":"","toDate":""}
  userObj:any = {};
  lov: any = {
    "refHluttaw": [{ "value": "", "caption": "" }],
    "refDept": [{ "value": "", "caption": "" }],
    "refPosition": [{ "value": "", "caption": "" }],
    "refStatus": [{ "value": "NEW", "caption": "new" },{ "value": "ACTIVE", "caption": "active" },{ "value": "EXPIRED", "caption": "expired" }],
    "refUserType": [{ "value": "Representative", "caption": "representative" },{ "value": "Staff", "caption": "staff" }],
  };
  constructor( 
    private router: Router,
    private http: HttpClient,
    ) { }

  ngOnInit(): void {
    this.Searching();
    this.getHluttaw();
    this.getPosition();
  }
  goBack(){
    this.router.navigate(['user']);  
  }
  changeModule(event){
    let options = event.target.options;
    let k = options.selectedIndex;//Get Selected Index
    let value = options[options.selectedIndex].value;//Get Selected Index's Value
    this.getDepartment(value);
  }
  Searching(){
    const url = 'http://localhost:8080/user/selectUserInfo';
    try {
        this.http.post(url,this.jsonReq).subscribe(
            (data:any) => {
                if (data != null && data != undefined) {
                  this.userObj = data;
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
  searchKeyup(e: any) {
    if (e.which == 13) {
      this.Searching();
    }
  }
  pageChanged(){

  }
  goto(key){
    this.router.navigate(['user', 'read', key]);
  }

  getHluttaw() {
    const url = 'http://localhost:8080/setUp/getHluttaw';
    const json = {"":""}
    try {
        this.http.post(url,json).subscribe(
            (data:any) => {
                if (data != null && data != undefined) {
                    this.lov.refHluttaw = data.refHluttaw;
                    let obj=this.lov.refHluttaw[0].value;
                    this.getDepartment(obj);
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
  
  getDepartment(obj) {
    const url = 'http://localhost:8080/setUp/getDepartment';
    try {
        this.http.post(url,obj).subscribe(
            (data:any) => {
                if (data != null && data != undefined) {
                    this.lov.refDept = data.refDept;
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
                    //this.jsonReq.positionType=this.lov.refPosition[0].value;
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
}
