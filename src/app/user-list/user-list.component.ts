import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.styl']
})
export class UserListComponent implements OnInit {
  json = {"searchText":""}
  userObj:any = {};
  constructor( 
    private router: Router,
    private http: HttpClient,
    ) { }

  ngOnInit(): void {
    this.Searching();
  }
  goBack(){
    this.router.navigate(['user']);  
  }
  Searching(){
    const url = 'http://localhost:8080/user/selectUserInfo';
    const json = {"json":""}
    try {
        this.http.post(url,json).subscribe(
            (data:any) => {
                if (data != null && data != undefined) {
                  this.userObj = data;
                }
            },
            error => {
                if (error._body.type == 'error') {
                    alert("Connection Timed Out!");
                }
                else {
  
                }
            }, () => { });
    } catch (e) {
        alert(e);
    }
  }
  searchKeyup(e: any) {
    if (e.which == 13) {
      this.Searching();
    }
  }
  pageChanged(){

  }
  goto(key){
    this.router.navigate(['user', 'read', key]);
  }
}
