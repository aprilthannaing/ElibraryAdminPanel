import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IntercomService } from '../framework/intercom.service';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-subcategoryedit',
  templateUrl: './subcategoryedit.component.html',
  styleUrls: ['./subcategoryedit.component.styl']
})
export class SubcategoryeditComponent implements OnInit {

  term: string;
  categories = [];
  form: FormGroup;
  json = { "myanmarName": "", "engName": "", "priority": "", "categoryBoId": "" };
  subcategoryId: string;
  subCategory: string;
  boId: string;
  emptyData = {};
  books = [];
  loading = "true";

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private http: HttpClient,
    private actRoute: ActivatedRoute,
    private ics: IntercomService) {
    this.boId = this.actRoute.snapshot.params.boId;
    this.form = this.formBuilder.group({
      category: this.formBuilder.array([], [Validators.required])

    })
  }

  ngOnInit(): void {
    this.findByBoId();
    this.getAllCategories();
  }


  getAllCategories() {
    const url: string = this.ics.apiRoute + "/category/all";
    const header: HttpHeaders = new HttpHeaders({
      token: this.ics.token
    });
    this.http.request('get', url, {
      headers: header
    }).subscribe(
      (data: any) => {
        console.warn("categories: ", data);
        this.categories = data.categories;
      },
      error => {
        console.warn("error: ", error);
      });
  }

  cancel() {
    this.router.navigate(['book']);

  }

  findByBoId() {
    const json = {
      boId: this.boId
    }

    const url: string = this.ics.apiRoute + "/subcategory/boId";
    this.http.post(url, json).subscribe(
      (data: any) => {
        this.json = data.subCategory;
        this.books = data.books;
        console.log("find by boid books: ", this.books)
        console.log("findByBoId json: ", this.json);
        this.loading = "false";
      },
      error => {
        console.warn("error: ", error);
      });

  }


  save() {


    const url: string = this.ics.apiRoute + "/operation/editsubcategory";



    console.log("before saving this.json!!!!!!!", this.json)

    this.http.post(url, this.json).subscribe(
      (data: any) => {
        console.log("response: ", data);
        if (data.status == "1")
          this.successDialog();
        else this.failDialog(data);
      },
      error => {
        console.warn("error: ", error);
        this.failDialog(this.emptyData);
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
        "title": "Unable to edit subcategory!!",
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
      subCategoryboId: this.data.boId
    }
    const url: string = this.ics.apiRoute + "/operation/deleteSubCategory";
    this.http.post(url, json).subscribe(
      (data: any) => {
        this.router.navigate(['book']);

        console.log("deteted: ", data);
      },
      error => {
        console.log("error ", error);
      });
  }
}
  




