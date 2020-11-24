import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.styl']
})
export class UserLoginComponent implements OnInit {
  _signintext:string = "Elibrary Admin Console";
  _email: string = "";
  _pw: string = "";
  _result: string = "";
  constructor(
  private router: Router,
  private http: HttpClient,
  private route: ActivatedRoute,
  ) {
   }

  ngOnInit(): void {
  }
  goPost(){
   this.goValidation();
   if(this._result != ""){
      const url = 'http://localhost:8080/user/selectUserbykey';
      let json = {
        "_email": this._email,
        "_psw": this._pw
      }
      try {
          this.http.post(url,json).subscribe(
              (data:any) => {
                  if (data != null && data != undefined) {
                      if(data.code ==="0000")
                        this._result = data.message;
                      else{
                        this.router.navigate(['home']);  
                      }
                  }
              },
              error => {
                  if (error._body.type == 'error') {
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
    if(this._pw === "" && this._email === ""){
      return this._result = "Please enter your email address and password";
    }
    if(this._email === ""){
      return this._result = "Please enter your email address";
    }
    if (!(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(this._email)) {
      return this._result = "Your email address is incorrect";
    }

    if(this._pw === ""){
      return this._result = "Please enter your password";
    }
  }

}
