import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { Http } from "@angular/http";
import { DataDetailsPage } from "../data-details/data-details";
import { DatabaseProvider } from '../../providers/database/database';
import { EnergyMonitorPage } from '../energy-monitor/energy-monitor';

@IonicPage()
@Component({
  selector: 'page-overview',
  templateUrl: 'overview.html'
})
export class OverviewPage {

  private data: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private database: DatabaseProvider) {
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
    this.navCtrl.push(SettingsPage);
  }

  public showDetails(item: any) {
    if(JSON.parse(JSON.stringify(item)).name == "Energiemonitor") {
      this.navCtrl.push(EnergyMonitorPage, { "item": item , "data": this.data});
    } else {
      this.navCtrl.push(DataDetailsPage, { "item": item });
    }
  }

  test(b: boolean): boolean {
    return b;
  }

}
