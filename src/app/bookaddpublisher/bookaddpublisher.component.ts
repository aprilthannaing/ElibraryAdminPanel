import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { IntercomService } from '../framework/intercom.service';
@Component({
  selector: 'app-bookaddpublisher',
  templateUrl: './bookaddpublisher.component.html',
  styleUrls: ['./bookaddpublisher.component.styl']
})
export class BookaddpublisherComponent implements OnInit {

  json = { "name" :"", "sort" : ""}

  constructor(
    private router: Router,
    private http: HttpClient,
    private dialog: MatDialog,
    private ics: IntercomService
  ) { }

  ngOnInit(): void {
  }

  cancel(){
    this.router.navigate(['book']);
  }

  
  save(){
    const url: string = this.ics.apiRoute + "/operation/savePublisher";
    this.http.post(url, this.json).subscribe(
      (data: any) => {
        console.warn("data: ", data);
        this.successDialog();
      },
      error => {
        console.warn("error: ", error);
        this.failDialog();
      });

  }

  successDialog() {
    const dialogRef = this.dialog.open(SuccessDialog, {
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['book']);
      console.log('The dialog was closed');
    });

  }

  failDialog() {
    const dialogRef = this.dialog.open(FailDialog, {
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
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

@Component({
  selector: 'fail-dialog',
  templateUrl: './fail-dialog.html',
})
export class FailDialog {

  constructor(
    public dialogRef: MatDialogRef<FailDialog>,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}


