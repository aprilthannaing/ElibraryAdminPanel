import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { IntercomService } from '../framework/intercom.service';
@Component({
  selector: 'app-categoryedit',
  templateUrl: './categoryedit.component.html',
  styleUrls: ['./categoryedit.component.styl']
})
export class CategoryeditComponent implements OnInit {

  userRole = "";
  boId: string;
  term: string;
  subcategories = [];
  categories = [];
  form: FormGroup;
  json = { "myanmarName": "", "engName": "", "categories": "", "priority": "" }

  subcategoryId: string;
  emptyData = {};

  displayJson = {"subcategoryBoId": ""};
  subcategoryDisplay : FormArray;

  constructor(
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private ics: IntercomService,
    private actRoute: ActivatedRoute) {
    this.boId = this.actRoute.snapshot.params.boId;

    this.form = this.formBuilder.group({
      subs: this.formBuilder.array([], [Validators.required]),
      subcategoryDisplay: this.formBuilder.array([], [Validators.required])

    }),
    this.userRole = this.ics.userRole;
    
  }

  ngOnInit(): void {
    this.findByBoId();
  }

  checkCategoryContainOrNot(boId) {
    return this.categories.includes(boId);
  }

  onCheckboxSelection(e){
    this.subcategoryDisplay = this.form.get('subcategoryDisplay') as FormArray;
    if(e.target.checked) {
      this.subcategoryDisplay.push(new FormControl(e.target.value));
    } else {
      const index = this.subcategoryDisplay.controls.findIndex(x => x.value === e.target.value);
      this.subcategoryDisplay.removeAt(index);
    }
    console.log(this.subcategoryDisplay)
    this.displayJson.subcategoryBoId = this.subcategoryDisplay.value;
    console.log(this.displayJson)
  }

  findByBoId() {
    const json = {
      boId: this.boId
    }

    const url: string = this.ics.apiRoute + "/category/byboId";
    this.http.post(url, json).subscribe(
      (data: any) => {
        this.json = data.category;
        this.subcategories = data.category.subCategories;
        data.category.subCategories.forEach(element => {
          this.categories.push(element.boId);
          this.onChange(element.boId, true);
        });
        // this.subcategoryId = data.category.subCategories.boId;

        console.log(data.category.subCategories)
      },
      error => {
        console.warn("error: ", error);
      });

  }

  onChange(boId: string, isChecked: boolean) {
    const subs = <FormArray>this.form.controls.subs;
    if (isChecked) {
      subs.push(new FormControl(boId));
    } else {
      let index = subs.controls.findIndex(x => x.value == boId)
      subs.removeAt(index);
    }
  }


  getSubCategories() {

    const url: string = this.ics.apiRoute + "/subcategory/all";
    this.http.request('get', url).subscribe(
      (data: any) => {
        this.subcategories = data.subcategories;
        console.log(data.subcategories)
      },
      error => {
        console.warn("error: ", error);
      });
  }

  
  searchKeyup(e: any) {
    if (e.which == 13) {
      this.save();
    }
  }


  save() {

    this.json.categories = this.form.value.subs;
    console.log("json: ", this.json);
    const url: string = this.ics.apiRoute + "/operation/editcategory";
    this.http.post(url, this.json).subscribe(
      (data: any) => {
        console.warn("data: ", data);
        const displayUrl: string = this.ics.apiRoute + "/subcategory/setDisplayList";
        this.http.post(displayUrl, this.displayJson).subscribe(
          (data : any) => {
            console.warn("data: ", data);
          },
          error => {
            console.warn("error:", error);
          });
        if (data.status == "1")
          this.successDialog();
        else this.failDialog(data);
      },
      error => {
        console.warn("error: ", error);
        this.failDialog(this.emptyData);
      });
  }

  cancel() {
    this.router.navigate(['book']);

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
        "title": "Unable to edit category!!",
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
      categoryboId: this.data.boId
    }
    const url: string = this.ics.apiRoute + "/operation/deleteCategory";
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


