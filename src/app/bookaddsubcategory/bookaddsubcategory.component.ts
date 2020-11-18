import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-bookaddsubcategory',
  templateUrl: './bookaddsubcategory.component.html',
  styleUrls: ['./bookaddsubcategory.component.styl']
})
export class BookaddsubcategoryComponent implements OnInit {

  description: String = '';
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
  }

  cancel() {
    this.router.navigate(['book']);

  }

  save() {

    const url: string = "http://localhost:8082/operation/savesubcategory";
    const json = {
      description: this.description,
    }
    this.http.post(url, json).subscribe(
      (data: any) => {
        console.log("response: ", data);
        if (data.status == "1") {
          this.successDialog();
          //  this.router.navigate(['book']);

        } else {
          this.failDialog();
        }
      },
      error => {
        console.log("error ", error);

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


