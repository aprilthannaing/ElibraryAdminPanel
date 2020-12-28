import { Component, ViewChild, OnInit, Inject } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { IntercomService } from '../framework/intercom.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';

import {
  ApexChart,
  ApexAxisChartSeries,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexGrid,
  ApexNonAxisChartSeries,
  ApexResponsive,
} from "ng-apexcharts";
import { TestBed } from '@angular/core/testing';

type ApexXAxis = {
  type?: "category" | "datetime" | "numeric";
  categories?: any;
  labels?: {
    style?: {
      colors?: string | string[];
      fontSize?: string;
    };
  };
};

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
  series1: ApexNonAxisChartSeries;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.styl']
})
export class DashboardComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @ViewChild("chart2") chart2: ChartComponent;
  public chartOptions2: Partial<ChartOptions>;

  @ViewChild("chart3") 3: ChartComponent;
  public chartOptions3: Partial<ChartOptions>;

  bookCount = [];
  librarians = [];
  bookCount2 = [];
  bookBySub = [];
  loading = false;
  bookList = [];
  books = [];
  term = '';
  categories = [];
  status = "Hide Details";
  userId = "";
  currentPage = "";

  constructor(
    private dialog: MatDialog,
    private ics: IntercomService,
    private http: HttpClient,
  ) {
    this.chartOptions3 = {
      series1: [44, 55, 13, 43, 22, 45],
      chart: {
        width: 380,
        type: "pie"
      },
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E", "Team F"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };

    this.userId = this.ics.userId;
  }
  ngOnInit(): void {
    this.currentPage = "2";
    this.chartOptions2 = {};
    this.getEntries();
    this.getAllCategories();
  }


  getBarChart() {

    this.chartOptions = {
      series: [
        {
          name: "Book Count",
          data: this.bookCount,
        }
      ],
      chart: {
        height: 350,
        type: "bar",
        events: {

          dataPointSelection: function (event, chartContext, config) {
            document.getElementById("loading").style.display = "block";

            console.log("config.dataPointIndex : ", config.dataPointIndex)
            /* get book list from api by bar index*/
            var http = new XMLHttpRequest();
            var url = "http://localhost:8082/dashboard/librarian/booklist";
            var params = JSON.stringify({
              index: config.dataPointIndex,
              page: "1",
              user_id: "USR1"
            });
            http.open("POST", url, true);
            http.setRequestHeader("Content-type", "application/json; charset=utf-8");
            http.onreadystatechange = function () {
              if (http.status == 200) {
                document.getElementById("count").textContent = chartContext.opts.series[0].data[config.dataPointIndex];
                document.getElementById("mydiv").style.display = "block";
                document.getElementById("status").style.display = "block";


                /*create table*/
                var table = document.getElementById("myTable");
                var tblBody = document.getElementById("mytbody");
                tblBody.innerHTML = '';
                const json = JSON.parse(this.responseText);

                document.getElementById("firstPage").innerHTML = json.current_page;
                document.getElementById("lastPage").innerHTML = json.last_page;
                document.getElementById("next").setAttribute("value", config.dataPointIndex);


                json.bookList.forEach(element => {
                  var row = document.createElement("tr");
                  var title = document.createElement("td");
                  var cellTitle = document.createTextNode(element.title);
                  title.appendChild(cellTitle);
                  row.appendChild(title);

                  var accessionNo = document.createElement("td");
                  var cellAccessionNo = document.createTextNode(element.accessionNo);
                  accessionNo.appendChild(cellAccessionNo);
                  row.appendChild(accessionNo);

                  var state = document.createElement("td");
                  var cellState = document.createTextNode(element.state);
                  state.appendChild(cellState);
                  row.appendChild(state);

                  var createdDate = document.createElement("td");
                  var cell = document.createTextNode(element.createdDate);
                  createdDate.appendChild(cell);
                  row.appendChild(createdDate);

                  var size = document.createElement("td");
                  var cell = document.createTextNode(element.size);
                  size.appendChild(cell);
                  row.appendChild(size);

                  var downloadApproval = document.createElement("td");

                  var checkbox = document.createElement("INPUT");
                  checkbox.setAttribute("type", "checkbox");
                  if (element.downloadApproval != "") {
                    checkbox.setAttribute("checked", "true");
                  }
                  downloadApproval.appendChild(checkbox);
                  row.appendChild(downloadApproval);


                  tblBody.appendChild(row);
                  table.appendChild(tblBody);
                });

                document.getElementById("loading").style.display = "none";


              } else {
                document.getElementById("loading").style.display = "none";
                console.log("error !!!!!!!!!!!!!!")
              }
            }
            http.send(params);
          },
        }
      },
      colors: [
        "#008FFB",
        "#00E396",
        "#FEB019",
        "#FF4560",
        "#775DD0",
        "#546E7A",
        "#26a69a",
        "#D10CE8"
      ],
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: true
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      grid: {
        show: false
      },
      xaxis: {
        categories: this.librarians,
        labels: {
          style: {
            colors: [
              "#008FFB",
              "#00E396",
              "#FEB019",
              "#FF4560",
              "#775DD0",
              "#546E7A",
              "#26a69a",
              "#D10CE8"
            ],
            fontSize: "12px"
          }
        }
      },
    };
  }

  getBarChart2() {

    this.chartOptions2 = {
      series: [
        {
          name: "Book Count",
          data: this.bookCount2,
        }
      ],
      chart: {
        height: 550,
        type: "bar",
        events: {
        }
      },
      colors: [
        "#008FFB",
        "#00E396",
        "#FEB019",
        "#FF4560",
        "#775DD0",
        "#546E7A",
        "#26a69a",
        "#D10CE8"
      ],
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: true,
          horizontal: true,

        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      grid: {
        show: false,

      },
      xaxis: {
        categories: this.bookBySub,
        labels: {
          style: {
            colors: [
              "#008FFB",
              "#00E396",
              "#FEB019",
              "#FF4560",
              "#775DD0",
              "#546E7A",
              "#26a69a",
              "#D10CE8"
            ],
            fontSize: "12px"
          }
        }
      },
    };
  }

  myFunction() {
    var x = document.getElementById("mydiv");
    if (x.style.display === "none") {
      this.status = "Hide Details";
      x.style.display = "block";
    } else {
      this.status = "Show Details";
      x.style.display = "none";
    }
  }

  getEntries() {
    this.loading = true;
    const url: string = this.ics.apiRoute + "/dashboard/librarian/bookentry";
    this.http.request('post', url).subscribe(
      (data: any) => {
        data.bookCount.forEach(element => {
          this.bookCount.push(element);
        });

        data.nameList.forEach(element => {
          this.librarians.push(element);
        });

        this.getBarChart();
        this.loading = false;
      },
      error => {
        console.warn("error: ", error);
      });
  }

  search() {
    console.log("term:", this.term); 
    console.log("index !!!!!!!!!!!" , document.getElementById("next").getAttribute("value"));
  }

  getAllCategories() {
    const url: string = this.ics.apiRoute + "/category/all";
    const header: HttpHeaders = new HttpHeaders({
      token: this.ics.token
    });
    this.http.request('get', url, {
      headers: header
    }).subscribe(
      (data: any) => {
        console.warn("data: ", data);
        if (data.err_msg == "Unauthorized Request")
          this.loginDialog();
        this.categories = data.categories;
      },
      error => {
        console.warn("error: ", error);
      });
  }

  loginDialog() {
    const dialogRef = this.dialog.open(LoginDialog, {
      data: {
        "title": "Please login first!!",
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

  }


  selectChangeHandler(event: any) {
    console.log("category !!!!!!!!!!!!!", event.target.value)
    this.loading = true;
    const json = {
      "category_Id": event.target.value
    }
    const url: string = this.ics.apiRoute + "/dashboard/booksbysubcategory";
    const bookCount = [];
    const booksBySub = [];
    this.http.post(url, json).subscribe(
      (data: any) => {
        data.bookCount.forEach(element => {
          bookCount.push(element);
          this.bookCount2 = bookCount;
        });

        data.nameList.forEach(element => {
          booksBySub.push(element);
          this.bookBySub = booksBySub;
        });

        this.getBarChart2();
        this.loading = false;
      },
      error => {
        console.warn("error: ", error);

      });
  }

  getBooksByPaganation() {
    this.loading = true;
    const url: string = this.ics.apiRoute + "/dashboard/librarian/booklist";
    const index = document.getElementById("next").getAttribute("value");
    const json = {
      "user_id": this.userId,
      "page": this.currentPage,
      "index": index
    }

    this.http.post(url, json).subscribe(
      (data: any) => {
        console.log("data!!!!!!!!!!!!!!!!!!!!", data);
        var tblBody = document.getElementById("mytbody");
        tblBody.innerHTML = '';
        this.books = data.bookList;
        var currentPage = 1 + data.current_page;
        this.currentPage = currentPage + "";
        console.log("current page!!!!!", this.currentPage);
        this.loading = false;
      },
      error => {
        console.warn("error: ", error);
      });

  }

  first() {
    this.currentPage = "1";
    console.log("current page!!!!!", this.currentPage);
    this.getBooksByPaganation();
  }

  last() {
    this.currentPage = document.getElementById("lastPage").innerHTML;
    console.log("current page!!!!!", this.currentPage);
    this.getBooksByPaganation();
  }

  next() {    
    console.log("current page!!!!!", this.currentPage);
    this.getBooksByPaganation();
  }
}

export class LoginDialog {

  constructor(
    public dialogRef: MatDialogRef<LoginDialog>,
    public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { title: string }
  ) { }

  route(): void {
    this.dialogRef.close();
    this.router.navigate(['login']);
  }
}
