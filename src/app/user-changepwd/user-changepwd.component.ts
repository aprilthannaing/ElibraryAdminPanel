import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  iv = 'AODVNUASDNVVAOVF';
  key = 'mykey@91mykey@91';
  encryptedOldPassword : string;
  encryptedNewPassword : string;
  
  constructor(
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private ics: IntercomService
  ) { }

  ngOnInit(): void {
  }

  encryt(stringToEncrypt){
    var forge = require('node-forge');

    var plaintext = stringToEncrypt;

    var cipher = forge.cipher.createCipher('AES-CBC', this.key);
    cipher.start({iv: this.iv});
    cipher.update(forge.util.createBuffer(plaintext));
    cipher.finish();
    var encrypted = cipher.output;

    var encodedB64 = forge.util.encode64(encrypted.data);

    return encodedB64;
  }
  goChangePwd(){
    if(this.goValidation()){
      this.encryptedOldPassword = this.encryt(this.oldpwd);
      this.encryptedNewPassword = this.encryt(this.newpwd);
      console.log(this.encryptedOldPassword)
      console.log(this.encryptedNewPassword)
      this._result = "";
      if(this._result == ""){
         const url = this.ics.apiRoute + '/user/goChangepwdByAdmin';
         let json = {
          "old_password": this.encryptedOldPassword,
          "new_password": this.encryptedNewPassword,
          "email": this.ics.email
        }
        console.log(json)
        try {
            this.http.post(url,json,{headers: new HttpHeaders().set('token', this.ics.token)}).subscribe(
                 (data:any) => {
                     if (data != null && data != undefined) {
                         if(!data.status)
                           this._result = data.message;
                         else{
                           this.router.navigate(['/login']); 
                           this.showMessage("Your password was changed.Please login with this password.",true);
                           this.ics.userRole = "";
                           this.ics.token = "";
                           this.ics.uesrName = "";
                           this.ics.userId = "";
                           this.ics.email = "";
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
   }
   goValidation(){
    if(this.oldpwd == null || this.oldpwd == ""){
      this.showMessage("Please enter your old password",false);
      return false;
    }else  if(this.newpwd == null || this.newpwd == ""){
      this.showMessage("Please enter your new password",false)
      return false;
    }else  if(this.newpwd === this.oldpwd){
      this.showMessage("your old password should not be the same with your old password",false)
      return false;
    }else if(this.newpwd != this.newpwd1){
      this.showMessage("please comfirm your new password",false)
      return false;
    }
    return true;
   }
   showMessage(msg, bool) {
    if (bool == true) { this.ics.sendBean({ "t1": "rp-alert", "t2": "success", "t3": msg }); }
    if (bool == false) { this.ics.sendBean({ "t1": "rp-alert", "t2": "warning", "t3": msg }); }
    if (bool == undefined) { this.ics.sendBean({ "t1": "rp-alert", "t2": "primary", "t3": msg }); }
  }
  ret:boolean = false;
  state = false;
  desc = "";
}
