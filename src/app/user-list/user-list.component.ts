import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IntercomService } from '../framework/intercom.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.styl'],
  providers:[DatePipe]
})
export class UserListComponent implements OnInit {
  sub:any;
  loading = false;
  date:any;
  maxDate:any;
  minDate:any;
  dateobj: { date: { year: number, month: number, day: number } };
  jsonReq = {"searchText":"","text1":"", "text2":"", "text3":"","fromDate":"","toDate":"","currentpage":""}
  userObj:any = {};
  lov: any = {
    "refHluttaw": [{ "value": "", "caption": "" }],
    "refDept": [{ "value": "", "caption": "" }],
    "refPosition": [{ "value": "", "caption": "" }],
    "refStatus": [{ "value": "NEW", "caption": "new" },{ "value": "ACTIVE", "caption": "active" },{ "value": "EXPIRED", "caption": "expired" }],
    "refUserType": [{ "value": "Representative", "caption": "representative" },{ "value": "Staff", "caption": "staff" }],
  };

  config: any;
  currentPage: string;

  constructor( 
    private router: Router,
    private http: HttpClient,
    private ics: IntercomService,
    public datePipe: DatePipe
    ) {
        this.config = {
            itemsPerPage: 10,
            currentPage: this.currentPage,
            totalItems: 0,
        }
     }

  ngOnInit(): void {
    this.currentPage = "1";
    this.config.currentPage = this.currentPage;
    this.Searching();
    this.getHluttaw();
    this.getPosition();
  }
  goBack(){
    this.router.navigate(['/user']);  
  }
  Searching(){
    this.jsonReq.currentpage = this.config.currentPage;
    if(this.jsonReq.fromDate != ""){
        this.jsonReq.fromDate = this.convert(this.jsonReq.fromDate);
    }
    if(this.jsonReq.toDate != ""){
        this.jsonReq.toDate = this.convert(this.jsonReq.toDate);
    }
    const url = this.ics.apiRoute + '/user/selectUserInfo';
    this.loading = true;
    console.log(this.jsonReq)
    try {
        this.http.post(url,this.jsonReq).subscribe(
        
            (data:any) => {
                if (data != null && data != undefined) {
                    this.userObj = data.users;
                    for(let user of this.userObj){
                        user.modifiedDate = this.datePipe.transform(user.modifiedDate, 'dd/MM/yyyy');
                    }
                    this.config.totalItems = data.totalCount;
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
        this.loading = false;
        alert(e);
    }
  }
  searchKeyup(e: any) {
    if (e.which == 13) {
      this.Searching();
    }
  }
  pageChanged(event){
    this.config.currentPage = event;
    this.Searching();
  }
  goto(key){
    this.router.navigate(['/user', 'read', key]);
  }

  getHluttaw() {
    const url = this.ics.apiRoute + '/setUp/getHluttaw';
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
  
  getDepartment(obj) {
    const url = this.ics.apiRoute + '/setUp/getDepartment';
    try {
        this.http.post(url,obj).subscribe(
            (data:any) => {
                if (data != null && data != undefined) {
                    this.lov.refDept = data.refDept;
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
                    //this.jsonReq.positionType=this.lov.refPosition[0].value;
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
  changeHluttaw(event) {
        let options = event.target.options;
        let k = options.selectedIndex;
        let value = options[options.selectedIndex].value;
        for (let i = 0; i < this.lov.refHluttaw.length; i++) {
            if(value == this.lov.refHluttaw[i].value){
                if(this.lov.refHluttaw[i].caption === "")
                this.jsonReq.text1 = "";
            }
        }
        this.getDepartment(value);
    }
    changeDepartment(event) {
        let options = event.target.options;
        let k = options.selectedIndex;
        let value = options[options.selectedIndex].value;
        for (let i = 0; i < this.lov.refDept.length; i++) {
            if(value == this.lov.refDept[i].value){
                if(this.lov.refDept[i].caption === "")
                this.jsonReq.text2 = "";
            }
        }
    }
    changePosition(event) {
        let options = event.target.options;
        let k = options.selectedIndex;
        let value = options[options.selectedIndex].value;
        for (let i = 0; i < this.lov.refPosition.length; i++) {
            if(value == this.lov.refPosition[i].value){
                if(this.lov.refPosition[i].caption === "")
                this.jsonReq.text3 = "";
            }
        }
    }
    convert(str) {
        var date = new Date(str),
          mnth = ("0" + (date.getMonth() + 1)).slice(-2),
          day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
      }

}
