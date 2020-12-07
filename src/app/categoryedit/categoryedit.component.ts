import { Component, OnInit } from '@angular/core';
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


  boId: string;
  term: string;
  subcategories = [];
  categories = [];
  form: FormGroup;
  json = { "myanmarName": "", "engName": "" ,"categories": "", "priority": ""}

  subcategoryId: string;

  constructor(
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private ics: IntercomService,
    private actRoute: ActivatedRoute) {
    this.boId = this.actRoute.snapshot.params.boId;


    this.form = this.formBuilder.group({
      subs: this.formBuilder.array([], [Validators.required])

    })
  }

  ngOnInit(): void {
    
    this.findByBoId();
    // this.getSubCategories();
  }

  checkCategoryContainOrNot(boId) {
    return this.categories.includes(boId);
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
    this.http.request('get',url).subscribe(
      (data: any) => {
        this.subcategories = data.subcategories; 
        console.log(data.subcategories)     
      },
      error => {
        console.warn("error: ", error);
      });
  }

  save() {

    this.json.categories = this.form.value.subs;
    console.log("json: " , this.json);
    const url: string = this.ics.apiRoute + "/operation/editcategory";
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

  cancel() {
    this.router.navigate(['book']);

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
