import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { IntercomService } from '../framework/intercom.service';
@Component({
  selector: 'app-bookaddcategory',
  templateUrl: './bookaddcategory.component.html',
  styleUrls: ['./bookaddcategory.component.styl']
})

export class BookaddcategoryComponent implements OnInit {
  userRole = "";
  term: string;
  subcategories = [];
  myaName: String = '';
  engName: String = '';
  form: FormGroup;
  priority = '';

  emptyData = {};
  displayJson = {"subcategoryBoId": ""};
  subcategoryDisplay : FormArray;
  constructor(
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private ics: IntercomService
  ) {
    this.form = this.formBuilder.group({
      subs: this.formBuilder.array([], [Validators.required]),
      subcategoryDisplay: this.formBuilder.array([], [Validators.required])

    }),
    this.userRole = this.ics.userRole;
  }

  ngOnInit(): void {
    this.getSubCategories();
    // this.displayedSubcategories();
  }

  onCheckboxChange(e) {
    const subs: FormArray = this.form.get('subs') as FormArray;
    if (e.target.checked) {
      subs.push(new FormControl(e.target.value));
    } else {
      const index = subs.controls.findIndex(x => x.value === e.target.value);
      subs.removeAt(index);
    }
  }

  onCheckboxSelection(e){
    this.subcategoryDisplay = this.form.get('subcategoryDisplay') as FormArray;
    if(e.target.checked) {
      this.subcategoryDisplay.push(new FormControl(e.target.value));
    } else {
      const index = this.subcategoryDisplay.controls.findIndex(x => x.value === e.target.value);
      this.subcategoryDisplay.removeAt(index);
    }
    this.displayJson.subcategoryBoId = this.subcategoryDisplay.value;
  }


  //list of sub categories
  getSubCategories() {
    const url: string = this.ics.apiRoute + "/subcategory/all";
    this.http.request('get', url).subscribe(
      (data: any) => {
        console.warn("data: ", data);
        this.subcategories = data.subcategories;
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
    
    const json =
    {
      categories: this.form.value.subs,
      myanmarName: this.myaName,
      engName: this.engName,
      priority: this.priority,
    };

    console.log("json : " , json)
    const url: string = this.ics.apiRoute + "/operation/savecategory";
    this.http.post(url, json).subscribe(
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
        "title": "Unable to add category!!",
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
    @Inject(MAT_DIALOG_DATA) public data: {title: string; message: string}
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
