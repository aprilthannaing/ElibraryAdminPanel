import { Component, OnInit } from '@angular/core';
import { IntercomService } from '../framework/intercom.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.styl']
})
export class HeaderComponent{
  userName:string = "";
  role:string = "";
  constructor(
    private ics: IntercomService
  ) { 
    this.userName = this.ics.uesrName;
    this.role = this.ics.userRole;
  }

  ngOnInit(): void {
  }

}
