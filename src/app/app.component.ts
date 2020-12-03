import { Component } from '@angular/core';
import { IntercomService } from './framework/intercom.service';
import { bean } from './framework/bean';
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
    private ics: IntercomService
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
        setTimeout(function () { snackbar.className = snackbar.className.replace("show", ""); }, 3000);
      }
    });
   }
}