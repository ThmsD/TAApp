import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { Http } from "@angular/http";
import { DataDetailsPage } from "../data-details/data-details";

@IonicPage()
@Component({
  selector: 'page-overview',
  templateUrl: 'overview.html'
})
export class OverviewPage {

  private data: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OverviewPage');
    this.http.get("assets/testdata_full.json")
      .subscribe(
      res => {
        this.data = res.json().data;
        console.log("Success: " + JSON.stringify(this.data));
      },
      err => { console.log("Error: " + err) },
      () => { console.log("Loading data completed") }
      );
  }

  public goToSettings() {
    // this.navCtrl.push(SettingsPage);
    this.http.post("https://api.ta.co.at/v1/access_token", {"Authorization":"Basic cmVuZV9wZWlubDpIU2hvZlJQRTIwMTc="})
      .subscribe(res => {
        console.log("Post: " + res);
      },
      err => { console.log("POST-Error: " + err) });
  }

  public showDetails(item: any) {
    this.navCtrl.push(DataDetailsPage, { "item": item });
  }

  test(b: boolean): boolean {
    return b;
  }

}
