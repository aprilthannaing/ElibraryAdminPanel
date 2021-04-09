import { Component, OnInit,Inject } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { IntercomService } from '../framework/intercom.service';
@Component({
  selector: 'app-bookaddauthor',
  templateUrl: './bookaddauthor.component.html',
  styleUrls: ['./bookaddauthor.component.styl']
})
export class BookaddauthorComponent implements OnInit {


  json = {
    "name": "", "sort": "", "authorType": "", "imageSrc":"", "profilePicture" : ""
  }

  emptyData = {};
  imageSrc: string = '';

  /*img , pdf */
  myForm = new FormGroup({

    name: new FormControl('', [Validators.required, Validators.minLength(3)]),

    file: new FormControl('', [Validators.required]),

    fileSource: new FormControl('', [Validators.required])

  });

  profilePicture: string = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private dialog: MatDialog,
    private ics: IntercomService
  ) { }


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

  ngOnInit(): void {
  }

  get f() {
    return this.myForm.controls;

  }

  cancel() {
    this.router.navigate(['book']);

  }
  searchKeyup(e: any) {
    if (e.which == 13) {
      this.save();
    }
  }

  save() {
    const url: string = this.ics.apiRoute + "/operation/saveAuthor"; 
    this.json.imageSrc = this.imageSrc;
    this.json.profilePicture = this.myForm.value.file; 
    this.http.post(url, this.json).subscribe(
      (data: any) => {
        console.warn("data: ", data);
        if(data.status == "1")
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
        "title":"Unable to add author!!",
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