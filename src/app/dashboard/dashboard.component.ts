import { Component, ViewChild, OnInit } from "@angular/core";
import { IntercomService } from '../framework/intercom.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {
  ApexChart,
  ApexAxisChartSeries,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexGrid
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
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.styl']
})
export class DashboardComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  bookCount = [];
  librarians = [];
  loading = false;
  bookList = [];
  books = [];
  term = '';
  constructor(
    private ics: IntercomService,
    private http: HttpClient,
  ) {
  }
  ngOnInit(): void {
    this.getEntries();
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

          click: function (event, chartContext, config) {
            document.getElementById("loading").style.display = "block";

            /* get book list from api by bar index*/
            var http = new XMLHttpRequest();
            var url = "http://localhost:8082/dashboard/librarian/booklist";
            var params = JSON.stringify({ index: config.dataPointIndex });
            http.open("POST", url, true);
            http.setRequestHeader("Content-type", "application/json; charset=utf-8");
            http.onreadystatechange = function () {
              if (http.readyState == 4 && http.status == 200) {
                document.getElementById("loading").style.display = "none";
                document.getElementById("count").textContent = chartContext.opts.series[0].data[config.dataPointIndex];
                document.getElementById("mydiv").style.display = "block";

                /*create table*/
                var table = document.getElementById("myTable");
                var tblBody = document.getElementById("mytbody");
                tblBody.innerHTML = '';

                JSON.parse(this.responseText).bookList.forEach(element => {
                  console.log("element.downloadApproval: ", element.downloadApproval)

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

              } else {
                console.log("error !!!!!!!!!!!!!!")
               // alert("Error, Any book not found!");
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

  search(){
    console.log("term:", this.term);
  }
}
