import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Event, Router, RouterEvent, NavigationStart, ActivatedRoute } from '@angular/router';
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
  approvedBooks: FormArray;
  form: FormGroup;
  count: string;
  loading = false;
  feedbackCount: string;


  ngOnInit(): void {
    this.getPendingBooks();
    this.getFeedbackCount();
  }

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder,

    private ics: IntercomService) {
    this.form = this.formBuilder.group({
      approvedBooks: this.formBuilder.array([], [Validators.required])

    })
    this.userRole = this.ics.userRole;
  }

  getPendingBooks() {
    const url: string = this.ics.apiRoute + "/book/pendingCount";
    this.http.request('post', url).subscribe(
      (data: any) => {
        this.count = data.count;
      },
      error => {
        console.warn("error: ", error);
      });
  }

  manageBooks() {
    console.log("userRole", this.ics.userRole)
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
    const url: string = this.ics.apiRoute + "/book/pending";
    this.http.request('post', url).subscribe(
      (data: any) => {
        this.books = data.books;
        this.showBook = true;
      },
      error => {
        console.warn("error: ", error);
      });
    console.log("approve!!", this.books)

  }

  onCheckboxSelection(e) {
    this.approvedBooks = this.form.get('approvedBooks') as FormArray;
    if (e.target.checked) {
      this.approvedBooks.push(new FormControl(e.target.value));
    } else {
      const index = this.approvedBooks.controls.findIndex(x => x.value === e.target.value);
      this.approvedBooks.removeAt(index);
    }
  }


  approveDialog(data) {
    const dialogRef = this.dialog.open(ApproveDialog, {
      data: {
        "bookBoIds": this.approvedBooks.value
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

  }


  approveBooks() {
    //this.approveDialog({});
    // this.getPendingBooks();
    this.loading = true;
    const header: HttpHeaders = new HttpHeaders({
      token: this.ics.token
    });

    const data = {
      "bookBoIds": this.approvedBooks.value
    }

    const url: string = this.ics.apiRoute + "/book/approve";
    this.http.post(url, data, { headers: header }).subscribe(
      (data: any) => {
        console.log("data: ", data)
        if (data.status){
          this.successDialog();

          for (let i = 0; i < this.books.length; ++i) {
            this.approvedBooks.value.forEach(element => {
              console.log("element", element)
              if (this.books[i].boId === element) {
                this.books.splice(i, 1);
              }
            });          
          }
        }
        this.getPendingBooks();
        this.loading = false;

      },
      error => {
        console.warn("error: ", error);
      });


  }

  getFeedbackCount(){
    const header: HttpHeaders = new HttpHeaders({
      token: this.ics.token
    });
    const url: string = this.ics.apiRoute + "/operation/feedbackCount";
    this.http.request('get', url, {
      headers: header
    }).subscribe((data: any) => {
      console.log("data: ", data)
      this.feedbackCount = data;
    },
    error => {
      console.warn("error: ", error);
    })
  }

  successDialog() {
    const dialogRef = this.dialog.open(SuccessDialog, {
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['book']);
    });

  }
}


@Component({
  selector: 'approve-dialog',
  templateUrl: './approve-dialog.html',
})
export class ApproveDialog {

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private actRoute: ActivatedRoute,
    private ics: IntercomService,
    public dialogRef: MatDialogRef<ApproveDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { bookBoIds: any }
  ) { }


  cancel(): void {
    this.dialogRef.close();
  }

  submit(): void {
    console.log("this.data.boId: ", this.data.bookBoIds)
    this.dialogRef.close();

    const header: HttpHeaders = new HttpHeaders({
      token: this.ics.token
    });

    const url: string = this.ics.apiRoute + "/book/approve";
    this.http.post(url, this.data, { headers: header }).subscribe(
      (data: any) => {
        console.log("data: ", data)
      },
      error => {
        console.warn("error: ", error);
      });
  }
}
@Component({
  selector: 'success-dialog',
  templateUrl: './success-dialog.html',
})
export class SuccessDialog {

  constructor(
    public dialogRef: MatDialogRef<SuccessDialog>,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

