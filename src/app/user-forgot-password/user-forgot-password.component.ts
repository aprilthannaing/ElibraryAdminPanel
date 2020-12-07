import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
    if(this.ics.sessionId === "" || this.ics.sessionId == null){
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
          const json = {"email" : this.ics.email,"code" : this.verifyCode,"sessionId": this.ics.sessionId}
          try {
              this.http.post(url,json).subscribe(
                  (data:any) => {
                      if (data != null && data != undefined) {
                          if(data.code ==="001")
                            this._result = data.desc;
                          else{
                            this.router.navigate(['userforgotPwd2']); 
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
