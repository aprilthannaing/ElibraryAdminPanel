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

  apiRoute: string = "http://localhost:8080";
  private _rpbeanSource = new Subject<any>();
  rpbean$ = this._rpbeanSource.asObservable();
  private _mybean: any;
  sendBean(x: any) {
    this._mybean = x;
    this._rpbeanSource.next(x);
}

  constructor() { }
}
