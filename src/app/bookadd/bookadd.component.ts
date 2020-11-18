import { Component, OnInit,ViewChild } from '@angular/core';
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
  form: FormGroup;
  json = { "title": "", "ISBN": "", "sort": "", "publishedDate": "", "edition": "", "volume": "", "seriesIndex": "", "callNumber": "" };
  categories = [];
  term: string;

  /*img , pdf */
  myForm = new FormGroup({

    name: new FormControl('', [Validators.required, Validators.minLength(3)]),

    file: new FormControl('', [Validators.required]),

    fileSource: new FormControl('', [Validators.required])

  });


  constructor(
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,) {
      this.form = this.formBuilder.group({
        categories: this.formBuilder.array([], [Validators.required])
  
      })
     }

  get f() {

    return this.myForm.controls;

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
        this.myForm.patchValue({
          fileSource: reader.result
        });
      };
    }
  }

  save() {
    console.log("pdf!!!!!!!!!!!!", this.pdf);
    console.log("imageSrc!!!!!!!!!", this.imageSrc);
    console.log("json !!!!!!!!!!!!!", this.json);

  }

  ngOnInit(): void {
    this.getAllCategories();
  }

  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }

  onChangeFileInput(): void {
    const files: { [key: string]: File } = this.fileInput.nativeElement.files;
    this.file = files[0];
    console.log("file!!!!!!!!!!!!", this.file);
  }


  cancel(){
  this.router.navigate(['book']);
  }

  getAllCategories() {
    const url: string = "http://localhost:8082/category/all";
    this.http.request('get', url).subscribe(
      (data: any) => {
        console.warn("data: ", data);
        this.categories = data.categories;
      },
      error => {
        console.warn("error: ", error);
      });
  }
}
