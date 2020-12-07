import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IntercomService } from '../framework/intercom.service';

@Component({
  selector: 'app-user-forgot-password2',
  templateUrl: './user-forgot-password2.component.html',
  styleUrls: ['./user-forgot-password2.component.styl']
})
export class UserForgotPassword2Component implements OnInit {
  _result: string = "";
  newpwd1: string = "";
  newpwd : string = "";
  loading= false;
  constructor(
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private ics: IntercomService
  ) { }

  ngOnInit(): void {
  }
  goResetPassword(){
    this._result = "";
    if(this.newpwd != this.newpwd1){
      this._result = "Your new password and confirm password must be same.";
    }
    if(this._result == ""){
      this.loading = true;
       const url = this.ics.apiRoute + '/user/goResetPassword';
       let json = {
         "newpwd": this.newpwd,
         "sessionId": this.ics.sessionId
       }
       try {
           this.http.post(url,json).subscribe(
               (data:any) => {
                 this.loading = false;
                   if (data != null && data != undefined) {
                       if(data.code ==="001")
                         this._result = data.desc;
                       else{
                        this.showMessage("Password changed Successfully",true);
                         this.router.navigate(['login']); 
                       }
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
   showMessage(msg, bool) {
    if (bool == true) { this.ics.sendBean({ "t1": "rp-alert", "t2": "success", "t3": msg }); }
    if (bool == false) { this.ics.sendBean({ "t1": "rp-alert", "t2": "warning", "t3": msg }); }
    if (bool == undefined) { this.ics.sendBean({ "t1": "rp-alert", "t2": "primary", "t3": msg }); }
  }
}
