import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { Http } from "@angular/http";
import { DataDetailsPage } from "../data-details/data-details";
import { DatabaseProvider } from '../../providers/database/database';
import { EnergyMonitorPage } from '../energy-monitor/energy-monitor';
import { CMIData } from "../../entities/cmiData";
import { ApiHandlerProvider } from '../../providers/api-handler/api-handler';
import { SplashScreen } from '@ionic-native/splash-screen';

@IonicPage()
@Component({
  selector: 'page-overview',
  templateUrl: 'overview.html'
})
export class OverviewPage {

  private data: any;
  private dbReady: boolean = false;
  // dataSet: Array<CMIData>;
  // kk: CMIData;
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private database: DatabaseProvider, private apiHandler: ApiHandlerProvider, splashScreen: SplashScreen) {
    // this.kk = new CMIData();
    // this.dataSet = new Array();

    // this.apiHandler.loadOverviewData().then(x => {
    //   this.data = x;
    // });

    // this.apiHandler.loadData().then(x => {
    //   this.data = x;
    //   console.log("Data: " + JSON.stringify(this.data));
    // });
    
    this.loadView();

  }


  ngOnInit() {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OverviewPage');
    // this.http.get("assets/testdata_full.json")
    //   .subscribe(
    //   res => {
    //     this.data = res.json().data;
    //     console.log("Success: " + JSON.stringify(this.data));
    //   },
    //   err => { console.log("Error: " + err) },
    //   () => { console.log("Loading data completed") }
    //   );

    // this.kk.name = "EVI";
    // this.kk.values.push({description: "Aktuell: ", value: 3.3, unit: "beta"});
    // this.dataSet.push(this.kk);
    // this.kk = new CMIData();
    // this.kk.name = "Photovoltaik";
    // this.kk.values.push({description: "Aktuell: ", value: 7, unit: "kW"});
    // this.kk.values.push({description: "Heute: ", value: 12, unit: "kWh"});
    // this.dataSet.push(this.kk);
    // console.log("kk: " + JSON.stringify(this.dataSet));



  }

  loadView() {
    console.log("asdb1 - " + this.dbReady);

    this.database.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        console.log("Database seems to be ready");
        this.database.credentialsAvailable().then(x => {
          if (x === true) {
            this.dbReady = true;
            this.apiHandler.getAccessToken();
            if (this.database.hasLoggedData) {
              // this.apiHandler.getLogging
            } else {
              
            }
          }
          else this.navCtrl.push(SettingsPage);

          this.apiHandler.load().then(x => {
            this.data = x;
            console.log("Data: " + JSON.stringify(this.data));
          });

        });



      }
    });
  }

  public goToSettings() {
    this.navCtrl.push(SettingsPage);
  }

  public showDetails(item: any) {
    if (JSON.parse(JSON.stringify(item)).name == "Energiemonitor") {
      this.navCtrl.push(EnergyMonitorPage, { "item": item, "data": this.data });
    } else {
      this.navCtrl.push(DataDetailsPage, { "item": item });
    }
  }

  test(b: boolean): boolean {
    return b;
  }

}
