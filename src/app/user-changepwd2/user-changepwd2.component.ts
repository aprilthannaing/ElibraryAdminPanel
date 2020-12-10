import { Component, OnInit, SystemJsNgModuleLoader } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IntercomService } from '../framework/intercom.service';
@Component({
  selector: 'app-user-changepwd2',
  templateUrl: './user-changepwd2.component.html',
  styleUrls: ['./user-changepwd2.component.styl']
})
export class UserChangepwd2Component implements OnInit {
  loading = false;
  _result: string = "";
  newpwd1: string = "";
  newpwd : string = "";
  oldpwd : string = "";
  constructor(
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private ics: IntercomService
  ) { }

  ngOnInit(): void {
  }
  goChangePwd(){
    this._result = "";
    if(this.goValidation()){
      this.loading = true;
       const url = this.ics.apiRoute + '/user/goChangepwd';
       let json = {
         "old_password": this.oldpwd,
         "new_password": this.newpwd,
         "email": this.ics.email
       }
       try {
           this.http.post(url,json,{headers: new HttpHeaders().set('token', this.ics.token)}).subscribe(
               (data:any) => {
                   if (data != null && data != undefined) {
                       if(!data.status)
                         this.showMessage(data.message,false);
                       else{
                         this.showMessage("Password changed Successfully!\nPlease login again.",true);
                         this.router.navigate(['login']); 
                       }
                   }
                   this.loading = false;
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
    }else{
      this.showMessage(this._result,false);
    }
    
   }
   goValidation(){
     if(this.oldpwd === ""){
       this._result = "Please enter your old password";
       return false;
     }
     if(this.newpwd === ""){
      this._result = "Please enter your new password.";
      return false;
     }
     if(this.newpwd1 === ""){
      this._result = "Please confirm your new password.";
      return false;
     }
     if(this.newpwd != this.newpwd1){
      this._result = "your new password must be same with your confirm password.";
      return false;
     }
     if(this.oldpwd === this.newpwd){
       this._result = "Your new password cannot be the same as your old password. Please enter a different password";
       return false;
      }
      return true;
   }
   showMessage(msg, bool) {
    if (bool == true) { this.ics.sendBean({ "t1": "rp-alert", "t2": "success", "t3": msg }); }
    if (bool == false) { this.ics.sendBean({ "t1": "rp-alert", "t2": "warning", "t3": msg }); }
    if (bool == undefined) { this.ics.sendBean({ "t1": "rp-alert", "t2": "primary", "t3": msg }); }
  }
}