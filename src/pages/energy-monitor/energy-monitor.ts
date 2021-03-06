import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-energy-monitor',
  templateUrl: 'energy-monitor.html',
})
export class EnergyMonitorPage {



  private data: any;
  strom = { name: <string>"Strom", value: <string>null, arrow: <string>null };
  photovoltaik = { name: <string>"Photovoltaik", value: <string>null };
  evi = { name: <string>"EVI", value: <string>null };
  verbrauchGesamt = { name: <string>"Verbrauch (gesamt)", value: <string>null };
  verbrauchSonstige = { name: <string>"Verbrauch (sonstige)", value: <string>null };

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.loadData();
    this.setData();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EnergyMonitorPage');
  }

  loadData() {
    this.data = this.navParams.get("data");
    JSON.parse(JSON.stringify(this.data)).forEach(element => {
      switch (element.name) {
        case "EVI":
          element.values.forEach(a => {
            if (a.description.indexOf("Verbrauch") !== -1) {
              this.evi.value = a.value;
            }
          });
          break;
        case "Verbrauch":
          element.values.forEach(a => {
            if (a.description.indexOf("Aktuell") !== -1) {
              this.verbrauchGesamt.value = a.value;
            }
          });
          break;
        case "Energiemonitor":
          element.values.forEach(a => {
            this.strom.value = a.value;
          });
          break;
        case "Photovoltaik":
          element.values.forEach(a => {
            if (a.description.indexOf("Aktuell") !== -1) {
              this.photovoltaik.value = a.value;
            }
          });
          break;
        default:
          break;
      }
    });
  }

  setData() {
    let verbrauch = Number(this.replace(this.verbrauchGesamt.value, ",","."));
    let erzeugt = Number(this.replace(this.photovoltaik.value, ",","."));;
    let evi = Number(this.replace(this.evi.value, ",","."));;
    let strom = erzeugt - verbrauch;

    if(strom < 0) {
      this.strom.name = "Bezug";
      this.strom.arrow = "150deg";
      this.strom.value = this.replace(Math.abs(strom).toString(), ".", ",") + " kW";
    } else {
      this.strom.name = "Einspeisung";
      this.strom.arrow = "-30deg";
      this.strom.value = this.replace(Math.abs(strom).toString(), ".", ",") + " kW";
    }
    let sonstige = verbrauch - evi;
    this.verbrauchSonstige.value = this.replace(Math.abs(sonstige).toString(), ".", ",") + " kW";
  }

  replace(txt: string, toReplace: string, replaceWith: string) {
    return txt.replace(toReplace, replaceWith);
  }

  setArrowStyle() {
    return {"transform": "rotate(" + this.strom.arrow + ")"};
  }
}
