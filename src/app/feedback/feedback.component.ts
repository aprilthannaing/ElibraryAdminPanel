import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IntercomService } from '../framework/intercom.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.styl']
})
export class FeedbackComponent implements OnInit {
  @ViewChild('replyInput')
  replyInput: any;

  replied: string;
  feedbackBoId = "";
  
  replyMessage = "";
  feedbacks = [];

  replyForm = new FormGroup({

    message: new FormControl('', [Validators.required, Validators.maxLength(50)])
  })
  get f() { return this.replyForm.controls; }

  submitted = false;
  constructor(
    private http: HttpClient,
    private ics: IntercomService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getAllFeedbacks();
  }

  getAllFeedbacks(){
  
      const header: HttpHeaders = new HttpHeaders({
        token: this.ics.token
      });
  
      const url: string = this.ics.apiRoute + "/operation/getFeedbacks";
      this.http.request("get", url,
        {
          headers: header
        }
      ).subscribe(
        (data: any) => {
          console.log(data)
          if(data.message == "Unauthorized Request")
            this.loginDialog();
          this.feedbacks = data.feedbacks;
  
        },
        error => {
          console.warn("error: ", error);
        });
    }

    loginDialog() {
      const dialogRef = this.dialog.open(LoginDialog, {
        data:{ 
          "title": "Please login first!!",
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
  
    }

    save(){
      this.submitted = true;
      this.replyMessage = this.replyForm.value;
      if (this.replyForm.invalid) {
        return;
      }
      console.log(this.replyMessage)
      const json = {"feedbackId":this.feedbackBoId,"message":this.replyMessage}
      const url = this.ics.apiRoute + "/operation/reply";
      const header: HttpHeaders = new HttpHeaders({
        token: this.ics.token
      });
      this.http.post(url, json,
        {
          headers: header
        }
      ).subscribe(
        (data: any) => {
          console.log(data)
          if(data.message == "Unauthorized Request")
            this.loginDialog();
            if (data.status == "1"){
              this.successDialog();
              this.replyInput.nativeElement.value = ' ';
              
            }
            else this.failDialog(data.msg);
  
        },
        error => {
          console.warn("error: ", error);
        });
    }
  
    cancel(event){
      this.replied = "false";
      event.target.style.color = '#0000FF';
    }

    reply(event){
      this.replied = "true";
      // this.feedback.boId = Reply.textContent;
      // console.log(Reply.textContent)
      this.feedbackBoId = event.target.value;
      event.target.style.color = ' #00cdac';
      console.log(this.feedbackBoId)
    
    }

    failDialog(message) {
      const dialogRef = this.dialog.open(FailDialog, {
        data:{ 
          "title": "Unable to reply!!",
          "message": message
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
  
    }

    successDialog() {
      const dialogRef = this.dialog.open(SuccessDialog, {
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
  
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
      @Inject(MAT_DIALOG_DATA) public data: {title: string}
    ) { }
  
    route(): void {
      this.dialogRef.close();
      this.router.navigate(['login']);
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


