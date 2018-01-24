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

  @ViewChild('username') username;
  @ViewChild('password') password;

  constructor(public navCtrl: NavController, public navParams: NavParams, private database: DatabaseProvider, private http: Http) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  save() {
    console.log("Data: ", this.username.value, this.password.value);
    // this.database.addCredentials(this.username.value, this.password.value).then(result => console.log("Ergebnis: " + result));
    // this.database.createDatabase();
    
    let headers = new Headers();
    // headers.append('Access-Control-Allow-Origin' , '*');
    // headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    // headers.append('Accept','application/json');
    // headers.append('content-type','application/json');

    // start chrome with --disable-web-security to test it in chrome
    
    headers.append('Authorization', 'Basic cmVuZV9wZWlubDpIU2hvZlJQRTIwMTc=');
    let options = new RequestOptions({headers:headers});
    this.http.post("https://api.ta.co.at/v1/access_token", {}, options) 
      .subscribe(res => {
        console.log("Post: " + res);
        console.log("1: " + JSON.stringify(res));
        console.log("2: " + JSON.stringify(res.json()));
        console.log("3: " + res.text());
        let js = JSON.parse(res.text()).data.access_token;
        let cookid = js.cookid;
        let username = js.username;
        console.log("js: " + cookid + ":" + username);
      },
      err => { console.log("POST-Error: " + err) });
  }

}
