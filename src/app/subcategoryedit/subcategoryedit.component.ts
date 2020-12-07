import { Component, OnInit } from '@angular/core';
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
  json = {"myanmarName":"", "engName":"", "priority": ""};

  subcategoryId: string;
  categoryId: string;
  category: string;
  boId: string;
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
    this.getCategory();
    this.findByBoId();
  }

  getCategory(){
    const json = {
      boId: this.boId
    }
    console.log(json)
    const url: string = this.ics.apiRoute + "/subcategory/boId";
    this.http.post(url,json).subscribe(
      (data: any) => {
        console.log(data)
        this.subcategoryId = data.subCategoryId;
        const subcategoryJson = {
          "id": ""
        }
        subcategoryJson.id = this.subcategoryId;
        console.log(subcategoryJson)
        const subcategoryUrl: string = this.ics.apiRoute + "/category/bySubcategoryId";
        this.http.post(subcategoryUrl,subcategoryJson).subscribe(
          (data: any) => {
            console.log(data)
            this.categoryId = data.categoryId;
            const categoryJson = {
              "id" : this.categoryId
            }
            console.log(categoryJson)
            const categoryurl: string = this.ics.apiRoute + "/category/byId";
            this.http.post(categoryurl,categoryJson).subscribe(
              (data:any) => {
                console.log(data);
                this.category = data.category.myanmarName;
              },
              error => {
                console.warn("error: ", error);
              });    
          },
          error => {
            console.warn("error: ", error);
        });

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
        console.warn("data: ", data);
        this.json  = data.subCategory;
      },
      error => {
        console.warn("error: ", error);
      });

  }


  save() {

    const url: string = this.ics.apiRoute + "/operation/editsubcategory";   
    this.http.post(url, this.json).subscribe(
      (data: any) => {
        console.log("response: ", data);
        if (data.status == "1") {
          this.successDialog();
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


