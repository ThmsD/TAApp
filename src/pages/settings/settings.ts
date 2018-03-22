import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { Http, Headers, RequestOptions } from "@angular/http";
import { ApiHandlerProvider } from '../../providers/api-handler/api-handler';
import { DateTime } from 'ionic-angular/components/datetime/datetime';

import * as moment from "moment";


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  private TAG: string = "Settings - ";

  nm: string;
  pwd: string;
  cmiid: string;
  profile: string;
  // user = [];
  userMod = {};

  // @ViewChild('username') username;
  // @ViewChild('password') password;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private apiHandler: ApiHandlerProvider, private database: DatabaseProvider) {
    this.database.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        console.log(this.TAG + "Database seems to be ready");
        this.loadUserData();
      }
    })
    console.log(this.TAG + "constructor");
  }

  loadUserData() {
    this.database.getCredentials().then(data => {
      // this.user = data;

      this.nm = data.name;
      this.pwd = "password";
      this.cmiid = data.cmiid;
      this.profile = data.profile;

      // this.nm = data[0].name;
      // this.pwd = "password";
      // this.cmiid = data[0].cmiid;
      // this.profile = data[0].profile;

      // console.log(this.TAG + "loadUserData: " + this.user[0].name + " * " + this.user.toString() + " + " + this.user["name"] + " - " + JSON.stringify(this.user));
    });
  }

  dropTable() {
    this.database.dropTable();
  }

  ionViewDidLoad() {
    //  console.log('ionViewDidLoad SettingsPage');
  }

  saveCredentials() {
    console.log(this.TAG + "saveCredentials() called");
    console.log(this.TAG + "saveCred: " + this.userMod['name'] + " " + this.userMod['password']);
    this.database.addCredentials(this.userMod['name'], this.userMod['password'], this.userMod['cmiid'], this.userMod['profile'])
      .then(() => {
        this.loadUserData();
      }).then(() => {
        this.apiHandler.getAccessToken().then(() => {
          this.apiHandler.loadData();
        });
      });
    // this.usr = {};
    // this.navCtrl.pop();


    // this.database.addCredentials(this.username.value, this.password.value).then(result => console.log("Ergebnis: " + result));
    // this.database.createDatabase();


    // headers.append('Access-Control-Allow-Origin' , '*');
    // headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    // headers.append('Accept','application/json');
    // headers.append('content-type','application/json');

    // Folgender Code FUNKTIONIERT!
    // start chrome with --disable-web-security to test it in chrome
    // let headers = new Headers();
    // let base64String = btoa(this.username.value + ":" + this.password.value);
    // console.log(base64String + " = " + atob(base64String));
    // headers.append('Authorization', 'Basic ' + base64String);
    // let options = new RequestOptions({headers:headers});
    // this.http.post("https://api.ta.co.at/v1/access_token", {}, options) 
    //   .subscribe(res => {
    //     console.log("Post: " + res);
    //     console.log("1: " + JSON.stringify(res));
    //     console.log("2: " + JSON.stringify(res.json()));
    //     console.log("3: " + res.text());
    //     let js = JSON.parse(res.text()).data.access_token;
    //     let cookid = js.cookid;
    //     let username = js.username;
    //     console.log("js: " + cookid + ":" + username);
    //   },
    //   err => { console.log("POST-Error: " + err) });
  }

  accessToken() {
    this.apiHandler.getAccessToken();
  }
  //   let headers = new Headers();
  //   let username: string;
  //   let pwd: string;
  //   this.database.getCredentials().then(data => {
  //     username = data[0].name;
  //     pwd = data[0].password;
  //     console.log(this.TAG + "Name+Pwd: " + username + " " + pwd);

  //     let base64String = btoa(username + ":" + pwd); //btoa("rene_peinl" + ":" + "HShofRPE2017"); 
  //     console.log(base64String + " = " + atob(base64String));
  //     headers.append('Authorization', 'Basic ' + base64String);
  //     let options = new RequestOptions({headers:headers});
  //     this.http.post("https://api.ta.co.at/v1/access_token", {}, options) 
  //       .subscribe(res => {
  //         // console.log("Post: " + res);
  //         // console.log("1: " + JSON.stringify(res));
  //         // console.log("2: " + JSON.stringify(res.json()));
  //         console.log("3: " + res.text());
  //         let js = JSON.parse(res.text()).data.access_token;
  //         let cookid = js.cookid;
  //         let username = js.username;
  //         console.log("js: " + cookid + ":" + username);
  //         this.database.addAccessToken(cookid);
  //       },
  //       err => { console.log("POST-Error: " + err) });
  //   });
  // }

  getLatestLog() {
    this.database.getLatestLoggedData().then(data => {
      console.log("setting-LATESTLOG: " + JSON.stringify(data));
      
    });
  }

  addToken() {
    this.database.addAccessToken("abcdefgh");
  }

  getToken() {
    this.database.getAccessToken();
  }

  test() {
    // this.apiHandler.getLogging("2018-01-01 00:00:00", "2018-01-31 23:59:59");
    // this.apiHandler.test();
    // this.database.credentialsAvailable();
    // this.database.getLatestData().then(data => {
    //   console.log("LOG: " + JSON.stringify(data));
    // })

    // console.log("TEST: " + Date.parse("2018-03-06 17:03:55"));
    // console.log("TEST2: " + new Date(1520418564*1000));
    // console.log("TEST3: " + Date.now()); // in ms -> /1000 = unixtime
    // var date3 = new Date(Date.now());
    // console.log("Date3: " + date3.getFullYear() + "-" + date3.getMonth()+1 + "-" + date3.getDate() + " " + date3.getHours() + ":" + date3.getMinutes() + ":" + date3.getSeconds());

    // this.apiHandler.getLogging("2018-03-01 00:00:00", "2018-03-05 00:00:00").then(() => {
    //   this.database.getLatestLogged().then(x => {
    //     console.log("LATEST: " + x);
    //   });
    // })

    // let tmp = new Date(Date.parse(this.database.getLatestLoggedString().toString()));
    // console.log("TMP: " + tmp.getFullYear() + "-" + ('0' + (tmp.getMonth() + 1)).slice(-2) + '-' + ('0' + tmp.getDate()).slice(-2));
    // let tmp_2 = tmp.getFullYear() + "-" + ('0' + (tmp.getMonth() + 1)).slice(-2) + '-' + ('0' + tmp.getDate()).slice(-2);
    // this.database.getSumOfDate("a1", tmp_2).then(data => {
    //   console.log("DATA1: " + JSON.stringify(data.rows.item(0)));
    //   console.log("DATA2: " + JSON.stringify(data.rows.item(0)));
    //   // console.log("DATA3: " + JSON.stringify(data.rows.item(0)(1)));
    //   // console.log("DATA4: " + data.rows.item(0)(1));
    //   console.log("DATA5: " + data.rows.item(0).summe);
    // })

    // let myDate = new Date();
    // let now = myDate.getFullYear()-1 + '-' + ('0' + (myDate.getMonth() + 1)).slice(-2) + '-' + ('0' + myDate.getDate()).slice(-2) + " " + "00:00:00";
    // console.log("DATE: " + now);

    // console.log("WEEK1: " + moment().startOf("isoWeek"));
    // console.log("WEEK2: " + moment().endOf("isoWeek").toDate().getFullYear());
    // console.log("WEEK2: " + moment().endOf("isoWeek").toDate().getMonth());
    // console.log("WEEK2: " + moment().endOf("isoWeek").toDate().getDate());
    // console.log("WEEK3: " + moment((moment().startOf("isoWeek"))/1000));

    // console.log("DAAATA: " + JSON.stringify(this.database.getDataOfDay("2018-03-14", "a2")));

    // console.log("MOMENT: " + moment().week());

    // console.log("WEEK1: " + moment("2018-03-15").startOf("isoWeek").format("YYYY-MM-DD"));

    // this.database.getDataOfWeek("2018-03-15", "a2");
    // this.database.getDataOfMonth("2018-03-15", "a2");

    // this.database.getDataOfYear("2018-03-15", "a2");
    // let day = moment().startOf("year").subtract(1, "year").format("YYYY-MM-DD HH:mm:ss");
    // console.log(moment(day).add(1, "second").format("YYYY-MM-DD HH:mm:ss"));

    // this.apiHandler.loadData().then(() => {
    //   this.database.getLatestLogged().then(data => {
    //     console.log(JSON.stringify("LATEST: " + data));
    //   });
    // });

    // this.apiHandler.getLogging("2018-03-22 00:00:00", "2018-03-22 10:00:00");

    console.log(moment().startOf("week").format("YYYY-MM-DD HH:mm:ss"));
  }


}
