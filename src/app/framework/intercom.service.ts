import { Injectable } from '@angular/core';
import {Subject}    from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IntercomService {

  userRole: string = "";
  uesrName: string = "";
  sessionId: string = "";
  userId: string = "";
  apiRoute: string = "http://localhost:8082";
  private _rpbeanSource = new Subject<any>();
  rpbean$ = this._rpbeanSource.asObservable();
  private _mybean: any;
  sendBean(x: any) {
    this._mybean = x;
    this._rpbeanSource.next(x);
}
  constructor() { }
}
