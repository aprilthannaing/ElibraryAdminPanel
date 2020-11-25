import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Event, Router, RouterEvent, NavigationStart, NavigationEnd } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IntercomService } from '../framework/intercom.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.styl']
})
export class HomeComponent implements OnInit {

  books = [];
  userRole = "";
  ngOnInit(): void {
  }

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private router: Router,
    private ics: IntercomService) {
      this.userRole = this.ics.userRole;
     }

  manageBooks() {
    console.log("manage book")
    console.log("userRole", this.ics.userRole)

    if (this.userRole == "SUPERVISOR")
      this.router.navigate(['booksupervisor']);
    if (this.userRole == "ADMIN")
      this.router.navigate(['book']);
  }

}
