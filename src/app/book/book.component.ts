
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Event, Router, RouterEvent, NavigationStart, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IntercomService } from '../framework/intercom.service';
import { stringify } from 'querystring';
import { ConvertActionBindingResult } from '@angular/compiler/src/compiler_util/expression_converter';


@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.styl']
})
export class BookComponent implements OnInit {
  @ViewChild('replyInput')
  replyInput: any;

  userRole = "";
  publishers = [];
  authors = [];
  categories = [];
  subcategories = [];
  books = [];
  advertisements = [];
  showBook = "false";
  showAuthor = "false";
  showPublisher = "false";
  showCategory = "false";
  showSubCategory = "false";
  showAdvertisement = "false";
  countNext = "false";
  loading = "false";

  config: any;
  authorConfig: any;

  selected: string;

  term: string;
  searchBooks = [];

  authorTerm: string;
  searchAuthors = [];

  bookCount = 0;
  authorCount = 0;
  publisherCount = 0;
  categoryCount = 0;
  subcategoryCount = 0;
  feedbackCount = 0;
  advertisementCount = 0;
  advertisementImage: string;

  lastPage: string;
  totalCount: string;

  last: string;
  count: string;

  currentPage: any;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private router: Router,
    private ics: IntercomService) {
    this.config = {
      itemsPerPage: 10,
      currentPage: this.currentPage,
      totalItems: 0
    },
      this.authorConfig = {
        itemsPerPage: 10,
        currentPage: this.currentPage,
        totalItems: 0
      }
    this.userRole = this.ics.userRole;
  }

  radioChange1() {
    console.log(this.selected)
    this.getAllAuthors();

  }

  ngOnInit(): void {
    this.currentPage = "1";
    this.config.currentPage = this.currentPage;
    this.authorConfig.currentPage = this.currentPage;

    this.getBookCount();
    this.getAuthorCount();
    this.getPublisherCount();
    this.getCategoryCount();
    this.getSubCategoryCount();
    this.getAdvertisementCount();
    this.getFeedbackCount();
  }

  searchByKeywords() {
    if(!this.term){
      this.failDialog("Please enter you want to search!");
    }else{
      console.log(this.term)
      const json = {
        "page": this.config.currentPage,
        "user_id": "USR2",
        "category_id": "",
        "sub_category_id": "",
        "author_id": "",
        "start_date": "",
        "end_date": "",
        "searchTerms": this.term
      }
      console.log(json)
      const header: HttpHeaders = new HttpHeaders({
        token: this.ics.token
      });
      const url: string = this.ics.apiRoute + "/search/book";
      this.http.post(url, json, {
        headers: header
      }).subscribe(
        (data: any) => {
          this.config.currentPage = data.current_page;
          this.config.totalItems = data.total_count;
          this.searchBooks = data.books;
          this.books = this.searchBooks;
          console.log(this.books)
        },
        error => {
          console.warn("error:", error);
        }
      )
      return this.searchBooks;
    }
    
  }
  changedBySearch(event) {
    this.config.currentPage = event;
    console.log(this.config.currentPage)
    this.books = this.searchByKeywords();
    console.log(this.books)

  }

  searchAuthorByKeywords() {
    if(!this.authorTerm){
      this.failDialog("Please enter you want to search!");
    }else{
      const json = {
        "page": this.config.currentPage,
        "name": this.authorTerm
      }
      console.log(json)
      const header: HttpHeaders = new HttpHeaders({
        token: this.ics.token
      });
      const url = this.ics.apiRoute + "/author/search";
  
      this.http.post(url, json, {
        headers: header
      }).subscribe(
        (data: any) => {
          console.log(data)
          if(data.err_msg == "Unauthorized Request")
            this.loginDialog();
          this.authorConfig.currentPage = data.current_page;
          this.authorConfig.totalItems = data.total_count;
          this.searchAuthors = data.author;
          this.authors = this.searchAuthors;
          console.log(this.authors)
        },
        error => {
          console.warn("error:", error);
        }
      )
      return this.searchAuthors;
    }
    
  }

  authorBySearch(event) {
    this.authorConfig.currentPage = event;
    console.log(this.authorConfig.currentPage)
    this.authors = this.searchAuthorByKeywords();
  }

  getBookCount() {
    const url: string = this.ics.apiRoute + "/book/count";
    this.http.request('get', url).subscribe(
      (data: any) => {
        console.warn("book count: ", data);
        this.bookCount = data;

      },
      error => {
        console.warn("error: ", error);
      });
  }

  getAuthorCount() {
    const url: string = this.ics.apiRoute + "/author/count";
    this.http.request('get', url).subscribe(
      (data: any) => {
        console.warn("author count: ", data);
        this.authorCount = data;

      },
      error => {
        console.warn("error: ", error);
      });
  }

  getPublisherCount() {
    const url: string = this.ics.apiRoute + "/publisher/count";
    this.http.request('get', url).subscribe(
      (data: any) => {
        console.warn("book count: ", data);
        this.publisherCount = data;

      },
      error => {
        console.warn("error: ", error);
      });
  }

  getCategoryCount() {
    const url: string = this.ics.apiRoute + "/category/count";
    this.http.request('get', url).subscribe(
      (data: any) => {
        console.warn("category count: ", data);
        this.categoryCount = data;

      },
      error => {
        console.warn("error: ", error);
      });
  }

  getSubCategoryCount() {
    const url: string = this.ics.apiRoute + "/subcategory/count";
    this.http.request('get', url).subscribe(
      (data: any) => {
        console.warn("sub category count: ", data);
        this.subcategoryCount = data;

      },
      error => {
        console.warn("error: ", error);
      });
  }

  getAdvertisementCount() {
    const url: string = this.ics.apiRoute + "/operation/advertisementCount";
    this.http.request('get', url).subscribe(
      (data: any) => {
        this.advertisementCount = data;
      },
      error => {
        console.warn("error: ", error);
      });
  }

  getFeedbackCount() {
    const url: string = this.ics.apiRoute + "/operation/feedbackCount";
    this.http.request('get', url).subscribe(
      (data: any) => {
        console.warn("feedback count: ", data);
        this.feedbackCount = data;

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
        this.loading = "false";
      },
      error => {
        console.warn("error: ", error);
      });
  }

  authorPageChanged(event) {
    this.authorConfig.currentPage = event;
    this.getAllAuthors();
  }

  getAllAuthors() {
    const json = {
      "selected": this.selected,
      "page": this.authorConfig.currentPage
    }
    console.log(json)
    const url: string = this.ics.apiRoute + "/author/allBySelected";
    this.http.post(url, json).subscribe(
      (data: any) => {
        console.warn("data: ", data);
        this.authors = data.authors;
        this.authorConfig.totalItems = data.total_count;
        data.authors.forEach(element => {
          console.log(this.ics.apiRoute + "/" + element.profilePicture)
        });
        this.loading = "false";
      },
      error => {
        console.warn("error: ", error);
      });
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
        if(data.err_msg == "Unauthorized Request")
          this.loginDialog();
        this.categories = data.categories;
        console.log(" data.categories!!!" + data.categories)


        this.loading = "false";
      },
      error => {
        console.warn("error: ", error);
      });
  }

  getAllSubCategories() {

    const url: string = this.ics.apiRoute + "/subcategory/all";
    this.http.request('get', url).subscribe(
      (data: any) => {
        this.subcategories = data.subcategories;
        this.loading = "false";
        console.log("categories: ", data.subcategories)

      },
      error => {
        console.warn("error: ", error);
      });
  }


  getAllBooks() {
    const json = {
      "page": this.config.currentPage,
      "title": "all",
      "user_id": "USR1"
    }
    console.log(json)
    const header: HttpHeaders = new HttpHeaders({
      token: this.ics.token
    });

    const url: string = this.ics.apiRoute + "/book";
    this.http.post(url, json,
      {
        headers: header
      }
    ).subscribe(
      (data: any) => {
        console.log(data)
        if(data.message == "Unauthorized Request")
          this.loginDialog();
        this.books = data.books;
        this.last = data.last_page;
        this.count = data.total_count;
        this.config.totalItems = data.total_count;
        console.log(this.last)
        console.log(this.count)
        this.loading = "false";

      },
      error => {
        console.warn("error: ", error);
      });
  }

  pageChanged(event) {
    this.config.currentPage = event;
    if(!this.term)
      this.getAllBooks();
    else{
      this.searchByKeywords();
    }
    
  }

  getAllAdvertisements(){
    const header: HttpHeaders = new HttpHeaders({
      token: this.ics.token
    });

    const url: string = this.ics.apiRoute + "/operation/getAdvertisements";
    this.http.request("get", url, 
    {
      headers: header
    }).subscribe(
      (data : any)=> {
        console.warn("data:" + data)
        if(data.message == "Unauthorized Request")
          this.loginDialog();
        this.advertisements = data.advertisements;
        console.log(this.advertisements)
        // for(let i=0; i<this.advertisements.length; i++){

        // }
        // this.advertisementImage = "http://localhost:8080/" + this.advertisementImage[]
        this.loading = "false";

      },
      error => {
        console.warn("error: ", error);
      });
  }


  showBooks() {
    this.loading = "true";
    this.getAllBooks();
    this.showBook = "true";
    this.showAuthor = "false"
    this.showCategory = "false"
    this.showSubCategory = "false"
    this.showPublisher = "false"
  }

  countNextPage() {
    this.loading = "true";
    this.getNextPage();
    this.countNext = "true";
    this.showBook = "false";
    this.showAuthor = "false"
    this.showCategory = "false"
    this.showSubCategory = "false"
    this.showPublisher = "false"
  }
  getNextPage() {

  }

  showAuthors() {
    this.loading = "false";
    // this.getAllAuthors();
    this.showAuthor = "true";
    this.showCategory = "false"
    this.showSubCategory = "false"
    this.showPublisher = "false"
    this.showBook = "false";
  }

  showPublishers() {
    this.loading = "true"
    this.getAllPublishers();
    this.showPublisher = "true";
    this.showAuthor = "false";
    this.showCategory = "false"
    this.showSubCategory = "false"
    this.showBook = "false";
  }

  showCategories() {
    this.loading = "true"
    this.getAllCategories();
    this.showCategory = "true";
    this.showSubCategory = "false"
    this.showBook = "false";
    this.showPublisher = "false";
    this.showAuthor = "false";
  }

  showSubCategories() {
    this.loading = "true";
    this.getAllSubCategories();
    this.showSubCategory = "true";
    this.showPublisher = "false";
    this.showAuthor = "false";
    this.showCategory = "false"
    this.showBook = "false";
  }

  showAdvertisements(){
    this.loading = "true";
    this.getAllAdvertisements();
    this.showAdvertisement = "true";
    this.showBook = "false";
    this.showSubCategory = "false";
    this.showCategory = "false";
    this.showPublisher = "false";
    this.showAuthor = "false";
  }

  deleteBook(e) {
    this.alertDialog({}, e.target.value)
  }

  deleteAdvertisement(e){
    this.confirmDialog();

    const url: string = this.ics.apiRoute + "/operation/deleteAdvertisement";
    const header: HttpHeaders = new HttpHeaders({
      token: this.ics.token
    });
    const json = {
      "boId": e.target.value
    }
    this.http.post(url, json, {
      headers : header
    }).subscribe(
      (data: any) => {
        console.log(data)
        if(data.err_msg == "Unauthorized Request")
          this.loginDialog();
        
      },
      error => {
        console.warn("error:", error);
      })
  }

  alertDialog(data, boId) {
    const dialogRef = this.dialog.open(AlertDialog, {
      data: {
        "boId": boId,
        "books": this.books,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

  }

  editAuthor(e) {
    console.log("click event: ", e.target.value)

  }

  editPublisher(e) {
    console.log("click event: ", e.target.value)

  }

  editCategory(e) {
    console.log("click event: ", e.target.value)

  }

  editSubCategory(e) {
    console.log("click event: ", e.target.value)
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
      data:{ 
        "title": "Unable to search!!",
        "message": message
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

  }

  confirmDialog() {
    const dialogRef = this.dialog.open(ConfirmDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

  }
}


@Component({
  selector: 'alert-dialog',
  templateUrl: './alert-dialog.html',
})
export class AlertDialog {

  constructor(
    private router: Router,
    private http: HttpClient,
    private actRoute: ActivatedRoute,
    private ics: IntercomService,
    public dialogRef: MatDialogRef<AlertDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { books: [{ boId }], boId: string }
  ) { }


  cancel(): void {
    this.dialogRef.close();
  }

  submit(): void {

    for (let i = 0; i < this.data.books.length; ++i) {
      if (this.data.books[i].boId === this.data.boId) {
        this.data.books.splice(i, 1);
      }
    }

    console.log("this.data.boId: ", this.data.boId)
    this.dialogRef.close();
    const json = {
      bookId: this.data.boId
    }
    const url: string = this.ics.apiRoute + "/operation/deleteBook";
    this.http.post(url, json).subscribe(
      (data: any) => {
        console.log("delete book: ", data);
      },
      error => {
        console.log("error ", error);
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

  @Component({
    selector: 'confirm-dialog',
    templateUrl: './confirm-dialog.html',
  })
  export class ConfirmDialog {
  
    constructor(
      public dialogRef: MatDialogRef<ConfirmDialog>,
      public router: Router,
    ) { }
  
    confirm(): void {
      this.dialogRef.close();
      
    }
  }


