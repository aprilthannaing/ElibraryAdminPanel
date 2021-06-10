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
  encrypt(stringToEncrypt){
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
    this.encryptedOldPassword = this.encrypt(this.oldpwd);
    this.encryptedNewPassword = this.encrypt(this.newpwd);
    this._result = "";
    if(this.goValidation()){
      this.loading = true;
       const url = this.ics.apiRoute + '/user/goChangepwdByAdmin';
       let json = {
         "old_password": this.encryptedOldPassword,
         "new_password": this.encryptedNewPassword,
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
                         this.router.navigate(['/']); 
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
    }
   }
   goValidation(){
    if(this.oldpwd == null || this.oldpwd == ""){
      this.showMessage("Please enter your old password",false);
      return false;
    }
    if(this.newpwd == null || this.newpwd == ""){
      this.showMessage("Please enter your new password",false)
      return false;
    }
    if(this.newpwd1 == ""){
      this.showMessage("Please confirm your new password.",false)
      return false;
     }
    if(this.newpwd === this.oldpwd){
      this.showMessage("Your new password cannot be the same as your old password. Please enter a different password",false)
      return false;
    }
    if(this.newpwd != this.newpwd1){
      this.showMessage("your new password must be same with your confirm password.",false)
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
