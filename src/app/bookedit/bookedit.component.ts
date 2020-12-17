import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IntercomService } from '../framework/intercom.service'
import { DatePipe } from '@angular/common';
import { MatDateRangePickerInput } from '@angular/material/datepicker/date-range-picker';
@Component({
  selector: 'app-bookedit',
  templateUrl: './bookedit.component.html',
  styleUrls: ['./bookedit.component.styl'],
  providers:[DatePipe]
})

export class BookeditComponent implements OnInit {

  
  boId: string;
  json = { "profileName": "", "pdfName": "", "category": "", "subCategory": "", "authors": "", "publishers": "", "imageSrc": "", "pdf": "", "downloadApproval": "", "title": "", "ISBN": "", "sort": "", "publishedDate": "", "edition": "", "volume": "", "seriesIndex": "", "callNo": "", "description": "" };
  categories = [];
  subcategories = [];
  publishers = [];
  authors = [];

  @ViewChild('fileInput') fileInput;
  file: File | null = null;
  imageSrc: string;
  pdf: string;

  emptyData = {};

  publisherForm: FormGroup;
  authorForm: FormGroup;
  term: string;
  publisherTerm: string;
  authorTerm: string;
  subCategoryTerm: string;
  categoryTerm: string;

  authorList = [];
  categoryBoId: string = '';
  subCategoryBoId: string = '';
  publisherList = [];
  selectedRadio: any;
  selectedEntry;
  selectedPublishers = [];
  selectedAuthors = [];
  userRole = "";

  onSelectionChange(entry) {
    this.selectedEntry = entry;
  }

  checkAuthorContainOrNot(boId) {
    return this.authorList.includes(boId);

  }

  checkPublisherContainOrNot(boId) {
    return this.publisherList.includes(boId);
  }

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

  datePickerForm = new FormGroup({
    selectedDate : new FormControl('', [Validators.required])
  })

  constructor(
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private actRoute: ActivatedRoute,
    public datePipe: DatePipe,
    private ics: IntercomService) {

    this.userRole = this.ics.userRole;
    this.boId = this.actRoute.snapshot.params.boId;

    this.publisherForm = this.formBuilder.group({
      pubs: this.formBuilder.array([], [Validators.required])

    })
    this.authorForm = this.formBuilder.group({
      auths: this.formBuilder.array([], [Validators.required])

    })
    
  }

  ngOnInit(): void {
    console.log("heerefjksdfjk")
    this.findByBoId();
    this.getAllCategories();
    this.getAllPublishers();
    this.getAllAuthors();
  }


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
    this.http.request('get', url ,{
      headers: header
      }).subscribe(
      (data: any) => {
        this.categories = data.categories;
        console.log(" this.categories: ", this.categories)
      },
      error => {
        console.warn("error: ", error);
      });
  }

  getAllPublishers() {
    const url: string = this.ics.apiRoute + "/publisher/all";
    this.http.request('get', url).subscribe(
      (data: any) => {
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
        this.authors = data.authors;
      },
      error => {
        console.warn("error: ", error);
      });
  }

  form = new FormGroup({
    category: new FormControl('', Validators.required),
  });


  changeCategory(e) {
    const url: string = this.ics.apiRoute + "/category/boId";
    this.http.post(url, this.form.value).subscribe(
      (data: any) => {
        this.subcategories = data.subcategories;
        console.log(" this.subcategories:  ", this.subcategories)
        console.log(" subCategoryBoId boid:  ", this.subCategoryBoId)

      },
      error => {
        console.warn("error: ", error);
      });
  }


  onChange(boId: string, isChecked: boolean) {
    const auths = <FormArray>this.authorForm.controls.auths;
    if (isChecked) {
      auths.push(new FormControl(boId));
    } else {
      let index = auths.controls.findIndex(x => x.value == boId)
      auths.removeAt(index);
    }
  }

  onPublisherChange(boId: string, isChecked: boolean) {
    const pubs = <FormArray>this.publisherForm.controls.pubs;
    if (isChecked) {
      pubs.push(new FormControl(boId));
    } else {
      let index = pubs.controls.findIndex(x => x.value == boId)
      pubs.removeAt(index);
    }
  }

  approveDialog() {
    const dialogRef = this.dialog.open(ApproveDialog, {
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("Approve !!!!!!!!!")
      this.save();
    });

  }

  approve(){
    this.approveDialog();
  }

  save() {
    this.json.imageSrc = this.imageSrc;
    this.json.pdf = this.pdf;
    this.json.profileName = this.myForm.value.file;
    this.json.pdfName = this.pdfForm.value.file;
    this.json.category = this.form.value.category;
    this.json.publishers = this.publisherForm.value.pubs;
    this.json.authors = this.authorForm.value.auths;
    this.json.category = this.form.value.category == '' ? this.categoryBoId : this.form.value.category;
    this.json.subCategory = this.selectedEntry == undefined ? this.subCategoryBoId : this.selectedEntry;
    // this.json.publishedDate = this.datePipe.transform(this.json.publishedDate, 'MM/dd/yyyy');

    console.log("this.json: ", this.json)
    const url: string = this.ics.apiRoute + "/operation/editBook";
    this.http.post(url, this.json).subscribe(
      (data: any) => {
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


    console.log("find by boid.........................")
    const json = {
      boId: this.boId
    }

    const url: string = this.ics.apiRoute + "/book/boId";
    this.http.post(url, json).subscribe(
      (data: any) => {
        this.subcategories = data.book.category.subCategories;
        this.json.publishedDate = data.book.publishedDate
        console.log("book by boId: ",  data.book.boId)

        this.json = data.book;
        console.log(data.book.seriesIndex)
        this.datePickerForm.value.selectedDate = this.json.publishedDate;
        // this.json.publishedDate = this.datePipe.transform(this.json.publishedDate, 'MM/dd/yyyy');
        
        console.log("PUBLISHED DATE:", this.json.publishedDate)

        //this.json.downloadApproval = data.book.downloadApproval == "false" ? "" : "true";

        this.json.description = data.book.comment == null ? "" : data.book.comment.description;
        this.imageSrc = this.ics.apiRoute + data.book.coverPhoto;
        this.json.profileName = data.book.coverPhoto;
        this.json.pdfName = data.book.path;
        
        data.book.authors.forEach(element => {
          this.authorList.push(element.boId);
          this.authorTerm = element.name;
          this.onChange(element.boId, true);

        });

        data.book.publishers.forEach(element => {
          this.onPublisherChange(element.boId, true);
        });

        this.form.value.category = data.book.category.boId;
        this.categoryTerm = data.book.category.myanmarName;
        this.subCategoryTerm = data.book.subCategory.name;
        this.categoryBoId = data.book.category.boId;
        this.subCategoryBoId = data.book.subCategory.boId;
        data.book.publishers.forEach(element => {
          this.publisherList.push(element.boId);
        });
      },
      error => {
        console.warn("error: ", error);
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
        "title": "Unable to edit book!!",
        "message": data.msg
      }
    });

    dialogRef.afterClosed().subscribe(result => {
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
    @Inject(MAT_DIALOG_DATA) public data: {title:string, message:string}
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}


@Component({
  selector: 'approve-dialog',
  templateUrl: './approve-dialog.html',
})
export class ApproveDialog {

  constructor(
    public dialogRef: MatDialogRef<ApproveDialog>,
    
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
