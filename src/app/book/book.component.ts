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

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.getAllBooks();
    this.getAllAuthors();
    this.getAllPublishers();
    this.getAllCategories();
    this.getAllSubCategories();
  }

  getAllPublishers() {
    const url: string = "http://localhost:8082/publisher/all";
    this.http.request('get', url).subscribe(
      (data: any) => {
        console.warn("data: ", data);
        this.publishers = data.publishers;
      },
      error => {
        console.warn("error: ", error);
      });
  }

  getAllAuthors() {
    const url: string = "http://localhost:8082/author/all";
    this.http.request('get', url).subscribe(
      (data: any) => {
        console.warn("data: ", data);
        this.authors = data.authors;
      },
      error => {
        console.warn("error: ", error);
      });
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

  getAllSubCategories() {
    const url: string = "http://localhost:8082/subcategory/all";
    this.http.request('get', url).subscribe(
      (data: any) => {
        console.warn("data: ", data);
        this.subcategories = data.subcategories;
      },
      error => {
        console.warn("error: ", error);
      });
  }

  getAllBooks() {
    const url: string = "http://localhost:8082/book/all";
    this.http.request('get', url).subscribe(
      (data: any) => {
        console.warn("data: ", data);
        this.books = data.books;
      },
      error => {
        console.warn("error: ", error);
      });
  }
  showBooks() {
    this.showBook = "true";
    this.showAuthor = "false"
    this.showCategory = "false"
    this.showSubCategory = "false"
    this.showPublisher = "false"
  }

  showAuthors() {
    this.showAuthor = "true";
    this.showCategory = "false"
    this.showSubCategory = "false"
    this.showPublisher = "false"
    this.showBook = "false";
  }

  showPublishers() {
    this.showPublisher = "true";
    this.showAuthor = "false";
    this.showCategory = "false"
    this.showSubCategory = "false"
    this.showBook = "false";
  }

  showCategories() {
    this.showCategory = "true";
    this.showSubCategory = "false"
    this.showBook = "false";
    this.showPublisher = "false";
    this.showAuthor = "false";
  }

  showSubCategories() {
    this.showSubCategory = "true";
    this.showPublisher = "false";
    this.showAuthor = "false";
    this.showCategory = "false"
    this.showBook = "false";
  }

  editBook(e) {
    console.log("click event: ", e.target.value)    

  }

  deleteBook(e) {
    console.log("click event: ", e.target.value)
    for (let i = 0; i < this.books.length; ++i) {
      if (this.books[i].boId === e.target.value) {
        this.books.splice(i, 1);
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
      }
    }
  }

  
}
