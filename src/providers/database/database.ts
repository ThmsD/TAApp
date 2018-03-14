import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject, SQLiteDatabaseConfig } from "@ionic-native/sqlite";
import { BehaviorSubject } from "rxjs/Rx";
import { Platform } from 'ionic-angular/platform/platform';


@Injectable()
export class DatabaseProvider {

  private TAG: String = "DatabaseProvider - ";

  public database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;

  private latestLogged: String;
  private bHasLoggedData: Boolean;


  constructor(private sqlite: SQLite, private platform: Platform) {
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

    // this.database.executeSql('SELECT * FROM measurements', []).then((data) => {
    //   console.log(this.TAG + "MEASUREMENT: " + JSON.stringify(data.rows.item(0)));
    //   console.log(this.TAG + "MEASUREMENT: " + JSON.stringify(data.rows.item(240)));
    // }, err => {
    //   console.log(this.TAG + err);
    // });

  }

  addDevices(description: any, units: any) {
    for (var device in description) { // device = "a1"; description[device] = "Strom PV"
      this.database.executeSql('REPLACE INTO devices(id, name) VALUES(?, ?)', [device, description[device]]).then(() => {
      }, err => {
        console.log(this.TAG + "Error: device not added - " + JSON.stringify(err));
      });

    }
    for (var device in units) { // device = "a1"; units[device].unity = "kW"
      console.log("ERR? " + units[device].unity + "  " + device);
      this.database.executeSql('UPDATE devices SET unit = ? WHERE id = ?', [units[device].unity, device]).then(() => {
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
    this.database.executeSql('delete from credentials', {}).then(res => {
      console.log(this.TAG + "table dropped");
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
      this.latestLogged = data.rows.item(0).logged;
      console.log(this.TAG + "Latest Logged" + this.latestLogged);
      if (data.rows.length === 1) {
        this.bHasLoggedData = true;
        return this.latestLogged;
      } else {
        var myDate = new Date();
        return myDate.getFullYear()-1 + '-' + ('0' + (myDate.getMonth() + 1)).slice(-2) + '-' + ('0' + myDate.getDate()).slice(-2) + " " + "00:00:00";
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
      return data.rows.item(0).summe;
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