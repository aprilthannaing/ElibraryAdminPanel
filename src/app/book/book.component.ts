import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Event, Router, RouterEvent, NavigationStart, NavigationEnd } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IntercomService } from '../framework/intercom.service';

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
  loading = "false";

  bookCount = 0;
  authorCount = 0;
  publisherCount = 0;
  categoryCount = 0;
  subcategoryCount = 0;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private router: Router,
    private ics: IntercomService) { }

  ngOnInit(): void {
     this.getBookCount();
    this.getAuthorCount();
    this.getPublisherCount();
    this.getCategoryCount();
    this.getSubCategoryCount();
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
        this.loading= "false";
      },
      error => {
        console.warn("error: ", error);
      });
  }

  getAllAuthors() {
    const url: string = this.ics.apiRoute + "/author/all";
    this.http.request('get', url).subscribe(
      (data: any) => {
        console.warn("data: ", data);
        this.authors = data.authors;
        data.authors.forEach(element => {
          console.log(this.ics.apiRoute + "/" + element.profilePicture)
        });
        this.loading= "false";
      },
      error => {
        console.warn("error: ", error);
      });
  }

  getAllCategories() {
    const url: string = this.ics.apiRoute + "/category/all";
    this.http.request('get', url).subscribe(
      (data: any) => {
        this.categories = data.categories;
        this.loading= "false";
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
        this.loading= "false";
        console.log("categories: ", data.subcategories)

      },
      error => {
        console.warn("error: ", error);
      });
  }

  getAllBooks() {
    const url: string = this.ics.apiRoute + "/book/all";
    this.http.request('get', url).subscribe(
      (data: any) => {
        this.books = data.books;
        this.loading= "false";
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

  showAuthors() {
    this.loading = "true";
    this.getAllAuthors();
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
    console.log("click event: ", e.target.value)
    for (let i = 0; i < this.books.length; ++i) {
      if (this.books[i].boId === e.target.value) {
        this.books.splice(i, 1);

        const json = {
          bookId: e.target.value
        }
        const url: string = this.ics.apiRoute + "/operation/deleteBook";
        this.http.post(url, json).subscribe(
          (data: any) => {
            console.log("response: ", data);
          },
          error => {
            console.log("error ", error);
          });
      }
    }
  }

  editAuthor(e) {
    console.log("click event: ", e.target.value)

  }

  deleteAuthor(e) {
    console.log("click event: ", e.target.value)
    for (let i = 0; i < this.authors.length; ++i) {
      if (this.authors[i].boId === e.target.value) {
        this.authors.splice(i, 1);

        const json = {
          authorId: e.target.value
        }
        const url: string = this.ics.apiRoute + "/operation/deleteAuthor";
        this.http.post(url, json).subscribe(
          (data: any) => {
            console.log("response: ", data);
          },
          error => {
            console.log("error ", error);
          });
      }
    }
  }

  editPublisher(e) {
    console.log("click event: ", e.target.value)

  }

  deletePublisher(e) {
    console.log("click event: ", e.target.value)
    for (let i = 0; i < this.publishers.length; ++i) {
      if (this.publishers[i].boId === e.target.value) {
        this.publishers.splice(i, 1);

        const json = {
          publisherboId: e.target.value
        }
        const url: string = this.ics.apiRoute + "/operation/deletePublisher";
        this.http.post(url, json).subscribe(
          (data: any) => {
            console.log("response: ", data);
          },
          error => {
            console.log("error ", error);
          });
      }
    }
  }

  editCategory(e) {
    console.log("click event: ", e.target.value)

  }

  deleteCategory(e) {
    console.log("click event: ", e.target.value)
    for (let i = 0; i < this.categories.length; ++i) {
      if (this.categories[i].boId === e.target.value) {
        this.categories.splice(i, 1);

        const json = {
          categoryboId: e.target.value
        }
        const url: string = this.ics.apiRoute + "/operation/deleteCategory";
        this.http.post(url, json).subscribe(
          (data: any) => {
            console.log("response: ", data);
          },
          error => {
            console.log("error ", error);
          });
      }
    }
  }

  editSubCategory(e) {
    console.log("click event: ", e.target.value)


  }

  deleteSubCategory(e) {
    console.log("click event: ", e.target.value)
    for (let i = 0; i < this.subcategories.length; ++i) {
      if (this.subcategories[i].boId === e.target.value) {
        this.subcategories.splice(i, 1);

        const json = {
          subCategoryboId: e.target.value
        }
        const url: string = this.ics.apiRoute + "/operation/deleteSubCategory";
        this.http.post(url, json).subscribe(
          (data: any) => {
            console.log("response: ", data);
          },
          error => {
            console.log("error ", error);
          });
      }
    }
  }
}
