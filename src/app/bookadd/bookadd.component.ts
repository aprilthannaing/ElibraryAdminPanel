import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-bookadd',
  templateUrl: './bookadd.component.html',
  styleUrls: ['./bookadd.component.styl']
})
export class BookaddComponent implements OnInit {

  @ViewChild('fileInput') fileInput;
  file: File | null = null;
  imageSrc: string;
  pdf: string;
  publisherForm: FormGroup;
  authorForm: FormGroup;
  json = { "userId" : "", "profileName": "", "pdfName": "", "category": "", "subCategory": "", "authors": "", "publishers": "", "imageSrc": "", "pdf": "", "downloadApproval": "", "title": "", "ISBN": "", "sort": "", "publishedDate": "", "edition": "", "volume": "", "seriesIndex": "", "callNumber": "", "description": "" };
  categories = [];
  subcategories = [];
  publishers = [];
  authors = [];
  term: string;
  publisherTerm: string;
  authorTerm: string;
  subCategoryTerm: string;

  /*img  */
  myForm = new FormGroup({

    name: new FormControl('', [Validators.required, Validators.minLength(3)]),

    file: new FormControl('', [Validators.required]),

    fileSource: new FormControl('', [Validators.required])

  });




  get f() {
    return this.myForm.controls;
  }


  /*pdf */
  pdfForm = new FormGroup({

    name: new FormControl('', [Validators.required, Validators.minLength(3)]),

    file: new FormControl('', [Validators.required]),

    fileSource: new FormControl('', [Validators.required])

  });


  get pdfF() {
    return this.pdfForm.controls;
  }



  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageSrc = reader.result as string;
        this.myForm.patchValue({
          fileSource: reader.result
        });
      };
    }
  }

  onPdfChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.pdf = reader.result as string;
        this.pdfForm.patchValue({
          fileSource: reader.result
        });
      };
    }
  }


  constructor(
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,) {

    this.publisherForm = this.formBuilder.group({
      pubs: this.formBuilder.array([], [Validators.required])

    })
    this.authorForm = this.formBuilder.group({
      auths: this.formBuilder.array([], [Validators.required])

    })
  }


  ngOnInit(): void {
    this.getAllCategories();
    this.getAllPublishers();
    this.getAllAuthors();
  }

  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }

  onChangeFileInput(): void {
    const files: { [key: string]: File } = this.fileInput.nativeElement.files;
    this.file = files[0];
  }


  cancel() {
    this.router.navigate(['book']);
  }

  getKeys(obj: any): Array<string> {
    return Object.keys(obj);
  }

  getAllCategories() {
    const url: string = "http://localhost:8082/category/all";
    this.http.request('get', url).subscribe(
      (data: any) => {
        console.warn("data: ", data);
        this.categories = data.categories;

        // console.log("subcategories: " + this.categories.subcategories);
      },
      error => {
        console.warn("error: ", error);
      });
  }

  getAllPublishers() {
    const url: string = "http://localhost:8082/publisher/all";
    this.http.request('get', url).subscribe(
      (data: any) => {
        console.warn("data: ", data);
        this.publishers = data.publishers;
      },
      error => {
        console.warn("error: ", error);
      });
  }

  getAllAuthors() {
    const url: string = "http://localhost:8082/author/all";
    this.http.request('get', url).subscribe(
      (data: any) => {
        console.warn("data: ", data);
        this.authors = data.authors;
      },
      error => {
        console.warn("error: ", error);
      });
  }

  onAuthorsCheckboxChange(e) {
    const auths: FormArray = this.authorForm.get('auths') as FormArray;
    if (e.target.checked) {
      auths.push(new FormControl(e.target.value));
    } else {
      const index = auths.controls.findIndex(x => x.value === e.target.value);
      auths.removeAt(index);
    }
  }

  onPublishersCheckboxChange(e) {
    const pubs: FormArray = this.publisherForm.get('pubs') as FormArray;
    if (e.target.checked) {
      pubs.push(new FormControl(e.target.value));
    } else {
      const index = pubs.controls.findIndex(x => x.value === e.target.value);
      pubs.removeAt(index);
    }
  }

  form = new FormGroup({

    category: new FormControl('', Validators.required)

  });

  subCategoryform = new FormGroup({
    subcategory: new FormControl('', Validators.required)
  })

  changeCategory(e) {
    console.log("form vlaue: ", e.target.value);
    console.log("form vlaue: ", this.form.value);
    const url: string = "http://localhost:8082/category/boId";
    this.http.post(url, this.form.value).subscribe(
      (data: any) => {
        console.warn("data: ", data);
        this.subcategories = data.subcategories;
      },
      error => {
        console.warn("error: ", error);
      });
  }

  save() {
    this.json.imageSrc = this.imageSrc;
    this.json.pdf = this.pdf;
    this.json.authors = this.authorForm.value.auths;
    this.json.publishers = this.publisherForm.value.pubs;
    this.json.profileName = this.myForm.value.file;
    this.json.pdfName = this.pdfForm.value.file;
    this.json.category = this.form.value.category;
    this.json.subCategory = this.subCategoryform.value.subcategory;

    console.log("json", this.json)
    const url: string = "http://localhost:8082/operation/saveBook";
    this.http.post(url, this.json).subscribe(
      (data: any) => {
        console.warn("data: ", data);
        if (data.status == "1")
          this.successDialog();
        else this.failDialog();
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