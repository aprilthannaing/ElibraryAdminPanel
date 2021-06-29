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
  count_user = 0;
  books = [];
  userRole = "";
  showBook = false;
  approvedBooks: FormArray;
  form: FormGroup;
  count: string;
  loading = false;
  feedbackCount: string;
  userName = "";
  downlaodApprovalBooks: FormArray;

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

    this.form = this.formBuilder.group({
      downlaodApprovalBooks: this.formBuilder.array([], [Validators.required])

    })
    this.userRole = this.ics.userRole;
    this.userName = this.ics.uesrName;
    this.NewUserApprovel();
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
    this.router.navigate(['book']);
  }

  goLogout() {
    let url = this.ics.apiRoute + '/user/signout'
    let json = { "userid": this.ics.userId }
    this.http.post(url, json, { headers: new HttpHeaders().set('token', this.ics.token) }).subscribe(
      data => {
        this.clearICS();
        this.router.navigate(['/']);
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
        console.log("pending books !!!!!!", data.books)
        this.books = data.books;
        this.showBook = true;
      },
      error => {
        console.warn("error: ", error);
      });

  }

  setDownlaodApprovalBooks(e) {
    this.downlaodApprovalBooks = this.form.get('downlaodApprovalBooks') as FormArray;
    // if (e.target.checked) {
    this.downlaodApprovalBooks.push(new FormControl(e.target.value));
    // } else {
    //   const index = this.downlaodApprovalBooks.controls.findIndex(x => x.value === e.target.value);
    //   this.downlaodApprovalBooks.removeAt(index);
    // }
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

  setDownloadApproval() {
    this.loading = true;
    console.log("download approval books !!!!!!!!", this.downlaodApprovalBooks.value)
    const data = {
      "bookBoIds": this.downlaodApprovalBooks.value
    }

    const url: string = this.ics.apiRoute + "/book/setDownlaodApproval";
    this.http.post(url, data).subscribe(
      (data: any) => {
        if (data.status) {
          this.successDialog();
          this.loading = false;
          this.downlaodApprovalBooks.clear();
        }
      },
      error => {
        console.warn("error: ", error);
        this.loading = false;
      });
  }


  approveBooks() {
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
        if (data.status) {
          this.successDialog();

          for (let i = 0; i < this.books.length; ++i) {
            this.approvedBooks.value.forEach(element => {
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

  getFeedbackCount() {
    const header: HttpHeaders = new HttpHeaders({
      token: this.ics.token
    });
    const url: string = this.ics.apiRoute + "/operation/feedbackCount";
    this.http.request('get', url, {
      headers: header
    }).subscribe((data: any) => {
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
  jsonReq = { "searchText": "", "text1": "", "text2": "", "text3": "", "fromDate": "", "toDate": "" };
  NewUserApprovel() {
    try {
      const url = this.ics.apiRoute + '/user/selectUserInfobyStatus';
      this.http.post(url, this.jsonReq).subscribe(
        (data: any) => {
          this.ics.count_user = data.length;
          this.count_user = this.ics.count_user;
        },
        error => {
          if (error.name == "HttpErrorResponse") {
            alert("Connection Timed Out!");
          }
        }, () => { });
    } catch (e) {
      alert(e);
    }
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
    this.dialogRef.close();

    const header: HttpHeaders = new HttpHeaders({
      token: this.ics.token
    });

    const url: string = this.ics.apiRoute + "/book/approve";
    this.http.post(url, this.data, { headers: header }).subscribe(
      (data: any) => {
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

