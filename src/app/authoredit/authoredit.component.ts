import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IntercomService } from '../framework/intercom.service';
@Component({
  selector: 'app-authoredit',
  templateUrl: './authoredit.component.html',
  styleUrls: ['./authoredit.component.styl']
})
export class AuthoreditComponent implements OnInit {
  boId: string;
  flag = true;

  json = {
    "name": "", "sort": "", "authorType": "", "imageSrc": "", "profilePicture": ""
  }
  emptyData = {};

  constructor(private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private actRoute: ActivatedRoute,
    private ics: IntercomService) {
    this.boId = this.actRoute.snapshot.params.boId;
  }

  ngOnInit(): void {
    this.findByBoId();
  }

  ChangingValue(e){

  }

  findByBoId() {
    const json = {
      boId: this.boId
    }

    const url: string = this.ics.apiRoute + "/author/boId";
    this.http.post(url, json).subscribe(
      (data: any) => {
        console.warn("data: ", data);
        this.json = data.author;
        this.json.authorType = (data.author.authorType + "").toLowerCase();

        this.imageSrc = "http://localhost:8084/"+ data.author.profilePicture;
        console.log(this.imageSrc)
        this.myForm.value.file = this.json.profilePicture;
        console.log(this.myForm.value.file)
      },
      error => {
        console.warn("error: ", error);
      });

  }


  imageSrc: string = '';

  /*img , pdf */
  myForm = new FormGroup({

    name: new FormControl('', [Validators.required, Validators.minLength(3)]),

    file: new FormControl('', [Validators.required]),

    fileSource: new FormControl('', [Validators.required])

  });

  profilePicture: string = '';


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


  get f() {
    return this.myForm.controls;

  }

  cancel() {
    this.router.navigate(['book']);

  }

  save() {
    console.log(this.json)
    const url: string = this.ics.apiRoute + "/operation/editAuthor";
    this.json.imageSrc = this.imageSrc;
    this.json.profilePicture = this.myForm.value.file;
    console.log(this.json.profilePicture)
    console.log("json: ", this.json)
    this.http.post(url, this.json).subscribe(
      (data: any) => {
        console.warn("data: ", data);
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
        "title": "Unable to edit author!!",
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
