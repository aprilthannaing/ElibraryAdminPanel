import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IntercomService } from '../framework/intercom.service';

@Component({
  selector: 'app-user-forgot-password',
  templateUrl: './user-forgot-password.component.html',
  styleUrls: ['./user-forgot-password.component.styl']
})
export class UserForgotPasswordComponent implements OnInit {
  _result = "";
  verifyCode="";
  loading = false;
 constructor(
  private router: Router,
  private http: HttpClient,
  private route: ActivatedRoute,
  private ics: IntercomService
  ) {
    if(this.ics.token === "" || this.ics.token == null){
      this.router.navigate(['login']);
      this.showMessage("Session Time Out",false);
    }
   }

  ngOnInit(): void {
  }
  goVerify(){
    if(this.verifyCode === ""){
      this._result = "Please enter the verification code that will be sent to your email.";
    }else{
        this.loading = true;
          const url = this.ics.apiRoute + '/user/verifyCode';
          const json = {"code" : this.verifyCode,"email": this.ics.email}
          try {
              this.http.post(url,json,
                {headers: new HttpHeaders().set('token', this.ics.token)}).subscribe(
                  (data:any) => {
                      if (data != null && data != undefined) {
                          if(!data.status)
                            this._result = data.message;
                          else{
                            this.router.navigate(['userforgotPwd2']);
                            this.ics.verifyCode = this.verifyCode; 
                            this.showMessage(data.message,true);
                          }
                      }
                      this.loading = false;
                  },
                  error => {
                      if (error.name == "HttpErrorResponse") {
                        this._result = "Connection Timed Out!";
                      }
                      else {
      
                      }
                      this.loading = false;
                  }, () => { });
          } catch (e) {
            this.loading = false;
            this._result = "Server Time Out";
          }
       }
  }
  showMessage(msg, bool) {
    if (bool == true) { this.ics.sendBean({ "t1": "rp-alert", "t2": "success", "t3": msg }); }
    if (bool == false) { this.ics.sendBean({ "t1": "rp-alert", "t2": "warning", "t3": msg }); }
    if (bool == undefined) { this.ics.sendBean({ "t1": "rp-alert", "t2": "primary", "t3": msg }); }
  }

}
