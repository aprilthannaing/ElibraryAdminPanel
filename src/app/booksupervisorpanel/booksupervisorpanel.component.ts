import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

@Component({
  selector: 'app-booksupervisorpanel',
  templateUrl: './booksupervisorpanel.component.html',
  styleUrls: ['./booksupervisorpanel.component.styl']
})
export class BooksupervisorpanelComponent implements OnInit {
  form: FormGroup;
  books = [];
  term: string;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private location: Location,
  ) {
    this.form = this.formBuilder.group({
      bookRes: this.formBuilder.array([], [Validators.required])

    })
  }

  ngOnInit(): void {
    this.getAllBooks();
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
}
