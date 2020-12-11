import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IntercomService } from '../framework/intercom.service';
@Component({
  selector: 'app-user-status-change',
  templateUrl: './user-status-change.component.html',
  styleUrls: ['./user-status-change.component.styl']
})
export class UserStatusChangeComponent implements OnInit {
  checkArrayList:any = [];
  loading = false;
  date:any;
  maxDate:any;
  minDate:any;
  dateobj: { date: { year: number, month: number, day: number } };
  jsonReq = {"searchText":"","text1":"", "text2":"", "text3":"","fromDate":"","toDate":""}
  userObj:any = {};

  constructor( 
    private router: Router,
    private http: HttpClient,
    private ics: IntercomService
    ) { }
    

  ngOnInit(): void {
    this.Searching();
  }
  Searching(){
    if(this.jsonReq.fromDate != ""){
        this.jsonReq.fromDate = this.convert(this.jsonReq.fromDate);
    }
    if(this.jsonReq.toDate != ""){
        this.jsonReq.toDate = this.convert(this.jsonReq.toDate);
    }
    const url = this.ics.apiRoute + '/user/selectUserInfobyStatus';
    this.loading = true;
    try {
        this.http.post(url,this.jsonReq).subscribe(
            (data:any) => {
                if (data != null && data != undefined) {
                  this.userObj = data;
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

  convert(str) {
      var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
      return [date.getFullYear(), mnth, day].join("-");
    }
    goApprove(){
      let valid = false;
      if(this.checkArrayList.length > 0){
        for(let i=0;i< this.checkArrayList.length;i++){
          if(this.userObj[i].flag){
            valid = true;
            this.goChangeStatusURL();
            return;
          } 
        }
        if(!valid)
          this.showMessage("At least one checkbox must be selected.",false);
      }else{
        this.showMessage("No file chosen.",false);
      }
    }
    goChangeStatusURL(){
      this.loading = true;
      const url = this.ics.apiRoute + '/user/changeStatus?sessionId=' + this.ics.token;
      this.loading = true;
      try {
          this.http.post(url,this.checkArrayList).subscribe(
              (data:any) => {
                  if (data != null && data != undefined) {
                    if(data.code == "001")
                      this.showMessage(data.desc,false);
                    else{
                      this.Searching();
                      this.showMessage(data.desc,true);
                    }
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
  changeType(event, obj, j) {
    if (event.target.checked) {
        this.checkArrayList.push(obj.boId);
    }else{
      this.checkArrayList.splice(this.checkArrayList.indexOf(j),1);
    }
  }
  selectAllChk(event) {
    this.checkArrayList = [];
    if (event) {
      for(let i=0; i< this.userObj.length; i++){
        this.checkArrayList.push(this.userObj[i].boId);
        this.userObj[i].flag = true;
      }
      
    }else{
      for(let i=0; i< this.userObj.length; i++){
        this.checkArrayList.splice(this.checkArrayList.indexOf(i),1);
        this.userObj[i].flag = false;
      }
    }
  }
  showMessage(msg, bool) {
    if (bool == true) { this.ics.sendBean({ "t1": "rp-alert", "t2": "success", "t3": msg }); }
    if (bool == false) { this.ics.sendBean({ "t1": "rp-alert", "t2": "warning", "t3": msg }); }
    if (bool == undefined) { this.ics.sendBean({ "t1": "rp-alert", "t2": "primary", "t3": msg }); }
  }
  goRefresh(){
    this.Searching();
  }
  
}
