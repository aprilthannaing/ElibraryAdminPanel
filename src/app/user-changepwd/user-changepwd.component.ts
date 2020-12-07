import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IntercomService } from '../framework/intercom.service';

@Component({
  selector: 'app-user-changepwd',
  templateUrl: './user-changepwd.component.html',
  styleUrls: ['./user-changepwd.component.styl']
})
export class UserChangepwdComponent implements OnInit {
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
    this.goValidation();
    if(this._result == ""){
       const url = this.ics.apiRoute + '/user/goChangepwd';
       let json = {
         "old_password": this.oldpwd,
         "new_password": this.newpwd,
         "token": this.ics.token
       }
       try {
           this.http.post(url,json).subscribe(
               (data:any) => {
                   if (data != null && data != undefined) {
                       if(!data.status)
                         this._result = data.message;
                       else{
                         this.router.navigate(['login']); 
                         this.showMessage("Your password was changed.Please login with this password.",true);
                       }
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
    
   }
   goValidation(){
   }
   showMessage(msg, bool) {
    if (bool == true) { this.ics.sendBean({ "t1": "rp-alert", "t2": "success", "t3": msg }); }
    if (bool == false) { this.ics.sendBean({ "t1": "rp-alert", "t2": "warning", "t3": msg }); }
    if (bool == undefined) { this.ics.sendBean({ "t1": "rp-alert", "t2": "primary", "t3": msg }); }
}
}
