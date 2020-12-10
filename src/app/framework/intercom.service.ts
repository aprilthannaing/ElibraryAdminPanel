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

  //apiRoute: string = "http://192.168.3.18:8080/elibrary";
  apiRoute: string = "http://localhost:8083";
  private _rpbeanSource = new Subject<any>();
  rpbean$ = this._rpbeanSource.asObservable();
  private _mybean: any;
  sendBean(x: any) {
    this._mybean = x;
    this._rpbeanSource.next(x);
}

  constructor() { }
}
