import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { Chart } from "chart.js";
import { DatabaseProvider } from '../../providers/database/database';
import * as moment from "moment";

@IonicPage()
@Component({
  selector: 'page-data-details',
  templateUrl: 'data-details.html',
})
export class DataDetailsPage {
  @ViewChild('lineCanvasDay') lineCanvasDay;
  @ViewChild('lineCanvasWeek') lineCanvasWeek;
  @ViewChild('lineCanvasMonth') lineCanvasMonth;
  @ViewChild('lineCanvasYear') lineCanvasYear;
  //------------------------------
  @ViewChild('SwipedTabsSlider') SwipedTabsSlider: Slides;

  SwipedTabsIndicator: any = null;
  tabs: any = [];

  private dayData: any = [];
  private labelData: any = [];

  private day: string;
  private week: string;

  //------------------------------

  private item: any;
  lineChartDay: any;
  lineChartWeek: any;
  lineChartMonth: any;
  lineChartYear: any;



  constructor(public navCtrl: NavController, public navParams: NavParams, public database: DatabaseProvider) {
    this.day = moment().format("YYYY-MM-DD")
    this.week = "KW " + moment().week();
    this.loadData();
    this.tabs = ["Tag", "Woche", "Monat", "Jahr"];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DataDetailsPage');

    // this.lineChartDay = new Chart(this.lineCanvasDay.nativeElement, {
    //   type: 'line',
    //   data: {
    //     labels: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", 
    //             "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", 
    //             "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", 
    //             "19:00", "20:00", "21:00", "22:00", "23:00", "00:00"],
    //     datasets: [
    //       {
    //         label: "kW",
    //         fill: true,
    //         lineTension: 0.1,
    //         backgroundColor: "rgba(75,192,192,0.4)",
    //         borderColor: "rgba(75,192,192,1)",
    //         borderCapStyle: 'butt',
    //         borderDash: [],
    //         borderDashOffset: 0.0,
    //         borderJoinStyle: 'miter',
    //         pointBorderColor: "rgba(75,192,192,1)",
    //         pointBackgroundColor: "#fff",
    //         pointBorderWidth: 1,
    //         pointHoverRadius: 5,
    //         pointHoverBackgroundColor: "rgba(75,192,192,1)",
    //         pointHoverBorderColor: "rgba(220,220,220,1)",
    //         pointHoverBorderWidth: 2,
    //         pointRadius: 1,
    //         pointHitRadius: 10,
    //         // data: [0, 0, 0, 0, 0, 0, 0, 1.2, 1.8, 2.3, 3.5, 5.1, 6.7, 6.5, 5.3, 5, 4.8],
    //         data: this.dayData,
    //         spanGaps: false,
    //       }
    //     ]
    //   },
    //   options: {
    //     maintainAspectRatio: false,
    //     responsive: true,
    //     scales: {
    //       yAxes: [{
    //         ticks: {
    //           beginAtZero: true
    //         }
    //       }]
    //     }
    //   }
    // });

    this.lineChartDay = new Chart(this.lineCanvasDay.nativeElement, {
      type: 'line',
      data: {
        labels: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00",
          "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
          "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
          "19:00", "20:00", "21:00", "22:00", "23:00", "00:00"],
        datasets: [
          {
            label: "kW",
            fill: true,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            // data: [0, 0, 0, 0, 0, 0, 0, 1.2, 1.8, 2.3, 3.5, 5.1, 6.7, 6.5, 5.3, 5, 4.8],
            // data: this.dayData,
            spanGaps: false,
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });

    this.lineChartWeek = new Chart(this.lineCanvasWeek.nativeElement, {
      type: 'bar',
      data: {
        labels: ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"],
        datasets: [
          {
            label: "kWh",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            // data: [30, 27.1, 25.4, 33, 23.1],
            spanGaps: false,
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });


    this.lineChartMonth = new Chart(this.lineCanvasMonth.nativeElement, {
      type: 'bar',
      data: {
        labels: ["01.", "02.", "03.", "04.", "05.", "06.", "07.",
          "08.", "09.", "10.", "11.", "12.", "13.", "14.",
          "15.", "16.", "17.", "18.", "19.", "20.", "21.",
          "22.", "23.", "24.", "25.", "26.", "27.", "28.",
          "29.", "30.", "31."],
        datasets: [
          {
            label: "kWh",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            // data: [30, 27.1, 25.4, 33, 23.1, 25.6, 27.4, 13.4, 30, 27.7, 26, 31, 26.9],
            spanGaps: false,
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });

    this.lineChartYear = new Chart(this.lineCanvasYear.nativeElement, {
      type: 'bar',
      data: {
        labels: ["Januar", "Februar", "März", "April", "Mai", "Juni",
          "Juli", "August", "September", "Oktober", "November", "Dezember"],
        datasets: [
          {
            label: "kWh",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            // data: [463, 0],
            spanGaps: false,
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });


  }


  async loadData() {
    console.log("navParams: " + this.navParams.get("item"));
    this.item = JSON.parse(JSON.stringify(this.navParams.get("item")));
    //this.item = JSON.parse(temp);
    console.log("item: " + (JSON.stringify(this.item)));
    await this.database.getDataOfDay2(this.day, this.item.id).then(data => {
      // console.log("FUNK?: " + JSON.stringify(data))
      this.labelData = data[0];
      this.dayData = data[1];
      this.lineChartDay.data.labels = this.labelData;
      this.lineChartDay.data.datasets[0].data = this.dayData;
      this.lineChartDay.update();
    });
    await this.database.getDataOfWeek(this.day, this.item.id).then(data => {
      this.lineChartWeek.data.datasets[0].data = data;
      this.lineChartWeek.update();
    });
    await this.database.getDataOfMonth(this.day, this.item.id).then(data => {
      this.lineChartMonth.data.datasets[0].data = data;
      this.lineChartMonth.update();
    });
    await this.database.getDataOfYear(this.day, this.item.id).then(data => {
      this.lineChartYear.data.datasets[0].data = data;
      this.lineChartYear.update();
    });
  }

  getDataOfDay(day: string) {

  }

  setDayData(data: any) {
    // this.dayData = data;
  }


  //------------------------------

  ionViewDidEnter() {
    this.SwipedTabsIndicator = document.getElementById("indicator");
  }

  selectTab(index) {
    this.SwipedTabsIndicator.style.webkitTransform = 'translate3d(' + (100 * index) + '%,0,0)';
    this.SwipedTabsSlider.slideTo(index, 500);
  }

  updateIndicatorPosition() {
    // this condition is to avoid passing to incorrect index
    if (this.SwipedTabsSlider.length() > this.SwipedTabsSlider.getActiveIndex()) {
      this.SwipedTabsIndicator.style.webkitTransform = 'translate3d(' + (this.SwipedTabsSlider.getActiveIndex() * 100) + '%,0,0)';
    }
  }

  animateIndicator($event) {
    if (this.SwipedTabsIndicator)
      this.SwipedTabsIndicator.style.webkitTransform = 'translate3d(' + (($event.progress * (this.SwipedTabsSlider.length() - 1)) * 100) + '%,0,0)';
  }

  //------------------------------


}
