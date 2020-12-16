import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IntercomService } from '../framework/intercom.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.styl']
})
export class UserLoginComponent implements OnInit {
  loading = false;
  _signintext:string = "Elibrary Admin Console";
  email: string = "";
  password: string = "";
  _result: string = "";

  iv = 'AODVNUASDNVVAOVF';
  key = 'mykey@91mykey@91';
  encryptedPassword: string;

  constructor(
  private router: Router,
  private http: HttpClient,
  private route: ActivatedRoute,
 private ics: IntercomService  ) {
   }

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

  goPost(){
    this.encryptedPassword = this.encrypt(this.password);
    this._result = "";
   this.goValidation();
   if(this._result == ""){
    this.loading = true;
      const url = this.ics.apiRoute + '/user/goLoginByAdmin';
      let json = {
        "email": this.email,
        "password": this.encryptedPassword
      }
      console.log(this.password)
      console.log(json)
      try {
          this.http.post(url,json).subscribe(
              (data:any) => {
                console.log(data)
                  if (data != null && data != undefined) {
                      if(data.status){
                        if(data.changePwd){
                          this.router.navigate(['/changePwd']); 
                          this.ics.token = data.token;
                        }else{
                          this.router.navigate(['/home']); 
                          this.ics.userId = data.data.id;
                          this.ics.userRole = data.data.role;
                          this.ics.uesrName = data.data.name;
                          this.ics.token = data.token;
                          this.ics.email = this.email;
                        }
                      
                      }else{
                        this._result = data.message;
                        this.ics.userId = data.userId;
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
  goValidation(){
    if(this.password === "" && this.email === ""){
      return this._result = "Please enter your email address and password";
    }
    if(this.email === ""){
      return this._result = "Please enter your email address";
    }
    if (!(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(this.email)) {
      return this._result = "Your email address is incorrect";
    }

    if(this.password === ""){
      return this._result = "Please enter your password";
    }
  }
  goForgotPwd(){
    if(this.email != ""){
      this.loading = true;
      const url = this.ics.apiRoute + '/user/verifyEmail';
      let json = {"email":this.email}
      try {
          this.http.post(url,json).subscribe(
              (data:any) => {
                  if (data != null && data != undefined) {
                      if(!data.status)
                        this._result = data.message;
                      else{
                        this.showMessage(data.message,true);
                        this.router.navigate(['/userforgotPwd']);
                        this.ics.token = data.token;
                        this.ics.email = this.email;
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
    }else{
      this._result = "Please enter your email address";
    }
  }
  showMessage(msg, bool) {
    if (bool == true) { this.ics.sendBean({ "t1": "rp-alert", "t2": "success", "t3": msg }); }
    if (bool == false) { this.ics.sendBean({ "t1": "rp-alert", "t2": "warning", "t3": msg }); }
    if (bool == undefined) { this.ics.sendBean({ "t1": "rp-alert", "t2": "primary", "t3": msg }); }
  }

}
