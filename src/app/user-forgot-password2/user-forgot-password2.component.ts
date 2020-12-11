import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  iv = 'AODVNUASDNVVAOVF';
  key = 'mykey@91mykey@91';
  encryptedPassword :string;

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
  goResetPassword(){
    this.encryptedPassword = this.encrypt(this.newpwd);
    this._result = "";
    if(this.newpwd != this.newpwd1){
      this._result = "Your new password and confirm password must be same.";
    }
    if(this._result == ""){
      this.loading = true;
       const url = this.ics.apiRoute + '/user/goResetPassword';
       let json = {
         "password": this.encryptedPassword,
         "code" : this.ics.verifyCode,
         "email" : this.ics.email
       }
       try {
           this.http.post(url,json,{headers: new HttpHeaders().set('token', this.ics.token)}).subscribe(
               (data:any) => {
                 this.loading = false;
                   if (data != null && data != undefined) {
                       if(!data.status)
                         this._result = data.message;
                       else{
                        this.showMessage(data.message,true);
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
