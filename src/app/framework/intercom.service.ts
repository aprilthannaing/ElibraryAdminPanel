import { Injectable } from '@angular/core';
import {Subject}    from 'rxjs';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { Router } from '@angular/router';
import { HttpHeaders, HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class IntercomService {
  email: string = "";
  userRole: string = "";
  uesrName: string = "";
  token: string = "";
  userId: string = "";
  _activeTimeout:number = 0;
  _sessiontime:string = "10";
  verifyCode: string = "";
  count_user = 0;
  // apiRoute: string = "http://136.228.165.174:8080/elibrary";
  // apiRouteForImage: string = "http://136.228.165.174:8080";
  apiRoute: string = "http://localhost:8082";
  apiRouteForImage: string = "http://localhost:8087/";

  private _rpbeanSource = new Subject<any>();
  rpbean$ = this._rpbeanSource.asObservable();
  private _mybean: any;
  sendBean(x: any) {
    this._mybean = x;
    this._rpbeanSource.next(x);
}
  constructor(private http: HttpClient, private confirmationDialogService: ConfirmationDialogService, private router: Router) { }
  openConfirmationDialog() {
    this.confirmationDialogService.confirm('Please confirm', 'Do you want to Logout ?')
    .then((confirmed) => {
      if(confirmed){
        this.logout();
      } 
    }).catch(() => 
      console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }
  logout(){
    let url = this.apiRoute + '/user/signout'
          let json = {"userid": this.userId}
            this.http.post(url,json,{headers: new HttpHeaders().set('token', this.token)}).subscribe(
              data  => {
                this.router.navigate(['login']);
                this.clearICS();
              },
              error => {}, () => { });
  }
  clearICS(){
    this.userId = "";
    this.email = "";
    this.userRole = "";
    this.uesrName = "";
    this.token = "";
    this.userId = "";
    }
}
