import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { IntercomService } from '../framework/intercom.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-advertise',
  templateUrl: './advertise.component.html',
  styleUrls: ['./advertise.component.styl']
})
export class AdvertiseComponent implements OnInit {

  @ViewChild('mobileFileInput')
  mobileFileInput: any;

  @ViewChild('fileInput')
  fileInput: any;

  @ViewChild('pdfInput')
  pdfInput: any;

  mobileForm = new FormGroup({
    mobileFile: new FormControl('', [Validators.required]),

    fileSource: new FormControl('', [Validators.required])
  });


  myForm = new FormGroup({

    file: new FormControl('', [Validators.required]),

    fileSource: new FormControl('', [Validators.required])
  });

  pdfForm = new FormGroup({

    fileSource: new FormControl('', [Validators.required])

  });
  userRole = "";
  submitted = false;

  images = [];
  pdfShow = [];

  mobileImage: string;
  mobileImageName: string;
  imageName: string;
  image: string;
  pdfName: string;
  pdf: string;
  emptyData: {};

  mobileImageError = "";
  imageError = "";
  data = { "msg": "" };
  isMobileImageSaved: boolean;
  isImageSaved: boolean;

  selected = 0;
  websiteLink: string;
  json = {};
  imageSrc: string;
  constructor(
    private ics: IntercomService,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
  ) {
    this.userRole = this.ics.userRole;
  }

  ngOnInit(): void {

  }
  get f() { return this.myForm.controls; }
  get pdff() { return this.pdfForm.controls; }
  get mobileF() { return this.mobileForm.controls; }

  onFileChange(fileInput: any) {
    this.imageError = null;

    if (fileInput.target.files && fileInput.target.files[0]) {
      // Size Filter Bytes
      // const max_size = 20971520;
      // const max_size = 100;
      // const allowed_types = ['image/png', 'image/jpeg'];
      const height = 268;
      const width = 1170;

      // if (fileInput.target.files[0].size > max_size) {
      //     this.imageError =
      //         'Maximum size allowed is ' + max_size / 1000 + 'Mb';

      //     return false;
      // }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];
          // if (img_height != height && img_width != width) {
          //   this.imageError =
          //     'Width and height of image must be 1170*268 px.';
          //   this.data.msg = this.imageError;
          //   this.fileInput.nativeElement.value = '';
          //   this.failDialog(this.data.msg);
          //   return false;
          // } else {
            const imgBase64Path = e.target.result;
            this.image = imgBase64Path;
            this.imageName = fileInput.target.files[0].name;
            this.isImageSaved = true;
          //}
        };
      };

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  mobileFileChange(mobileFileInput: any) {
    this.mobileImage = "";
    this.mobileImageName = "";
    this.mobileImageError = null;

    if (mobileFileInput.target.files && mobileFileInput.target.files[0]) {

      const height = 350;
      const width = 991;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];
          // if (img_height != height && img_width != width) {
          //     this.mobileImageError =
          //         'Width and height of image must be 991*350 px.';
          //     this.data.msg = this.mobileImageError;
          //     this.mobileFileInput.nativeElement.value = '';
          //     this.failDialog(this.data.msg);
          //     return false;
          // }else {
          const imgBase64Path = e.target.result;
          this.mobileImage = imgBase64Path;
          this.mobileImageName = mobileFileInput.target.files[0].name;
          this.isMobileImageSaved = true;
          //}
        };
      };

      reader.readAsDataURL(mobileFileInput.target.files[0]);
    }
  }


  removeImage() {
    this.image = null;
    this.isImageSaved = false;
  }


  radioChange1() {
    if (this.selected == 1) {
      this.websiteLink = "";
    }
    else if (this.selected == 2) {
      this.pdf = "";
      this.pdfName = "";
    }
  }


  onPdfChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.pdf = reader.result as string;
        this.pdfName = event.target.files[0].name;
        this.pdfForm.patchValue({
          fileSource: reader.result
        });
      };
    }
  }

  cancel() {
    this.router.navigate(['book']);
  }
  save() {
    this.submitted = true;


    if (this.selected == 1) {
      this.json = {
        "mobileImageName": this.mobileImageName,
        "mobileImage": this.mobileImage,
        "imageName": this.imageName,
        "image": this.image,
        "pdfName": this.pdfName,
        "pdfLink": this.pdf
      }
    }
    else if (this.selected == 2) {
      this.json = {
        "mobileImageName": this.mobileImageName,
        "mobileImage": this.mobileImage,
        "imageName": this.imageName,
        "image": this.image,
        "pdfName": "",
        "pdfLink": this.websiteLink
      }
    }
    else if (this.selected == 0) {
      this.json = {
        "mobileImageName": this.mobileImageName,
        "mobileImage": this.mobileImage,
        "imageName": this.imageName,
        "image": this.image,
        "pdfName": "",
        "pdfLink": ""
      }
    }
    const url = this.ics.apiRoute + "/operation/uploadImage";

    console.log("this.json !!!!!!!!", this.json)
    this.http.post(url, this.json).subscribe(
      (data: any) => {
        console.warn("data: ", data);
        if (data.status == "1") {
          this.successDialog();
        }
        else this.failDialog(data.msg);
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

  failDialog(message) {
    const dialogRef = this.dialog.open(FailDialog, {
      data: {
        "title": "Unable to add advertisement!!",
        "message": message
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
