import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { Http, Headers, RequestOptions } from "@angular/http";


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  private TAG: string = "Settings - ";

  nm: string;
  pwd: string;
  // user = [];
  userMod = {};

  // @ViewChild('username') username;
  // @ViewChild('password') password;

  constructor(public navCtrl: NavController, public navParams: NavParams, private database: DatabaseProvider, private http: Http) {
    this.database.getDatabaseState().subscribe(rdy => {
      if(rdy) {
        console.log(this.TAG + "Database seems to be ready");
        this.loadUserData();
      }
    })
    console.log(this.TAG + "constuctor");
  }

  loadUserData() {
    this.database.getCredentials().then(data => {
      // this.user = data;
      this.nm = data[0].name;
      this.pwd = "password";
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
    console.log(this.TAG + "saveCred: " + this.userMod['name'] + this.userMod['password']);
    this.database.addCredentials(this.userMod['name'], this.userMod['password'])
    .then(data => {
      this.loadUserData();
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

}
