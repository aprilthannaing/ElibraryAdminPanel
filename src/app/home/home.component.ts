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
  showBook = false;

  ngOnInit(): void {
    this.getPendingBooks();
  }

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private router: Router,
    private ics: IntercomService) {
    this.userRole = this.ics.userRole;
  }

  getPendingBooks(){    
    const url: string = this.ics.apiRoute + "/book/pending";
    this.http.request('post', url).subscribe(
      (data: any) => {
        console.log("data: ", data)
        this.books = data.books;
       
      },
      error => {
        console.warn("error: ", error);
      });
  }

  manageBooks() {
    console.log("userRole", this.ics.userRole)
    if (this.userRole == "Admin") //|| this.userRole == "SuperLibrarian"
      this.router.navigate(['book']);
  }
 
  goLogout() {
    let url = this.ics.apiRoute + '/user/signout'
    let json = { "userid": this.ics.userId }
    this.http.post(url, json, { headers: new HttpHeaders().set('token', this.ics.token) }).subscribe(
      data => {
        this.clearICS();
        this.router.navigate(['login']);
      },
      error => { }, () => { });
  }
  
  clearICS() {
    this.ics.userId = "";
    this.ics.email = "";
    this.ics.userRole = "";
    this.ics.uesrName = "";
    this.ics.token = "";
    this.ics.userId = "";
  }
  goSetup(id) {
    this.router.navigate(['setup', 'read', id]);
  }

  approve() {
    this.showBook = true;
    console.log("approve!!" , this.books)

  }

}
