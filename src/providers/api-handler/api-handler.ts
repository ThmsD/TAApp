import { Injectable } from '@angular/core';
import { CMIData } from "../../entities/cmiData";
import { Http, Headers, RequestOptions } from "@angular/http";
import { DatabaseProvider } from '../database/database';

@Injectable()
export class ApiHandlerProvider {

  data: any;
  private cmiData: CMIData;
  dataSet: Array<CMIData>;
  private TAG: String = "APIHandler - ";

  constructor(public http: Http, public database: DatabaseProvider) {
    this.cmiData = new CMIData();
    this.dataSet = new Array();
  }

  /*
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

  loadData() {
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
          console.log(v.value.length + " - " + pos);
          un = v.value.substring(pos + 1, v.value.length);

          this.cmiData.values.push({ description: desc, value: val, unit: un });
          this.dataSet.push(this.cmiData);
          // this.cmiData = new CMIData();
        }

        // console.log("DataSet: " + JSON.stringify(this.dataSet));
        return this.dataSet;

      }
    });
  }
  */

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
    this.database.getCredentials().then(data => {
      username = data[0].name;
      pwd = data[0].password;
      console.log(this.TAG + "Name+Pwd: " + username + " " + pwd);

      let base64String = btoa(username + ":" + pwd); //btoa("rene_peinl" + ":" + "HShofRPE2017"); 
      console.log(base64String + " = " + atob(base64String));
      headers.append('Authorization', 'Basic ' + base64String);
      let options = new RequestOptions({headers:headers});
      this.http.post("https://api.ta.co.at/v1/access_token", {}, options) 
        .subscribe(res => {
          // console.log("3: " + res.text());
          let js = JSON.parse(res.text()).data.access_token;
          let cookid = js.cookid;
          let username = js.username;
          // console.log("js: " + cookid + ":" + username);
          this.database.addAccessToken(cookid);
        },
        err => { console.log("POST-Error: " + err) });
    });
  }

  getAddress() {
    this.http.get("https://api.ta.co.at/v1/cmis/CMI010492/address?mode=all", {}) 
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
    err => { console.log("GET-Error: " + err) });
  }

  test() {
    return "test function";
  }

}