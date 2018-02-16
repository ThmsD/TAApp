import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject, SQLiteDatabaseConfig } from "@ionic-native/sqlite";
import { BehaviorSubject } from "rxjs/Rx";
import { Platform } from 'ionic-angular/platform/platform';


@Injectable()
export class DatabaseProvider {

  private TAG: String = "DatabaseProvider - ";

  public database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;

  constructor(private sqlite: SQLite, private platform: Platform) {
    console.log('Hello DatabaseProvider');
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(() => {
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
          this.database.executeSql('CREATE TABLE IF NOT EXISTS measurements(id INTEGER PRIMARY KEY, logged DATETIME, value DECIMAL(5,2), FOREIGN KEY(device_id) REFERENCES devices(id))', {})
            .then(() => console.log(this.TAG + "table measurements initialized"))
            .catch(e => console.log(this.TAG + "Error: measurements initialization - " + e));

          this.databaseReady.next(true);
        })
    });
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
      let user = [];
      // console.log(this.TAG + "GetCreds1: " + JSON.stringify(data));
      // console.log(this.TAG + "GetCreds2: " + JSON.stringify(data.rows));
      console.log(this.TAG + "GetCreds3: " + JSON.stringify(data.rows.item(0)));
      console.log(this.TAG + "0getCreds: " + data.rows.item(0).id + "; " + data.rows.item(0).name + "; " + data.rows.item(0).password + "; " + data.rows.length);
      // console.log(this.TAG + "1getCreds: " + data.rows.item(1).id + "; " + data.rows.item(1).name + "; " + data.rows.item(1).password + "; " + data.rows.length);
      // console.log(this.TAG + "2getCreds: " + data.rows.item(2).id + "; " + data.rows.item(2).name + "; " + data.rows.item(2).password + "; " + data.rows.length);
      // if(data.rows.length > 0) {
      //   for(var i = 0; i < data.rows.length; i++) {
      user.push({ name: data.rows.item(0).name, password: data.rows.item(0).password, cmiid: data.rows.item(0).cmiid, profile: data.rows.item(0).profile});
      //   }
      // }
      console.log(this.TAG + "User: " + user[0] + " - " + user[0].name + " # " + user[0].toString + " ** " + JSON.stringify(user));
      return user;
    }, err => {
      console.log(this.TAG + err);
      return [];
    })
  }

  addAccessToken(token: string) {
    let data = [token, 0];
    this.database.executeSql('UPDATE credentials SET token=? WHERE id = ?', data).then(() => {
      console.log(this.TAG + "Token added");
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