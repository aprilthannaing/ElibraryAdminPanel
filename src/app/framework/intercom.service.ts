import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IntercomService {

  userRole: string = "";
  uesrName: string = "";
  sessionId: string = "";
  userId: string = "";
  apiRoute: string = "http://localhost:8082";
  constructor() { }
}
