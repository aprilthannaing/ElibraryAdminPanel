import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IntercomService {

  userRole: string = "ADMIN";
  uesrName: string = "";


  constructor() { }
}
