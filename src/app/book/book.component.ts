import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Event, Router, RouterEvent, NavigationStart, NavigationEnd } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.styl']
})
export class BookComponent implements OnInit {
  @ViewChild('fileInput') fileInput;

  file: File | null = null;

  imageSrc: string;

  json = { "name": "", "ISBN": "", "publisher": "", "publishedYear": "", "edition": "", "categoryType": "", "authorType": "", "authorName": "" };

  myForm = new FormGroup({

    name: new FormControl('', [Validators.required, Validators.minLength(3)]),

    file: new FormControl('', [Validators.required]),

    fileSource: new FormControl('', [Validators.required])

  });


  constructor(
    private http: HttpClient,
    public dialog: MatDialog,) { }

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

  submit() {
    console.log("submit!!!!!!!!!!!!", this.myForm.value);
    console.log("imageSrc!!!!!!!!!", this.imageSrc);
    console.log("json !!!!!!!!!!!!!", this.json);

  }

  ngOnInit(): void {
  }

  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }

  onChangeFileInput(): void {
    const files: { [key: string]: File } = this.fileInput.nativeElement.files;
    this.file = files[0];
    console.log("file!!!!!!!!!!!!", this.file);
  }

  save() {

  }

  cancel() {

  }

}
