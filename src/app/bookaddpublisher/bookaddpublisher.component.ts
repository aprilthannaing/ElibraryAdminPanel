import { Component, OnInit, Inject } from '@angular/core';
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

  json = { "name": "", "sort": "" }

  emptyData = {};

  constructor(
    private router: Router,
    private http: HttpClient,
    private dialog: MatDialog,
    private ics: IntercomService
  ) { }

  ngOnInit(): void {
  }

  cancel() {
    this.router.navigate(['book']);
  }

  searchKeyup(e: any) {
    if (e.which == 13) {
      this.save();
    }
  }

  save() {
    const url: string = this.ics.apiRoute + "/operation/savePublisher";
    this.http.post(url, this.json).subscribe(
      (data: any) => {
        console.warn("data: ", data);
        if (data.status == "1")
          this.successDialog();
        else this.failDialog(data);
      },
      error => {
        console.warn("error: ", error);
        this.failDialog(this.emptyData);
      });

  }

  successDialog() {
    const dialogRef = this.dialog.open(SuccessDialog, {
    });

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['book']);
    });

  }

  failDialog(data) {
    const dialogRef = this.dialog.open(FailDialog, {
      data: {
        "title": "Unable to add publisher!!",
        "message": data.msg
      }
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
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}


