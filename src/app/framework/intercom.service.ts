import { Injectable } from '@angular/core';
import {Subject}    from 'rxjs';

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
  apiRoute: string = "http://localhost:8082";
  //apiRoute: string = "http://136.228.165.174:8080/elibrary";
  apiRouteForImage: string = "http://136.228.165.174:8080";
  //apiRoute: string = "http://localhost:8082";
  private _rpbeanSource = new Subject<any>();
  rpbean$ = this._rpbeanSource.asObservable();
  private _mybean: any;
  sendBean(x: any) {
    this._mybean = x;
    this._rpbeanSource.next(x);
}

  constructor() { }
}
