import { Component, HostListener } from '@angular/core';
import { IntercomService } from './framework/intercom.service';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
declare var jQuery: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent {
  title = "Admin Panel";
  _alertflag = true;
  _alertmsg = "";
  constructor(
    private ics: IntercomService,
    private router: Router,
    private http: HttpClient,
  ) {
    ics.rpbean$.subscribe(x => {
      if (x.t1 !== null && x.t1 == "rp-popup") {
        jQuery("#rootpopupsize").attr('class', 'modal-dialog modal-lg');
        jQuery("#rootpopuptitle").text(x.t2);
        jQuery("#rootpopupbody").load(x.t3);
        jQuery("#rootpopup").modal();
      } else if (x.t1 !== null && x.t1 == "rp-wait") {
        jQuery("#rootpopupsize").attr('class', 'modal-dialog modal-sm');
        jQuery("#rootpopuptitle").text("Please Wait");
        jQuery("#rootpopupbody").text(x.t2);
        jQuery("#rootpopup").modal();
      } else if (x.t1 !== null && x.t1 == "rp-error") {
        jQuery("#rootpopupsize").attr('class', 'modal-dialog modal-sm');
        jQuery("#rootpopuptitle").text("System Exception");
        jQuery("#rootpopupbody").text(x.t2);
        jQuery("#rootpopup").modal();
      } else if (x.t1 !== null && x.t1 == "rp-msg") {
        jQuery("#rootpopupsize").attr('class', 'modal-dialog modal-sm');
        jQuery("#rootpopuptitle").text(x.t2);
        jQuery("#rootpopupbody").text(x.t3);
        jQuery("#rootpopup").modal();
      } else if (x.t1 !== null && x.t1 == "rp-msg-off") {
        jQuery("#rootpopuptitle").text("");
        jQuery("#rootpopupbody").text("");
        jQuery("#rootpopup").modal('hide');
      }
      else if (x.t1 !== null && x.t1 == "rp-alert") {
        this._alertmsg = x.t3;
        this._alertflag = false;
        let _snack_style = 'msg-info';
        if (x.t2 == "success") _snack_style = 'msg-success';
        else if (x.t2 == "warning") _snack_style = 'msg-warning';
        else if (x.t2 == "danger") _snack_style = 'msg-danger';
        else if (x.t2 == "information") _snack_style = 'msg-info';
        document.getElementById("snackbar").innerHTML = this._alertmsg;
        let snackbar = document.getElementById("snackbar");
        snackbar.className = "show " + _snack_style;
        setTimeout(function () { snackbar.className = snackbar.className.replace("show", ""); }, 6000);
      }
    });
   }
  ngOnInit() {
    setInterval(() => this.chkActive(), 10000);
  }
  docChanges(_doc) {
    if (this.ics.userRole != "") {
      let dt = new Date();
      let _time: number = (dt.getHours() * 3600) + (dt.getMinutes() * 60) + dt.getSeconds();
      this.ics._activeTimeout = _time;
    }
  }
  chkActive() {
    if (this.ics.userRole != "" &&  this.ics._activeTimeout != 0) {
      let dt = new Date();
      let _time: number = (dt.getHours() * 3600) + (dt.getMinutes() * 60) + dt.getSeconds();
      if ((_time - this.ics._activeTimeout) > (parseInt(this.ics._sessiontime) * 60)) {
        jQuery("#timeoutalert").modal();
        timer(3000).subscribe(() => {
          this.ics.userRole = "";
          this.ics._activeTimeout = 0;
          this.router.navigate(['login']);
        });

      }
    }
  }
  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    let url = this.ics.apiRoute + 'user/signout'
    let json = {"userid": this.ics.userId}
      this.http.post(url,json,{headers: new HttpHeaders().set('token', this.ics.token)}).subscribe(
        data  => {
          this.clearICS();
          this.router.navigate(['login']);
          jQuery("#timeoutalert").modal();
        },
        error => {}, () => { });
  }
  // @HostListener('window:popstate', ['$event'])
  // onPopState(event) {
  //   let url = this.ics.apiRoute + '/user/signout'
  //   let json = {"userid": this.ics.userId}
  //     this.http.post(url,json,{headers: new HttpHeaders().set('token', this.ics.token)}).subscribe(
  //       data  => {
  //         this.clearICS();
  //         this.router.navigate(['login']);
  //         jQuery("#timeoutalert").modal();
  //       },
  //       error => {}, () => { });
  // }
  clearICS(){
  this.ics.userId = "";
  this.ics.email = "";
  this.ics.userRole = "";
  this.ics.uesrName = "";
  this.ics.token = "";
  this.ics.userId = "";
  }

}