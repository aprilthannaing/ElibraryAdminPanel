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
  books2 = [];
  books3 = [];
  popularBookCount = [];
  categoryNameList = [];
  term = '';
  categories = [];
  status = "Hide Book Entries";
  status2 = "Hide Books By Category";
  status3 = "Hide Popular Books";
  userId = "";
  currentPage = "";
  currentPage2 = "";
  currentPage3 = "";
  title = "";

  constructor(
    private dialog: MatDialog,
    private ics: IntercomService,
    private http: HttpClient,
  ) {


    this.userId = this.ics.userId;
    console.log("userId !!!!!!!!!!!!", this.userId)
    if (this.userId == "")
      this.loginDialog(this.title);

  }

  ngOnInit(): void {
    this.currentPage = "2";
    this.currentPage2 = "2";
    this.currentPage3 = "2";
    this.chartOptions2 = {};
    this.getEntries();
    this.getAllCategories();
    this.getPopularBooks();
  }

  getPopularBooks() {

    const url: string = this.ics.apiRoute + "/dashboard/popularbookcount";
    const header: HttpHeaders = new HttpHeaders({
      token: this.ics.token
    });
    this.http.request('post', url, {
      headers: header
    }).subscribe(
      (data: any) => {
        this.categoryNameList = data.nameList;
        this.popularBookCount = data.bookCount;
        this.getPieChart(this.ics, this.http, this.userId);
      },
      error => {
        console.warn("error: ", error);
      });

  }

  getPieChart(ics, http, userId) {
    this.chartOptions3 = {
      series1: this.popularBookCount,
      chart: {
        width: 550,
        type: "pie",
        events: {
          dataPointSelection: function (event, chartContext, config) {
            document.getElementById("loading").style.display = "block";
            console.log("config.dataPointIndex : ", config.dataPointIndex)
            const url: string = ics.apiRoute + "/dashboard/popularbooks";
            const json = {
              "index": config.dataPointIndex,
              page: "1",
              user_id: userId
            }

            http.post(url, json).subscribe(
              (data: any) => {
                console.log("data!!!!!!!!!!!!!!!!!!!!", data);
                const json = data;

                document.getElementById("count3").textContent = data.total_count;
                document.getElementById("mydiv3").style.display = "block";
                document.getElementById("status3").style.display = "block";


                /*create table*/
                var table = document.getElementById("myTable3");
                var tblBody = document.getElementById("mytbody3");
                tblBody.innerHTML = '';


                document.getElementById("firstPage3").innerHTML = json.current_page;
                document.getElementById("lastPage3").innerHTML = json.last_page;
                document.getElementById("next3").setAttribute("value", config.dataPointIndex);

                if (json.current_page == json.last_page) {
                  document.getElementById("firstPage3").style.display = "none";
                  document.getElementById("lastPage3").style.display = "none";
                  document.getElementById("next3").style.display = "none";
                  document.getElementById("icon1").style.display = "none";
                  document.getElementById("icon2").style.display = "none";
                }

                json.bookList.forEach(element => {
                  var row = document.createElement("tr");
                  var title = document.createElement("td");
                  var cellTitle = document.createTextNode(element.title);
                  title.appendChild(cellTitle);
                  row.appendChild(title);

                  var callNo = document.createElement("td");
                  var cellcallNo = document.createTextNode(element.callNo);
                  callNo.appendChild(cellcallNo);
                  row.appendChild(callNo);


                  var accessionNo = document.createElement("td");
                  var cellAccessionNo = document.createTextNode(element.accessionNo);
                  accessionNo.appendChild(cellAccessionNo);
                  row.appendChild(accessionNo);

                  var subCategory = document.createElement("td");
                  var cellsubCategory = document.createTextNode(element.subCategory.myanmarName);
                  subCategory.appendChild(cellsubCategory);
                  row.appendChild(subCategory);

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

              },
              error => {
                document.getElementById("loading").style.display = "none";

                console.warn("error: ", error);
              });

          }
        }
      },
      labels: this.categoryNameList,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 400
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }


  getBarChart(userId) {

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
              user_id: userId
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
                  var callNo = document.createElement("td");
                  var cellcallNo = document.createTextNode(element.callNo);
                  callNo.appendChild(cellcallNo);
                  row.appendChild(callNo);


                  var accessionNo = document.createElement("td");
                  var cellAccessionNo = document.createTextNode(element.accessionNo);
                  accessionNo.appendChild(cellAccessionNo);
                  row.appendChild(accessionNo);

                  var subCategory = document.createElement("td");
                  var cellsubCategory = document.createTextNode(element.subCategory.myanmarName);
                  subCategory.appendChild(cellsubCategory);
                  row.appendChild(subCategory);

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



  getBarChart2(categoryId, userId) {

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

          dataPointSelection: function (event, chartContext, config) {
            document.getElementById("loading").style.display = "block";
            console.log("config.dataPointIndex : ", config.dataPointIndex)

            var http = new XMLHttpRequest();
            var url = "http://localhost:8082/dashboard/booklistbysubcategory";
            var params = JSON.stringify({
              index: config.dataPointIndex,
              page: "1",
              category_Id: categoryId,
              user_id: userId
            });
            http.open("POST", url, true);
            http.setRequestHeader("Content-type", "application/json; charset=utf-8");
            http.onreadystatechange = function () {
              if (http.status == 200) {
                document.getElementById("count2").textContent = chartContext.opts.series[0].data[config.dataPointIndex];
                document.getElementById("mydiv2").style.display = "block";
                document.getElementById("status2").style.display = "block";


                /*create table*/
                var table = document.getElementById("myTable2");
                var tblBody = document.getElementById("mytbody2");
                tblBody.innerHTML = '';
                const json = JSON.parse(this.responseText);

                document.getElementById("firstPage2").innerHTML = json.current_page;
                document.getElementById("lastPage2").innerHTML = json.last_page;
                document.getElementById("next2").setAttribute("value", config.dataPointIndex + "," + json.sub_category);


                json.bookList.forEach(element => {
                  var row = document.createElement("tr");
                  var title = document.createElement("td");
                  var cellTitle = document.createTextNode(element.title);
                  title.appendChild(cellTitle);
                  row.appendChild(title);

                  var callNo = document.createElement("td");
                  var cellcallNo = document.createTextNode(element.callNo);
                  callNo.appendChild(cellcallNo);
                  row.appendChild(callNo);


                  var accessionNo = document.createElement("td");
                  var cellAccessionNo = document.createTextNode(element.accessionNo);
                  accessionNo.appendChild(cellAccessionNo);
                  row.appendChild(accessionNo);

                  var subCategory = document.createElement("td");
                  var cellsubCategory = document.createTextNode(element.subCategory.myanmarName);
                  subCategory.appendChild(cellsubCategory);
                  row.appendChild(subCategory);

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

          }
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

  myFunction3() {
    var x = document.getElementById("mydiv3");
    if (x.style.display === "none") {
      this.status3 = "Hide Popular Books";
      x.style.display = "block";
    } else {
      this.status3 = "Show Popular Books";
      x.style.display = "none";
    }
  }

  myFunction2() {
    var x = document.getElementById("mydiv2");
    if (x.style.display === "none") {
      this.status2 = "Hide Books By Category";
      x.style.display = "block";
    } else {
      this.status2 = "Show Books By Category";
      x.style.display = "none";
    }
  }

  myFunction() {
    var x = document.getElementById("mydiv");
    if (x.style.display === "none") {
      this.status = "Hide Book Entries";
      x.style.display = "block";
    } else {
      this.status = "Show Book Entries";
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

        this.getBarChart(this.userId);
        this.loading = false;
      },
      error => {
        console.warn("error: ", error);
      });
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
        this.categories = data.categories;
      },
      error => {
        console.warn("error: ", error);
      });
  }

  loginDialog(title) {
    const dialogRef = this.dialog.open(LoginDialog, {
      data: {
        "title": title,
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

        this.getBarChart2(event.target.value, this.userId);
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

  getBooksByPaganation2() {
    this.loading = true;
    const url: string = this.ics.apiRoute + "/dashboard/booklistbysubcategory";
    const index = document.getElementById("next2").getAttribute("value");
    var splitted = index.split(",");


    const json = {
      "user_id": this.userId,
      "page": this.currentPage2,
      "index": splitted[0],
      "sub_category_id": splitted[1]
    }

    this.http.post(url, json).subscribe(
      (data: any) => {
        var tblBody = document.getElementById("mytbody2");
        tblBody.innerHTML = '';
        this.books2 = data.bookList;
        var currentPage = 1 + data.current_page;
        this.currentPage2 = currentPage + "";
        console.log("current page!!!!!", this.currentPage2);
        this.loading = false;
      },
      error => {
        console.warn("error: ", error);
      });

  }

  getBooksByPaganation3() {
    this.loading = true;
    const url: string = this.ics.apiRoute + "/dashboard/popularbooks";
    const index = document.getElementById("next3").getAttribute("value");
    const json = {
      "user_id": this.userId,
      "page": this.currentPage3,
      "index": index
    }

    this.http.post(url, json).subscribe(
      (data: any) => {
        console.log("data!!!!!!!!!!!!!!!!!!!!", data);
        var tblBody = document.getElementById("mytbody3");
        tblBody.innerHTML = '';
        this.books3 = data.bookList;
        var currentPage = 1 + data.current_page;
        this.currentPage3 = currentPage + "";
        console.log("current page!!!!!", this.currentPage3);
        console.log("last page3!!!!!", document.getElementById("lastPage3").innerHTML);


        this.loading = false;
      },
      error => {
        console.warn("error: ", error);
      });

  }

  search() {
    console.log("term:", this.term);
    console.log("index !!!!!!!!!!!", document.getElementById("next").getAttribute("value"));

    const url: string = this.ics.apiRoute + "/dashboard/librarian/booksearch";
    const index = document.getElementById("next").getAttribute("value");
    const json = {
      "user_id": this.userId,
      "page": this.currentPage,
      "index": index
    }

    this.http.post(url, json).subscribe(
      (data: any) => {
        console.log("data!!!!!!!!!!!!!!!!!!!!", data);
        this.loading = false;
      },
      error => {
        console.warn("error: ", error);
      });
  }

  search3() {

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


  first2() {
    this.currentPage2 = "1";
    console.log("current page!!!!!", this.currentPage2);
    this.getBooksByPaganation2();
  }

  last2() {
    this.currentPage2 = document.getElementById("lastPage2").innerHTML;
    console.log("current page!!!!!", this.currentPage2);
    this.getBooksByPaganation2();
  }

  next2() {
    console.log("current page!!!!!", this.currentPage2);
    this.getBooksByPaganation2();
  }

  first3() {
    this.currentPage3 = "1";
    console.log("current page3!!!!!", this.currentPage3);
    this.getBooksByPaganation3();
  }

  last3() {
    this.currentPage3 = document.getElementById("lastPage3").innerHTML;
    console.log("current page3!!!!!", this.currentPage3);
    this.getBooksByPaganation3();
  }

  next3() {
    console.log("current page3!!!!!", this.currentPage3);
    console.log("current page3!!!!!", document.getElementById("lastPage3").innerHTML);

    this.getBooksByPaganation3();
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
    @Inject(MAT_DIALOG_DATA) public data: { title: string }
  ) { }

  route(): void {
    this.dialogRef.close();
    this.router.navigate(['login']);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

