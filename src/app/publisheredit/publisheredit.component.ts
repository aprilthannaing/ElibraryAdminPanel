import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { IntercomService } from '../framework/intercom.service';
@Component({
  selector: 'app-publisheredit',
  templateUrl: './publisheredit.component.html',
  styleUrls: ['./publisheredit.component.styl']
})
export class PublishereditComponent implements OnInit {

  json = { "name": "", "sort": "" }

  boId: string;
  emptyData = {};

  constructor(
    private router: Router,
    private http: HttpClient,
    private dialog: MatDialog,
    private actRoute: ActivatedRoute,
    private ics: IntercomService) {
    this.boId = this.actRoute.snapshot.params.boId;
  }

  ngOnInit(): void {
    this.findByBoId();
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
    console.log(this.json)
    const url: string = this.ics.apiRoute + "/operation/editPublisher";
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


  findByBoId() {
    const json = {
      boId: this.boId
    }

    const url: string = this.ics.apiRoute + "/publisher/boId";
    this.http.post(url, json).subscribe(
      (data: any) => {
        console.warn("data: ", data);
        this.json = data.publisher;
        console.log(this.json)
        console.log(data.publisher)
      },
      error => {
        console.warn("error: ", error);
      });

  }

  delete() {
    this.alertDialog({});
  }


  alertDialog(data) {
    const dialogRef = this.dialog.open(AlertDialog, {
      data: {
        "boId": this.boId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
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

  failDialog(data) {
    const dialogRef = this.dialog.open(FailDialog, {
      data: {
        "title": "Unable to edit Publisher!!",
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
@Component({
  selector: 'alert-dialog',
  templateUrl: './alert-dialog.html',
})
export class AlertDialog {

  constructor(
    private router: Router,
    private http: HttpClient,
    private actRoute: ActivatedRoute,
    private ics: IntercomService,
    public dialogRef: MatDialogRef<AlertDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { boId: string }
  ) { }


  cancel(): void {
    this.dialogRef.close();
  }

  submit(): void {
    console.log("this.data.boId: ", this.data.boId)
    this.dialogRef.close();

    const json = {
      publisherboId: this.data.boId
    }
    console.log("this.data.boId:  ", this.data.boId)

    const url: string = this.ics.apiRoute + "/operation/deletePublisher";
    this.http.post(url, json).subscribe(
      (data: any) => {
        this.router.navigate(['book']);
        console.log("response: ", data);
      },
      error => {
        console.log("error ", error);
      });
  }
}


