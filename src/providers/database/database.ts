import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject, SQLiteDatabaseConfig } from "@ionic-native/sqlite";


@Injectable()
export class DatabaseProvider {

  public database: SQLiteObject;

  constructor(private sqlite: SQLite) {
    console.log('Hello DatabaseProvider');
    // this.sqlite.create({name: "data.db", location: "default"}).then((db: SQLiteObject) => {
    //   this.database = db;
    // }, (error) => {
    //   console.log("ERROR: " + error);
    // });
  }

  public createDatabase() {
    this.sqlite.create({
      name: "data.db",
      location: "default"
    }).then((db: SQLiteObject) => {
      db.executeSql('create table if note exists credentials(name VARCHAR(18), password TEXT)', {})
      .then(() => console.log("Database created"))
      .catch(e => console.log(e));
    }).catch(e =>  console.log(e));
  }

  public addCredentials(user: string, password: string) {
    return new Promise(resolve => {
      console.log("user: " + user + ", " + password);
      resolve(true);
    });
  }

}
