import { Injectable } from '@angular/core';
import { CMIData } from "../../entities/cmiData";
import { Http, Headers, RequestOptions } from "@angular/http";
import { DatabaseProvider } from '../database/database';
import { Observable } from 'rxjs/Observable';
import * as moment from "moment";

@Injectable()
export class ApiHandlerProvider {

  private basicURL: string = "https://api.ta.co.at/v1/cmis/";

  data: any;
  private cmiData: CMIData;
  dataSet: Array<CMIData>;
  private TAG: String = "APIHandler - ";
  private cookid: string;

  constructor(public http: Http, public database: DatabaseProvider) {
    this.cmiData = new CMIData();
    this.dataSet = new Array();
  }

  // ********************************************
  loadOverviewData() {

    return this.http.get("assets/testdata_full.json").toPromise().then(
      res => {
        // console.log("PROMISE: " + JSON.stringify(res.json().data));
        return res.json().data;
        // this.data = res.json().data;

        // res.json().data;
        // console.log("load: " + JSON.stringify(res.json().data));
      });
    // console.log("Success: " + JSON.stringify(this.data));
    // return "wtf";
  }

  loadDataFull() {
    return this.loadOverviewData().then(x => {
      console.log("x: " + JSON.stringify(x));
      let desc;
      let val;
      let un;
      let pos;
      for (let item of x) {
        console.log(item.name);
        this.cmiData.name = item.name;
        for (let v of item.values) {
          desc = v.description;
          pos = v.value.indexOf(" ")
          val = v.value.substring(0, pos);
          // console.log(v.value.length + " - " + pos);
          un = v.value.substring(pos + 1, v.value.length);

          this.cmiData.values.push({ description: desc, value: val, unit: un });
          
        }
        this.dataSet.push(this.cmiData);
        this.cmiData = new CMIData();
      }

        // console.log("DataSet: " + JSON.stringify(this.dataSet));
        return this.dataSet;

      // }
    });
  }
// ****************************************

  load() {
    return this.http.get("assets/testdata_full.json").toPromise().then(
      x => {
        let res = x.json().data;
        let desc;
        let val;
        let un;
        let pos;
        for (let item of res) {
          this.cmiData.name = item.name;
          for (let v of item.values) {
            this.cmiData.values.push({
              description: v.description,
              value: v.value.substring(0, v.value.indexOf(" ")),
              unit: v.value.substring(v.value.indexOf(" ") + 1, v.value.length)
            })
          }
          this.dataSet.push(this.cmiData);
          this.cmiData = new CMIData();
        }
        return this.dataSet;
      });
  }

  getAccessToken() {

    let headers = new Headers();
    let username: string;
    let pwd: string;
    return this.database.getCredentials().then(data => {
      console.log(this.TAG + "jas " + JSON.stringify(data));
      console.log(this.TAG + "token " + data.token);
      username = data.name;
      pwd = data.password;
      console.log(this.TAG + "Name+Pwd: " + username + " " + pwd);

      let base64String = btoa(username + ":" + pwd); //btoa("rene_peinl" + ":" + "HShofRPE2017"); 
      console.log(base64String + " = " + atob(base64String));
      headers.append('Authorization', 'Basic ' + base64String);
      let options = new RequestOptions({ headers: headers });
      return this.http.post("https://api.ta.co.at/v1/access_token", {}, options)
        .subscribe(res => {
          // console.log("3: " + res.text());
          let js = JSON.parse(res.text()).data.access_token;
          let cookid = js.cookid;
          let username = js.username;
          console.log("js: " + cookid + ":" + username);
          return this.database.addAccessToken(cookid);
        },
        err => { console.log("POST-Error: " + err) });
    });
  }

  getAddress() { // not needed
    this.http.get(this.basicURL + "CMI010492/address?mode=all", {})
      .subscribe(res => {
        console.log("Get: " + res);
        console.log("1: " + JSON.stringify(res));
        console.log("2: " + JSON.stringify(res.json()));
        console.log("3: " + res.text());
        let js = JSON.parse(res.text()).data.access_token;
        this.cookid = js.cookid;
        let username = js.username;
        console.log("js: " + this.cookid + ":" + username);
      },
      err => { console.log("GET-Error: " + err) });
  }

  /**
   * GET-Request to obtain all data that is available for the
   * saved profile in the given timeframe.
   * Calls also methods to save this data to the database.
   * 
   * @param from in the format YYYY-MM-DD hh:mm:ss
   * @param to in the format YYYY-MM-DD hh:mm:ss
   */
  async getLogging(from: string, to: string) {
    let cmiid = await this.database.getCMIId();
    let profile = await this.database.getProfile();
    console.log(this.TAG + "CMIID: " + cmiid);
    console.log(this.TAG + "PROFILE: " + profile);
    await this.http.get(this.basicURL + cmiid + "/profile/" + profile + "/all?from=" + from + "&to=" + to, {}) //2018-02-14 00:00:00&to=2018-02-14 12:00:00", {})
      .subscribe(res => {
        let description = JSON.parse(res.text()).data.description;
        let units = JSON.parse(res.text()).data.units;
        let values = JSON.parse(res.text()).data.val;

        console.log("UNITS: " + JSON.stringify(units));
        console.log("DESC: " + JSON.stringify(description));
        console.log("VAL: " + JSON.stringify(values));

        // this.database.addDescriptions(description);
        // this.database.addUnits(units);
        this.database.addDevices(description, units);
        // this.database.addValues(values);
        this.database.addValuesNew(values);
      },
      err => { console.log("GET-Error: " + err) });
  }

  loadData() {
    // if (this.database.hasLoggedData) {
      return this.database.getLatestLogged().then(data => { // datetime des aktuellsten Datenbankeintrag
        
        /*
        let fromP1 = JSON.stringify(data).substr(1, 17); // = 2018-01-01 12:00:00
        let fromP2 = JSON.stringify(data).substr(18, 2); // = 00
        // console.log("P1: " + JSON.stringify(fromP1));
        // console.log("P2: " + fromP2);
        if (fromP2 === "00") {
          fromP2 = "01";
        } else {
          let tmp = parseInt(fromP2);
          fromP2 = JSON.stringify(tmp + 1);
        }
        console.log("P2_2: " + fromP2);
        var myDate = new Date();
        var now = myDate.getFullYear() + '-' + ('0' + (myDate.getMonth() + 1)).slice(-2) + '-' + ('0' + myDate.getDate()).slice(-2) + " " +
          ('0' + (myDate.getHours())).slice(-2) + ":" + ('0' + (myDate.getMinutes())).slice(-2) + ":" + ('0' + (myDate.getSeconds())).slice(-2);
        */

        let from = moment(data).add(1, "second").format("YYYY-MM-DD HH:mm:ss");
        let to = moment().format("YYYY-MM-DD HH:mm:ss");


        // return this.getLogging(fromP1 + fromP2, now).then(() => { // logging vom aktuellsten DB Eintrag bis heute speichern
        return this.getLogging(from, to).then(() => {
          return this.database.getLatestLoggedData().then(latest => { // aktuellste Eintrag aus der DB bekommen
            return this.database.getDevicesMap().then(devicesMap => { // Map fuer die Zordnung der Geraete erhalten
              // console.log("MAP: " + devicesMap.get("a1")[1]); // a1 unit=kW
              return this.database.getLoggedDataFromDB(latest.logged).then(data => {  // aktuellste Daten aus der DB bekommen (vollstaendig)
                let overviewData: Array<CMIData>;
                let cmi = new CMIData();
                let einheit;
                overviewData = new Array();
                let tmp = new Date(Date.parse(this.database.getLatestLoggedString().toString()));
                let tmp_2 = tmp.getFullYear() + "-" + ('0' + (tmp.getMonth() + 1)).slice(-2) + '-' + ('0' + tmp.getDate()).slice(-2);
                for (let i = 0; i < data.rows.length; i++) {
                  this.database.getSumOfDate(data.rows.item(i).device_id, tmp_2).then(sum => {
                    einheit = devicesMap.get(data.rows.item(i).device_id)[1];
                    cmi.name = devicesMap.get(data.rows.item(i).device_id)[0];
                    cmi.id = data.rows.item(i).device_id;
                    cmi.values.push({ description: "Aktuell:&nbsp;", value: data.rows.item(i).value, unit: einheit });
                    cmi.values.push({ description: "Heute:&nbsp;", value: this.precisionRound(sum, 2), unit: einheit + "h" });
                    // console.log("CMI: " + JSON.stringify(cmi));
                    overviewData.push(cmi);
                    cmi = new CMIData();
                    // console.log("DVCID: " + devicesMap.get(data.rows.item(i).device_id)[0]);
                  });
                }

                // ENERGIEMONITOR berechnen


                return overviewData;
              })
            });
            // return latest;
          });
        });
      });
    // };
  }



  precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }


  test() {

  }

}
