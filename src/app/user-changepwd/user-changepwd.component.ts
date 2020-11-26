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
         "oldpwd": this.oldpwd,
         "newpwd": this.newpwd,
         "userId": this.ics.userId
       }
       try {
           this.http.post(url,json).subscribe(
               (data:any) => {
                   if (data != null && data != undefined) {
                       if(data.code ==="001")
                         this._result = data.desc;
                       else{
                         this.router.navigate(['home']); 
                         this.ics.userRole = data.role;
                         this.ics.uesrName = data.name;
                         this.ics.sessionId = data.sessionId;
                         this.ics.userId = data.userId;
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
   }
}
