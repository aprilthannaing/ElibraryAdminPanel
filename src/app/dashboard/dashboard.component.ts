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
import { IfStmt } from "@angular/compiler";

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

declare var $: any;
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

  @ViewChild("chart3") chart3: ChartComponent;
  public chartOptions3: Partial<ChartOptions>;

  @ViewChild("chart4") chart4: ChartComponent;
  public chartOptions4: Partial<ChartOptions>;

  bookCount = [];
  librarians = [];
  bookCount2 = [];
  bookBySub = [];
  loading = false;
  bookList = [];
  books = [];
  books2 = [];
  books3 = [];
  books4 = [];

  popularBookCount = [];
  categoryNameList = [];
  popularTerm = '';
  categoryTerm = '';
  entryTerm = '';
  popularCategoryTerm = '';
  categories = [];
  status = "Hide Book Entries";
  status2 = "Hide Books By Category";
  status3 = "Hide Popular Books";
  status4 = "Hide Popular Books By Subcategory";

  userId = "";
  currentPage = "";
  currentPage2 = "";
  currentPage3 = "";
  currentPage4 = "";

  title = "";
  entryStartDate = "";
  entryEndDate = "";
  popularStartDate = "";
  popularEndDate = "";
  categoryStartDate = ""
  categoryEndDate = "";
  popularCategoryStartDate = "";
  popularCategoryEndDate = "";

  popularSubBookCount = [];

  constructor(
    private dialog: MatDialog,
    private ics: IntercomService,
    private http: HttpClient,
  ) {
    this.userId = this.ics.userId;
    this.check();

  }

  ngOnInit(): void {
    this.currentPage = "2";
    this.currentPage2 = "2";
    this.currentPage3 = "2";
    this.currentPage4 = "2";

    this.chartOptions2 = {};
    this.chartOptions3 = {};
    this.chartOptions4 = {};

    this.getEntries();
    this.getAllCategories();
    this.getPopularBooks();
  }

  check() {
    console.log("user!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" + this.ics.userId);
    if (this.ics.userId == "")
      this.loginDialog("");
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
        console.log("popualr books!!!!!!!!!!", data)
        this.categoryNameList = data.nameList;
        this.popularBookCount = data.bookCount;
        this.getPieChart(this.ics, this.http, this.userId);
      },
      error => {
        console.log("error!!!!!!!!!!", error)

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

                if (json.current_page >= json.last_page) {
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


  getBarChart(userId, apiRoute) {

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
            var url = apiRoute + "/dashboard/librarian/booklist";
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

                if (json.current_page >= json.last_page) {
                  document.getElementById("firstPage").style.display = "none";
                  document.getElementById("lastPage").style.display = "none";
                  document.getElementById("next").style.display = "none";
                  document.getElementById("icon3").style.display = "none";
                  document.getElementById("icon4").style.display = "none";
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


  getBarChart2(categoryId, userId, apiRoute) {

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
            var url = apiRoute + "/dashboard/booklistbysubcategory";
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
                if (json.current_page >= json.last_page) {
                  document.getElementById("firstPage2").style.display = "none";
                  document.getElementById("lastPage2").style.display = "none";
                  document.getElementById("next2").style.display = "none";
                  document.getElementById("icon3").style.display = "none";
                  document.getElementById("icon4").style.display = "none";
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



  getBarChart4(categoryId, userId, apiRoute) {

    this.chartOptions4 = {
      series: [
        {
          name: "Book Count",
          data: this.popularSubBookCount,
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
            var url = apiRoute + "/dashboard/popularBooklistbysubcategory";
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
                document.getElementById("count4").textContent = chartContext.opts.series[0].data[config.dataPointIndex];
                document.getElementById("mydiv4").style.display = "block";
                document.getElementById("status4").style.display = "block";


                /*create table*/
                var table = document.getElementById("myTable4");
                var tblBody = document.getElementById("mytbody4");
                tblBody.innerHTML = '';
                const json = JSON.parse(this.responseText);
                console.log("json !!!!!!!!", json)

                document.getElementById("firstPage4").innerHTML = json.current_page;
                document.getElementById("lastPage4").innerHTML = json.last_page;
                document.getElementById("next4").setAttribute("value", config.dataPointIndex + "," + json.sub_category);

                if (json.current_page >= json.last_page) {
                  document.getElementById("firstPage4").style.display = "none";
                  document.getElementById("lastPage4").style.display = "none";
                  document.getElementById("next4").style.display = "none";
                  document.getElementById("icon7").style.display = "none";
                  document.getElementById("icon8").style.display = "none";
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


  exportEntry() {  //1
    const index = document.getElementById("next").getAttribute("value");
    console.log("index !!!!!!!!!!" + index)

    var parameter = this.entryStartDate + "," + this.entryEndDate + "," + index;
    console.log("parameter !!!!!", parameter)
    window.open(this.ics.apiRoute + "/book/exportEntry" + ".xlsx?input=" + parameter, "_blank");
  }

  exportPopularBooks() { //3
    const index = document.getElementById("next3").getAttribute("value");
    console.log("index !!!!!!!!!!" + index)

    var parameter = this.popularStartDate + "," + this.popularEndDate + "," + index;
    console.log("parameter !!!!!", parameter)
    window.open(this.ics.apiRoute + "/book/exportPopularBooks" + ".xlsx?input=" + parameter, "_blank");
  }

  exportCategoryBooks() { //2
    const index = document.getElementById("next2").getAttribute("value");
    console.log("index !!!!!!!!!!" + index)

    var parameter = this.categoryStartDate + "," + this.categoryEndDate + "," + index;
    console.log("parameter !!!!!", parameter)
    window.open(this.ics.apiRoute + "/book/exportBooksByCategory" + ".xlsx?input=" + parameter, "_blank");


  }

  exportPopularBooksBySubCategory() {
    const index = document.getElementById("next4").getAttribute("value");
    console.log("index !!!!!!!!!!" + index)

    var parameter = this.popularCategoryStartDate + "," + this.popularCategoryEndDate + "," + index;
    console.log("parameter !!!!!", parameter)
    window.open(this.ics.apiRoute + "/book/exportPopularBooksBySubCategory" + ".xlsx?input=" + parameter, "_blank");

  }

  myFunction4() {
    var x = document.getElementById("mydiv4");
    if (x.style.display === "none") {
      this.status4 = "Hide Popular Books By Subcategory";
      x.style.display = "block";
    } else {
      this.status4 = "Show Popular Books By Subcategory";
      x.style.display = "none";
    }

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

        console.log("entries !!!!!!!!!!", data)
        data.bookCount.forEach(element => {
          this.bookCount.push(element);
        });

        data.nameList.forEach(element => {
          this.librarians.push(element);
        });

        this.getBarChart(this.userId, this.ics.apiRoute);
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
        console.log("selectChangeHandler data: ", data)
        // data.bookCount.forEach(element => {
        //   bookCount.push(element);
        //   this.bookCount2 = bookCount;
        // });

        // data.nameList.forEach(element => {
        //   booksBySub.push(element);
        //   this.bookBySub = booksBySub;
        // });

        this.bookCount2 = data.bookCount;
        this.bookBySub = data.nameList;
        this.popularSubBookCount = data.popualrBookCount;
        this.getBarChart4(event.target.value, this.userId, this.ics.apiRoute);
        this.getBarChart2(event.target.value, this.userId, this.ics.apiRoute);
        this.loading = false;
      },
      error => {
        console.warn("error: ", error);

      });
  }

  getBooksByPaganation() {
    this.loading = true;
    this.entryTerm = "";
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
    this.categoryTerm = "";
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
    this.popularTerm = "";
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

  getBooksByPaganation4() {
    this.loading = true;
    const url: string = this.ics.apiRoute + "/dashboard/popularBooklistbysubcategory";
    const index = document.getElementById("next4").getAttribute("value");
    var splitted = index.split(",");
    const json = {
      "user_id": this.userId,
      "page": this.currentPage4,
      "index": splitted[0],
      "sub_category_id": splitted[1]
    }

    this.http.post(url, json).subscribe(
      (data: any) => {
        console.log("data!!!!!!!!!!!!!!!!!!!!", data);
        var tblBody = document.getElementById("mytbody4");
        tblBody.innerHTML = '';
        this.books4 = data.bookList;
        var currentPage = 1 + data.current_page;
        this.currentPage4 = currentPage + "";
        console.log("current page!!!!!", this.currentPage4);
        console.log("last page3!!!!!", document.getElementById("lastPage4").innerHTML);
        this.loading = false;
      },
      error => {
        console.warn("error: ", error);
      });

  }

  failDialog(message) {
    const dialogRef = this.dialog.open(FailDialog, {
      data: {
        "title": "Unable to search!",
        "message": message
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

  }

  search() {
    this.loading = true;
    console.log("entryTerm:", this.entryTerm);
    if (!this.entryTerm) {
      this.failDialog("Please enter you want to search!");
    }
    console.log("index !!!!!!!!!!!", document.getElementById("next").getAttribute("value"));

    const url: string = this.ics.apiRoute + "/dashboard/librarian/booksearch";
    const index = document.getElementById("next").getAttribute("value");
    const json = {
      user_id: this.userId,
      page: "1",
      index: index,
      searchTerms: this.entryTerm,
    }

    this.http.post(url, json).subscribe(
      (data: any) => {
        console.log("data!!!!!!!!!!!!!!!!!!!!", data);
        var tblBody = document.getElementById("mytbody");
        tblBody.innerHTML = '';
        document.getElementById("count").textContent = data.total_count;

        this.books = data.books;
        if (data.total_count == '0') {
          document.getElementById("mytitle1").style.display = "none";
          this.failDialog("This book is not found!");
        }
        var currentPage = 1 + data.current_page;
        this.currentPage = currentPage + "";

        document.getElementById("firstPage").innerHTML = data.current_page;
        document.getElementById("lastPage").innerHTML = data.last_page;

        if (this.currentPage >= data.last_page) {
          document.getElementById("firstPage").style.display = "none";
          document.getElementById("lastPage").style.display = "none";
          document.getElementById("next").style.display = "none";
          document.getElementById("icon5").style.display = "none";
          document.getElementById("icon6").style.display = "none";
        }
        this.loading = false;
      },
      error => {
        console.warn("error: ", error);
      });
    this.entryTerm = "";
  }

  search2() {
    this.loading = true;
    if (!this.categoryTerm) {
      this.failDialog("Please enter you want to search!");
    }
    console.log("term:", this.categoryTerm);
    console.log("index !!!!!!!!!!!", document.getElementById("next2").getAttribute("value"));
    var splitted = document.getElementById("next2").getAttribute("value").split(",");
    const url: string = this.ics.apiRoute + "/search/book";
    const index = document.getElementById("next2").getAttribute("value");
    const json =
    {
      author_id: "",
      category_id: "",
      end_date: "",
      page: "1",
      searchTerms: this.categoryTerm,
      start_date: "",
      sub_category_id: splitted[1],
      title: "",
      user_id: this.userId
    }

    this.http.post(url, json).subscribe(
      (data: any) => {
        console.log("data!!!!!!!!!!!!!!!!!!!!", data);
        var tblBody = document.getElementById("mytbody2");
        tblBody.innerHTML = '';
        document.getElementById("count2").textContent = data.total_count;
        if (data.total_count == '0') {
          document.getElementById("mytitle2").style.display = "none";
          this.failDialog("This book is not found!");
        }
        this.books2 = data.books;

        var currentPage = 1 + data.current_page;
        this.currentPage2 = currentPage + "";
        document.getElementById("firstPage2").innerHTML = data.current_page;
        document.getElementById("lastPage2").innerHTML = data.last_page;

        if (this.currentPage2 >= data.last_page) {
          document.getElementById("firstPage2").style.display = "none";
          document.getElementById("lastPage2").style.display = "none";
          document.getElementById("next2").style.display = "none";
          document.getElementById("icon3").style.display = "none";
          document.getElementById("icon4").style.display = "none";
        }
        this.loading = false;
      },
      error => {
        console.warn("error: ", error);
      });
    this.categoryTerm = "";
  }

  search3() {
    this.loading = true;
    if (!this.popularTerm) {
      this.failDialog("Please enter you want to search!");
    }
    console.log("term:", this.popularTerm);
    console.log("index !!!!!!!!!!!", document.getElementById("next3").getAttribute("value"));
    const url: string = this.ics.apiRoute + "/dashboard/popualrbooksearch";
    const index = document.getElementById("next3").getAttribute("value");
    const json = {
      user_id: this.userId,
      page: "1",
      index: index,
      searchTerms: this.popularTerm,
    }

    this.http.post(url, json).subscribe(
      (data: any) => {
        console.log("data!!!!!!!!!!!!!!!!!!!!", data);
        var tblBody = document.getElementById("mytbody3");
        tblBody.innerHTML = '';
        document.getElementById("count3").textContent = data.total_count;
        if (data.total_count == '0') {
          document.getElementById("mytitle3").style.display = "none";
          this.failDialog("This book is not found!");
        }
        this.books3 = data.books;
        var currentPage = 1 + data.current_page;
        this.currentPage3 = currentPage + "";
        if (this.currentPage3 >= data.last_page) {
          document.getElementById("firstPage3").style.display = "none";
          document.getElementById("lastPage3").style.display = "none";
          document.getElementById("next3").style.display = "none";
          document.getElementById("icon1").style.display = "none";
          document.getElementById("icon2").style.display = "none";
        } else {
          document.getElementById("firstPage3").innerHTML = data.current_page;
          document.getElementById("lastPage3").innerHTML = data.last_page;

        }
        this.loading = false;
      },
      error => {
        console.warn("error: ", error);
      });
    this.popularTerm = "";
  }

  search4() {

    console.log("search 44444444444 !!!!!!!!!")
    if (!this.popularCategoryTerm) {
      this.failDialog("Please enter you want to search!");
    }
    this.loading = true;
    console.log("term:", this.popularCategoryTerm);
    console.log("index !!!!!!!!!!!", document.getElementById("next4").getAttribute("value"));
    const url: string = this.ics.apiRoute + "/dashboard/popualrbooksearch";
    const index = document.getElementById("next4").getAttribute("value");
    var splitted = index.split(",");

    const json = {
      user_id: this.userId,
      page: "1",
      index: splitted[0],
      searchTerms: this.popularCategoryTerm,
      sub_category_id: splitted[1]

    }

    this.http.post(url, json).subscribe(
      (data: any) => {
        console.log("data!!!!!!!!!!!!!!!!!!!!", data);
        var tblBody = document.getElementById("mytbody4");
        tblBody.innerHTML = '';
        document.getElementById("count4").textContent = data.total_count;
        if (data.total_count == '0') {
          document.getElementById("mytitle4").style.display = "none";
          this.failDialog("This book is not found!");
        }
        this.books4 = data.books;
        var currentPage = 1 + data.current_page;
        this.currentPage4 = currentPage + "";


        console.log("data.current_page4 !!!!!!!!!" + data.current_page4)
        console.log("data.last_page!!!!!!!!!" + data.last_page)

        if (this.currentPage4 >= data.last_page) {
          document.getElementById("firstPage4").style.display = "none";
          document.getElementById("lastPage4").style.display = "none";
          document.getElementById("next4").style.display = "none";
          document.getElementById("icon7").style.display = "none";
          document.getElementById("icon8").style.display = "none";
        } else {
          document.getElementById("firstPage4").innerHTML = data.current_page;
          document.getElementById("lastPage4").innerHTML = data.last_page;

        }
        this.loading = false;
      },
      error => {
        console.warn("error: ", error);
      });
    this.popularCategoryTerm = "";
  }

  first() {
    if (this.entryTerm) {
      this.search();
    } else {
      this.currentPage = "1";
      console.log("current page!!!!!", this.currentPage);
      this.getBooksByPaganation();
    }

  }

  last() {
    if (this.entryTerm) {
      this.search();
    }
    else {
      this.currentPage = document.getElementById("lastPage").innerHTML;
      console.log("current page!!!!!", this.currentPage);
      this.getBooksByPaganation();
    }
  }

  next() {
    if (this.entryTerm) {
      this.search();
    }
    else {
      console.log("next !!!!!!!!!!!!");
      console.log("current page!!!!!", this.currentPage);
      console.log("searchterm:", this.entryTerm);
      this.getBooksByPaganation();
    }
    // if (this.entryTerm == "")
    //   this.getBooksByPaganation();
    // else this.search();
  }

  first2() {
    if (this.categoryTerm) {
      console.log("searched!!!");
      this.search2();
    } else {
      this.currentPage2 = "1";
      console.log("current page!!!!!", this.currentPage2);
      this.getBooksByPaganation2();
    }

  }

  last2() {
    if (this.categoryTerm) {
      this.search2();
    } else {
      this.currentPage2 = document.getElementById("lastPage2").innerHTML;
      console.log("current page!!!!!", this.currentPage2);
      this.getBooksByPaganation2();
    }
  }

  next2() {
    if (this.categoryTerm) {
      this.search2();
    } else {
      console.log("current page 2!!!!!", this.currentPage2);
      console.log("searchterm:", this.categoryTerm);
      this.getBooksByPaganation2();
    }
  }

  first3() {
    if (this.popularTerm) {
      this.search3();
    } else {
      this.currentPage3 = "1";
      console.log("current page3!!!!!", this.currentPage3);
      this.getBooksByPaganation3();
    }
  }

  last3() {
    if (this.popularTerm) {
      this.search3();
    } else {
      this.currentPage3 = document.getElementById("lastPage3").innerHTML;
      console.log("current page3!!!!!", this.currentPage3);
      this.getBooksByPaganation3();
    }
  }



  next3() {
    if (this.popularTerm) {
      this.search3();
    } else {
      console.log("current page3!!!!!", this.currentPage3);
      console.log("current page3!!!!!", document.getElementById("lastPage3").innerHTML);
      this.getBooksByPaganation3();
    }
  }



  first4() {
    if (this.popularCategoryTerm) {
      this.search4();
    } else {
      this.currentPage4 = "1";
      this.getBooksByPaganation4();
    }

  }

  last4() {
    if (this.popularCategoryTerm) {
      this.search4();
    } else {
      this.currentPage4 = document.getElementById("lastPage4").innerHTML;
      this.getBooksByPaganation4();
    }

  }



  next4() {
    if (this.popularCategoryTerm) {
      this.search4();
    } else {
      this.getBooksByPaganation4();
    }
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

@Component({
  selector: 'fail-dialog',
  templateUrl: './fail-dialog.html',
})
export class FailDialog {

  constructor(
    public dialogRef: MatDialogRef<FailDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

