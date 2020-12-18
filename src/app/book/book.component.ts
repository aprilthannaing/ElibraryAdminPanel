import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Event, Router, RouterEvent, NavigationStart, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IntercomService } from '../framework/intercom.service';
import { stringify } from 'querystring';


@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.styl']
})
export class BookComponent implements OnInit {

  publishers = [];
  authors = [];
  categories = [];
  subcategories = [];
  books = [];
  showBook = "false";
  showAuthor = "false";
  showPublisher = "false";
  showCategory = "false";
  showSubCategory = "false";
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
  }

  searchByKeywords() {
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
  changedBySearch(event) {
    this.books = this.searchByKeywords();
    console.log(this.books)

  }

  searchAuthorByKeywords() {

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

  authorBySearch(event) {
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
    this.getAllBooks();
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

  deleteBook(e) {
    this.alertDialog({}, e.target.value)
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
  