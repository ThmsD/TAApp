import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject, SQLiteDatabaseConfig } from "@ionic-native/sqlite";
import { BehaviorSubject } from "rxjs/Rx";
import { Platform } from 'ionic-angular/platform/platform';
import * as moment from "moment";
import { take } from 'rxjs/operators/take';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';


@Injectable()
export class DatabaseProvider {

  private TAG: String = "DatabaseProvider - ";

  public database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;

  private latestLogged: string;
  private bHasLoggedData: Boolean;

  private logsPerHours: number = 12;
  private hours = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"
    , "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];


  constructor(private sqlite: SQLite, private platform: Platform, private toastCtrl: ToastController) {
    // console.log('Hello DatabaseProvider');
    this.bHasLoggedData = false;
    this.initialize();
  }

  initialize() {
    this.databaseReady = new BehaviorSubject(false);
    // this.platform.ready().then(() => {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        this.database = db;

        this.database.executeSql('CREATE TABLE IF NOT EXISTS credentials(id INTEGER PRIMARY KEY, name VARCHAR(18), password TEXT, cmiid TEXT, token TEXT, profile TEXT)', {})
          .then(() => console.log(this.TAG + "table credentials initialized"))
          .catch(e => console.log(this.TAG + "Error: credentials initialization - " + e));

        this.database.executeSql('CREATE TABLE IF NOT EXISTS devices(id TEXT PRIMARY KEY, name TEXT, unit TEXT)', {})
          .then(() => console.log(this.TAG + "table devices initialized"))
          .catch(e => console.log(this.TAG + "Error: devices initialization - " + e));

        // Error -> Solution(?): following code netsted in 'create devices table'
        this.database.executeSql('CREATE TABLE IF NOT EXISTS measurements(id INTEGER PRIMARY KEY, logged DATETIME, value DECIMAL(5,2), device_id TEXT, FOREIGN KEY(device_id) REFERENCES devices(id))', {})
          .then(() => console.log(this.TAG + "table measurements initialized"))
          .catch(e => console.log(this.TAG + "Error: measurements initialization - " + e));

        this.getLatestLogged();

        this.databaseReady.next(true);
      })
    // });
  }

  getDatabaseState() {
    return this.databaseReady.asObservable();
  }

  addCredentials(user: string, password: string, cmiid: string, profile: string) {
    let data = [0, user, password, cmiid, profile]; //[0, user, password];
    console.log(this.TAG + "addCredentials: " + data.toString());
    // let query = "REPLACE INTO credentials (id, name, password) VALUES (0, " + user + "," + password + ");";
    return this.database.executeSql('REPLACE INTO credentials (id, name, password, cmiid, profile) VALUES(?, ?, ?, ?, ?)', data).then(() => { //'REPLACE INTO credentials (id, name, password) VALUES (0, "?", "?")', {data}).then(() => {
      console.log(this.TAG + "Credentials added");
    }, err => {
      console.log(this.TAG + "Error: Credentials not added - " + JSON.stringify(err));
    });
  }

  getCredentials() {
    return this.database.executeSql('SELECT * FROM credentials', []).then((data) => {
      // let user = [];
      // console.log(this.TAG + "GetCreds1: " + JSON.stringify(data));
      // console.log(this.TAG + "GetCreds2: " + JSON.stringify(data.rows));
      console.log(this.TAG + "GetCreds3: " + JSON.stringify(data.rows.item(0)));
      // console.log(this.TAG + "0getCreds: " + data.rows.item(0).id + "; " + data.rows.item(0).name + "; " + data.rows.item(0).password + "; " + data.rows.length);
      // console.log(this.TAG + "1getCreds: " + data.rows.item(1).id + "; " + data.rows.item(1).name + "; " + data.rows.item(1).password + "; " + data.rows.length);
      // console.log(this.TAG + "2getCreds: " + data.rows.item(2).id + "; " + data.rows.item(2).name + "; " + data.rows.item(2).password + "; " + data.rows.length);
      // if(data.rows.length > 0) {
      //   for(var i = 0; i < data.rows.length; i++) {
      // user.push({ name: data.rows.item(0).name, password: data.rows.item(0).password, cmiid: data.rows.item(0).cmiid, profile: data.rows.item(0).profile });
      //   }
      // }
      // console.log(this.TAG + "User: " + user[0] + " - " + user[0].name + " # " + user[0].toString + " ** " + JSON.stringify(user));
      // return user;
      return data.rows.item(0);
    }, err => {
      console.log(this.TAG + JSON.stringify(err));
      return [];
    })
  }

  addAccessToken(token: string) {
    let data = [token, 0];
    return this.database.executeSql('UPDATE credentials SET token=? WHERE id = ?', data).then(() => {
      console.log(this.TAG + "Token added");
      return true;
    }, err => {
      console.log(this.TAG + "Error: Token not added - " + JSON.stringify(err));
    });
  }

  getAccessToken() {
    console.log(moment().format("mm:ss"));
    this.database.executeSql('SELECT * FROM credentials', []).then((data) => {
      console.log(this.TAG + JSON.stringify(data.rows.item(0)));
    }, err => {
      console.log(this.TAG + err);
    })
  }


  // ############################## wird nicht mehr gebraucht?! ###################################
  addDescriptions(description: any) {
    let name: string;
    for (var item in description) {
      name = description[item].substring(description[item].indexOf(" ") + 1);
      console.log("name: " + name);
      this.database.executeSql('INSERT INTO devices(id, name) VALUES(?, ?)', [item, name]).then(() => {
        console.log(this.TAG + "Descriptions added");
      }, err => {
        console.log(this.TAG + "Error: Descriptions not added - " + JSON.stringify(err));
      });
      // console.log("Key:" + item);
      // console.log("Value:" + description[item]);
    }
    // this.database.executeSql('INSERT INTO devices(id, name) VALUES(?, ?)', []).then(() => {
    //   console.log(this.TAG + "Descriptions added");
    // }, err => {
    //   console.log(this.TAG + "Error: Descriptions not added - " + JSON.stringify(err));
    // });
  }

  addUnits(units: any) {
    let unit: string;
    for (var item in units) {
      unit = units[item].unity;
      this.database.executeSql('UPDATE devices SET unit = ? WHERE id = ?', [unit, item]).then(() => {
        console.log(this.TAG + "Units added");
      }, err => {
        console.log(this.TAG + "Error: Units not added - " + JSON.stringify(err));
      });
    }
  }

  // ############################## wird nicht mehr gebraucht?! ###################################
  // ##############################             ENDE            ###################################

  addValues(values: any) {
    let dateTime: string;
    let queryBatch: Array<string> = [];
    let query: string;
    // this.database.transaction((tx) => {
    for (var i = 0; Object.keys(values).length; i++) { //i < 2 ; i++) {
      dateTime = values[i]["zeit"];
      for (var e in values[i]) {
        if (e !== "zeit") {
          query = "INSERT INTO measurements(logged, value, device_id) VALUES('" + dateTime + "', " + values[i][e] + ", '" + e + "')";
          // console.log("##### " + query);
          queryBatch.push(query);
          // tx.executeSql('INSERT INTO measurements(logged, value, device_id) VALUES(?, ?, ?)', [dateTime, values[i][e], e], (tx, resultSet) => {
          //   console.log(this.TAG + 'data added! #######');
          // }, (err) => {
          //   console.log(this.TAG + 'Create Table Error! ####### - ' + JSON.stringify(err)); 
          // }).then(result => {
          //   console.log("#####" + JSON.stringify(result));
          // });


          // tx.executeSql('INSERT INTO measurements(logged, value, device_id) VALUES(?, ?, ?)', [dateTime, values[i][e], e]).then(() => {
          // }, err => {
          //   console.log(this.TAG + "Error: Measurements not added - " + JSON.stringify(err));
          // });


          //values[i][e] = value (e.g. 0.07); 
          // e = key (e.g. a1);
          // console.log("E: " + values[i][e] + "  -  " + e); 
        }
        console.log(this.TAG + "JETZT1");
      }
      console.log(this.TAG + "JETZT2");
    }
    console.log(this.TAG + "JETZT3");
    this.database.sqlBatch(queryBatch).then(result => {
      console.log("#### " + JSON.stringify(result));
    }, err => {
      console.log(this.TAG + "Error: Adding values failed - " + JSON.stringify(err));
    });

    /* WORKING
    for (var i = 0; i < Object.keys(values).length; i++) {
      dateTime = values[i]["zeit"];
      for (var e in values[i]) {
        if (e !== "zeit") {
          this.database.executeSql('INSERT INTO measurements(logged, value, device_id) VALUES(?, ?, ?)', [dateTime, values[i][e], e]).then(() => {
          }, err => {
            console.log(this.TAG + "Error: Measurements not added - " + JSON.stringify(err));
          });
          //values[i][e] = value (e.g. 0.07); 
          // e = key (e.g. a1);
          // console.log("E: " + values[i][e] + "  -  " + e); 
        }
      }
    }
  WORKING */

    console.log(this.TAG + "adding values finished");
    // this.database.executeSql('SELECT * FROM measurements', []).then((data) => {
    //   console.log(this.TAG + "MEASUREMENT: " + JSON.stringify(data.rows.item(0)));
    //   console.log(this.TAG + "MEASUREMENT: " + JSON.stringify(data.rows.item(240)));
    // }, err => {
    //   console.log(this.TAG + err);
    // });

  }


  async addValuesNew(values: any) {
    let toast = this.toastCtrl.create({
      message: "Daten werden aus dem Webportal abgerufen...",
      position: "bttom"
    });
    toast.present();
    let dateTime: string;
    console.log("LENGTH: " + Object.keys(values).length);
    for (var i = 0; i < Object.keys(values).length; i++) { //i < 2 ; i++) {
      dateTime = values[i]["zeit"];
      console.log("I: " + i);
      for (var e in values[i]) {
        if (e !== "zeit") {
          await this.database.executeSql('INSERT INTO measurements(logged, value, device_id) VALUES(?, ?, ?)', [dateTime, values[i][e], e]).then(result => {
            // console.log(this.TAG + 'data added! #######' + i);
          }, err => {
            console.log(this.TAG + 'Create Table Error! ####### - ' + JSON.stringify(err)); 
          // }).then(result => {
          //   console.log("#####" + JSON.stringify(result));
          });


          // tx.executeSql('INSERT INTO measurements(logged, value, device_id) VALUES(?, ?, ?)', [dateTime, values[i][e], e]).then(() => {
          // }, err => {
          //   console.log(this.TAG + "Error: Measurements not added - " + JSON.stringify(err));
          // });

        }
      }
    }

    /* WORKING
    for (var i = 0; i < Object.keys(values).length; i++) {
      dateTime = values[i]["zeit"];
      for (var e in values[i]) {
        if (e !== "zeit") {
          this.database.executeSql('INSERT INTO measurements(logged, value, device_id) VALUES(?, ?, ?)', [dateTime, values[i][e], e]).then(() => {
          }, err => {
            console.log(this.TAG + "Error: Measurements not added - " + JSON.stringify(err));
          });
          //values[i][e] = value (e.g. 0.07); 
          // e = key (e.g. a1);
          // console.log("E: " + values[i][e] + "  -  " + e); 
        }
      }
    }
  WORKING */

    console.log(this.TAG + "adding values finished");
    toast.dismiss();
  }



  async addDevices(description: any, units: any) {
    for (var device in description) { // device = "a1"; description[device] = "Strom PV"
      console.log(this.TAG + JSON.stringify(device));
      await this.database.executeSql('REPLACE INTO devices(id, name) VALUES(?, ?)', [device, description[device]]).then(() => {
      }, err => {
        console.log(this.TAG + "Error: device not added - " + JSON.stringify(err));
      });

    }
    for (var device in units) { // device = "a1"; units[device].unity = "kW"
      await this.database.executeSql('UPDATE devices SET unit = ? WHERE id = ?', [units[device].unity, device]).then(() => {
      }, err => {
        console.log(this.TAG + "Error: unit not added to device - " + JSON.stringify(err));
      });
    }
  }

  getCMIId() {
    return this.database.executeSql('SELECT cmiid FROM credentials', []).then((data) => {
      console.log("miid: " + data.rows.item(0).cmiid);
      return data.rows.item(0).cmiid;
    })
  }

  getProfile() {
    return this.database.executeSql('SELECT profile FROM credentials', []).then((data) => {
      return data.rows.item(0).profile;
    })
  }

  dropTable() {
    console.log(this.TAG + "drop tables started");
    this.database.executeSql('DROP TABLE IF EXISTS credentials', {}).then(() => {
      console.log(this.TAG + "credentials table dropped");
    }, err => {
      console.log(this.TAG + "credentials not dropped - " + JSON.stringify(err));
    });

    this.database.executeSql('DROP TABLE IF EXISTS measurements', {}).then(() => {
      console.log(this.TAG + "measurements table dropped");
    }, err => {
      console.log(this.TAG + "measurements not dropped - " + JSON.stringify(err));
    });
    this.database.executeSql('DROP TABLE IF EXISTS devices', {}).then(() => {
      console.log(this.TAG + "devices table dropped");
    }, err => {
      console.log(this.TAG + "devices not dropped - " + JSON.stringify(err));
    });
  }

  credentialsAvailable() {   
    return this.database.executeSql('SELECT * from credentials', []).then((data) => {
      if (data.rows.length === 1) return true;
      else return false;
    }, err => {
      console.log(this.TAG + "Error: can't check for available credentials - " + JSON.stringify(err));
    })
  }

  loggedDataAvailable() {
    return this.database.executeSql('SELECT * from measurements', []).then(data => {
      if (data.rows.length >= 1) return true;
      else return false;
    }, err => {
      console.log(this.TAG + "Error: can't check for available data - " + JSON.stringify(err));
    });
  }

  /**
    * Returns the date and time of the latest log in the database.
    */
  getLatestLogged() {
    return this.database.executeSql('SELECT * FROM measurements ORDER BY datetime(logged) DESC Limit 1', []).then(data => {
      console.log("LOGGED: " + data.rows.length);
      if (data.rows.length == 1) {
        this.latestLogged = data.rows.item(0).logged;
        console.log(this.TAG + "Latest Logged" + this.latestLogged);
        this.bHasLoggedData = true;
        return moment(this.latestLogged).format("YYYY-MM-DD HH:mm:ss");
      } else {
        // var myDate = new Date();
        // return myDate.getFullYear() - 1 + '-' + ('0' + (myDate.getMonth() + 1)).slice(-2) + '-' + ('0' + myDate.getDate()).slice(-2) + " " + "00:00:00";
        // return moment().startOf("year").subtract(1, "year").format("YYYY-MM-DD HH:mm:ss");

        // return moment().startOf("month").format("YYYY-MM-DD HH:mm:ss");
        // return moment().subtract(1, "days").format("YYYY-MM-DD HH:mm:ss");
        return moment().startOf("isoWeek").format("YYYY-MM-DD HH:mm:ss");
      }

    }, err => {
      console.log(this.TAG + "Error: can't get latest log - " + JSON.stringify(err));
    });
  }

  getLatestLoggedString() {
    return this.latestLogged;
  }

  /**
   * Returns the value of the latest log in the database.
   */
  getLatestLoggedData() {
    return this.database.executeSql('SELECT * FROM measurements ORDER BY datetime(logged) DESC Limit 1', []).then(data => {
      return data.rows.item(0);
    }, err => {
      console.log(this.TAG + "Error: can't get latest log data - " + JSON.stringify(err));
    });
  }

  /**
   * Returns all records with the given date.
   * @param date 
   */
  getLoggedDataFromDB(date: string) {
    return this.database.executeSql('SELECT * FROM measurements WHERE logged = ?', [date]).then(data => {
      // console.log("LATESTDATA: " + JSON.stringify(data));
      return data;
    }, err => {
      console.log(this.TAG + "Error: can't get logged data from database - " + JSON.stringify(err));
    })
  }

  getSumOfDate(device: string, date: string) {
    return this.database.executeSql('SELECT sum(value) AS summe FROM measurements WHERE device_id = ? AND logged LIKE ?', [device, date + '%']).then(data => {
      return (data.rows.item(0).summe / this.logsPerHours);
    }, err => {
      console.log(this.TAG + "Error: can't get sum of device " + device + " on " + date + " - " + JSON.stringify(err));
    });
  }

  /**
   * Returns all devices in database as a map.
   * Map: key, [name, unit]
   */
  getDevicesMap() {
    return this.database.executeSql("SELECT * FROM devices", []).then(data => {
      let map = new Map();
      for (let i = 0; i < data.rows.length; i++) {
        map.set(data.rows.item(i).id, [data.rows.item(i).name, data.rows.item(i).unit]);
      }
      return map;
    })
  }

  hasLoggedData() {
    return this.bHasLoggedData;
  }

  /**
   * 
   * @param day in the format YYYY-MM-DD
   * @param device 
   */
  async getDataOfDay(day: string, device: string) {
    let hourData: Array<any> = [];
    let start: string;
    let end: string;
    for (let hour of this.hours) {
      start = day + " " + hour + ":00:00";
      end = day + " " + hour + ":59:59";
      await this.database.executeSql("SELECT sum(value) as summe FROM measurements WHERE device_id = ? AND logged BETWEEN ? AND ?", [device, start, end]).then(data => {
        // console.log("SUM: " + data.rows.item(0).summe);
        hourData.push(this.precisionRound((data.rows.item(0).summe / this.logsPerHours), 2));
      })
    }
    // console.log("ARRAY: " + hourData);
    // this.details.setDayData(hourData);
    return hourData;
    // this.database.executeSql('SELECT sum(value) AS summe FROM measurements WHERE device_id = ? ')
  }

  async getDataOfDay2(day: string, device: string) {
    let hourData: Array<any> = [];
    let labelData: Array<any> = [];
    await this.database.executeSql("SELECT * FROM measurements WHERE device_id = ? AND logged BETWEEN ? AND ? ORDER BY logged ASC", [device, day + " 00:00:00", day + " 23:59:59"]).then(data => {
      for (var i = 0; i < data.rows.length; i++) {
        labelData.push(moment(data.rows.item(i).logged).format("HH:mm"));
        hourData.push(data.rows.item(i).value);
      }
    });
    // console.log("LABEL: " + labelData);
    return [labelData, hourData];
  }

  async getDataOfWeek(day: string, device: string) {
    let dayData: Array<any> = [];
    let startDayWeek: string = moment(day).startOf("isoWeek").format("YYYY-MM-DD");
    let endDayWeek: string = moment(day).endOf("isoWeek").format("YYYY-MM-DD");
    let dayValue: number = 0;
    let tmp: any;
    await this.database.executeSql("SELECT * FROM measurements WHERE device_id = ? AND logged BETWEEN ? AND ? ORDER BY logged ASC", [device, startDayWeek, endDayWeek + " 23:59:59"]).then(data => {
      let date = startDayWeek; //moment(data.rows.item(0).logged).format("YYYY-MM-DD");
      // console.log("DATE; " + date);
      // console.log("SAME: " + moment(moment(data.rows.item(20).logged).format("YYYY-MM-DD")).isSame(date));
      for (var i = 0; i < data.rows.length; i++) {
        if (moment(moment(data.rows.item(i).logged).format("YYYY-MM-DD")).isSame(date)) {
          dayValue = dayValue + data.rows.item(i).value;
        } else {
          tmp = this.precisionRound(dayValue / this.logsPerHours, 2);
          // console.log(date + " - " + tmp);
          dayData.push(tmp);
          // console.log("VALUE: " + date + " " + dayValue);
          dayValue = data.rows.item(i).value;
          // console.log("NEW VAL: " + dayValue);
          date = moment(data.rows.item(i).logged).format("YYYY-MM-DD");
          // console.log("NEW DATE: " + date);
        }
      }
      dayData.push(this.precisionRound(dayValue / this.logsPerHours, 2));
      // console.log("WEEK: " + dayData);
    });
    while (dayData.length < 7) {
      dayData.push(0);
    }
    return dayData;
  }

  async getDataOfMonth(day: string, device: string) {
    let monthData: Array<any> = [];
    let startDayMonth: string = moment(day).startOf("month").format("YYYY-MM-DD");
    let endDayMonth: string = moment(day).endOf("month").format("YYYY-MM-DD");
    let dayValue: number = 0;

    await this.database.executeSql("SELECT * FROM measurements WHERE device_id = ? AND logged BETWEEN ? AND ? ORDER BY logged ASC", [device, startDayMonth, endDayMonth + " 23:59:59"]).then(data => {
      let date = startDayMonth;
      let dayDifference = moment(moment(data.rows.item(0).logged).format("YYYY-MM-DD")).diff(date, "days");
      for (var z = 1; z < dayDifference; z++) {
        monthData.push(0);
      }
      for (var i = 0; i < data.rows.length; i++) {
        if (moment(moment(data.rows.item(i).logged).format("YYYY-MM-DD")).isSame(date)) {
          dayValue = dayValue + data.rows.item(i).value;
        } else {
          monthData.push(this.precisionRound(dayValue / this.logsPerHours, 2));
          dayValue = data.rows.item(i).value;
          date = moment(data.rows.item(i).logged).format("YYYY-MM-DD");
        }
      }
      monthData.push(this.precisionRound(dayValue / this.logsPerHours, 2));
    });
    while (monthData.length < Number(moment(endDayMonth).format("DD"))) {
      monthData.push(0);
    }
    console.log("MONTH: " + monthData);
    return monthData;
  }

  async getDataOfYear(day: string, device: string) {
    let yearData: Array<any> = [];
    let startDayYear: string = moment(day).startOf("year").format("YYYY-MM-DD");
    let endDayYear: string = moment(day).endOf("year").format("YYYY-MM-DD");
    let monthValue: number = 0;

    await this.database.executeSql("SELECT * FROM measurements WHERE device_id = ? AND logged BETWEEN ? AND ? ORDER BY logged ASC", [device, startDayYear, endDayYear + " 23:59:59"]).then(data => {
      let month = moment(startDayYear).format("YYYY-MM");
      let monthDifference = moment(moment(data.rows.item(0).logged).format("YYYY-MM-DD")).diff(month, "months");
      for (var z = 1; z < monthDifference; z++) {
        yearData.push(0);
      }
      for (var i = 0; i < data.rows.length; i++) {
        if (moment(moment(data.rows.item(i).logged).format("YYYY-MM")).isSame(month)) {
          monthValue = monthValue + data.rows.item(i).value;
        } else {
          yearData.push(this.precisionRound(monthValue / this.logsPerHours, 2));
          monthValue = data.rows.item(i).value;
          month = moment(data.rows.item(i).logged).format("YYYY-MM");
        }
      }
      yearData.push(this.precisionRound(monthValue / this.logsPerHours, 2));
    });
    console.log("YEAR: " + yearData);
    return yearData;
  }

  precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }


  // let map = new Map();
  // map.set(data.rows.item(i).id, [data.rows.item(i).name, data.rows.item(i).unit]);



  // public createDatabase() {
  //   this.sqlite.create({
  //     name: "data.db",
  //     location: "default"
  //   }).then((db: SQLiteObject) => {
  //     db.executeSql('create table if not exists credentials(name VARCHAR(18), password TEXT)', {})
  //     .then(() => {
  //       console.log("Database created");
  //       this.databaseReady.next(true);
  //     })
  //     .catch(e => console.log(e));
  //   }).catch(e =>  console.log(e));
  // }

  // public addCredentials(user: string, password: string) {
  //   return new Promise(resolve => {
  //     console.log("user: " + user + ", " + password);
  //     resolve(true);
  //   });
  // }

}




// SELECT * FROM test WHERE logged BETWEEN "2018-02-09" AND "2018-02-12"
// SELECT * FROM test ORDER BY datetime(logged) DESC    // Limit 1
// INSERT INTO orders VALUES (null, 2, 2);
// SELECT * FROM measurements WHERE logged LIKE '2018-03-11%'
// SELECT * FROM measurements WHERE device_id="a1" AND logged LIKE '2018-03-12%'
// SELECT sum(value) FROM measurements WHERE device_id="a1" AND logged LIKE '2018-03-12%'