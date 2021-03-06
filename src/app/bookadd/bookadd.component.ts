import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IntercomService } from '../framework/intercom.service';

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
  json = { "userId": "", "profileName": "", "pdfName": "", "category": "", "subCategory": "", "authors": "", "publishers": "", "imageSrc": "", "pdf": "", "downloadApproval": "", "title": "", "ISBN": "", "sort": "", "publishedDate": "", "edition": "", "volume": "", "seriesIndex": "", "accessionNo": "", "callNumber": "", "description": "", "authorName": "", "authorType": "", "publisherName": "", "publisherSort": "" };
  categories = [];
  subcategories = [];
  publishers = [];
  authors = [];
  term: string;
  publisherTerm: string;
  authorTerm: string;
  subCategoryTerm: string;
  selectedEntry;
  loading = false;
  apiRoute: string = '';

  authorType: string;
  authorName: string;
  emptyData = {};
  userRole = "";

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
    public dialog: MatDialog,
    private ics: IntercomService) {
    this.apiRoute = this.ics.apiRouteForImage;
    this.userRole = this.ics.userRole;
    this.publisherForm = this.formBuilder.group({
      pubs: this.formBuilder.array([], [Validators.required])

    })
    this.authorForm = this.formBuilder.group({
      auths: this.formBuilder.array([], [Validators.required])

    })
  }


  ngOnInit(): void {

    this.loading = true;
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
    const header: HttpHeaders = new HttpHeaders({
      token: this.ics.token
    });
    const url: string = this.ics.apiRoute + "/category/all";
    this.http.request('get', url, {
      headers: header
    }).subscribe(
      (data: any) => {
        console.warn("data: ", data);
        if (data.err_msg == "Unauthorized Request")
          this.loginDialog();
        this.categories = data.categories;
      },
      error => {
        console.warn("error: ", error);
      });
  }

  getAllPublishers() {
    const url: string = this.ics.apiRoute + "/publisher/all";
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
    const url: string = this.ics.apiRoute + "/author/all";
    this.http.request('get', url).subscribe(
      (data: any) => {
        this.loading = false;
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


  onSelectionChange(entry) {
    this.selectedEntry = entry;
  }

  addNewAuthor() {
    console.log("add new author !!!!!!!!!!!!!!")
    var newAuthor = document.getElementById("addNewAuthor");
    newAuthor.style.display = "block";
  }

  addNewPublisher() {
    var addNewPublisher = document.getElementById("addNewPublisher");
    addNewPublisher.style.display = "block";

  }

  save() {
    this.loading = true;
    this.json.pdf = this.pdf;
    this.json.authors = this.authorForm.value.auths;
    this.json.publishers = this.publisherForm.value.pubs;
    this.json.profileName = this.myForm.value.file;
    this.json.pdfName = this.pdfForm.value.file;
    var obj = { "category": "" };
    obj = this.form.value;
    this.json.category = obj.category;
    this.json.subCategory = this.selectedEntry;
    this.json.userId = this.ics.userId;
    console.log("book saving data: ", this.json);

    const url: string = this.ics.apiRoute + "/operation/saveBook";
    this.http.post(url, this.json).subscribe(
      (data: any) => {
        this.loading = false;
        if (data.status == "1")
          this.successDialog();
        else this.failDialog(data);
      },
      error => {
        this.loading = false;
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
        "title": "Unable to add book!!",
        "message": data.msg
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

  }
  loginDialog() {
    const dialogRef = this.dialog.open(LoginDialog, {
      data: {
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
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'login-dialog',
  templateUrl: './login-dialog.html',
})
export class LoginDialog {

  constructor(
    public dialogRef: MatDialogRef<LoginDialog>,
    public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { title: string }
  ) { }

  route(): void {
    this.dialogRef.close();
    this.router.navigate(['login']);
  }
}