import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IntercomService } from '../framework/intercom.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-bookaddsubcategory',
  templateUrl: './bookaddsubcategory.component.html',
  styleUrls: ['./bookaddsubcategory.component.styl']
})
export class BookaddsubcategoryComponent implements OnInit {

  term: string;
  categories = [];
  subcategories = [];
  json = {
    "category": ""
  }
  selectedEntry;
  myanmarName: String = '';
  engName: String = '';
  priority: string = '';
  category = '';

  emptyData = {};

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private http: HttpClient,
    private ics: IntercomService
  ) { 
    this.form = this.formBuilder.group({
      category: this.formBuilder.array([], [Validators.required])

    })
  }

  form = new FormGroup({

    category: new FormControl('', Validators.required)

  });

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories(){
    const url: string = this.ics.apiRoute + "/category/all";
    const header: HttpHeaders = new HttpHeaders({
      token: this.ics.token
    });
    this.http.request('get', url,{
      headers:header
    }).subscribe(
      (data: any) => {
        console.warn("data: ", data);
        if(data.err_msg == "Unauthorized Request")
          this.loginDialog();
        this.categories = data.categories;
      },
      error => {
        console.warn("error: ", error);
      });
  }
  changeCategory(e) {
    console.log("form value: ", this.form.value);
    const url: string = this.ics.apiRoute + "/category/boId";
    this.http.post(url, this.form.value).subscribe(
      (data: any) => {
        console.warn("data: ", data);
        this.subcategories = data.subcategories;
      },
      error => {
        console.warn("error: ", error);
      });
  }

  cancel() {
    this.router.navigate(['book']);

  }

  onSelectionChange(entry) {
    this.selectedEntry = entry;
  }

  save() {    
    const url: string = this.ics.apiRoute + "/operation/savesubcategory";
    const json = {
      myanmarName: this.myanmarName,
      engName: this.engName,
      priority: this.priority,
      categoryBoId: this.category,

    }

    console.log("json!!!" , json)
    this.http.post(url, json).subscribe(
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
      data:{ 
        "title": "Unable to add subcategory!!",
        "message": data.msg
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

  }

  loginDialog() {
    const dialogRef = this.dialog.open(LoginDialog, {
      data:{ 
        "title": "Please login first!!",
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
    @Inject(MAT_DIALOG_DATA) public data: {title: string; message: string}
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}


export class LoginDialog {

  constructor(
    public dialogRef: MatDialogRef<LoginDialog>,
    public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: {title: string}
  ) { }

  route(): void {
    this.dialogRef.close();
    this.router.navigate(['login']);
  }
}