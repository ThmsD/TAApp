import { Injectable } from '@angular/core';
import { CMIData } from "../../entities/cmiData";
import { Http } from "@angular/http";

@Injectable()
export class ApiHandlerProvider {

  data: any;
  private cmiData: CMIData;
  dataSet: Array<CMIData>;

  constructor(public http: Http) {
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

  test() {
    return "test function";
  }

}
