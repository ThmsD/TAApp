import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  @ViewChild('username') username;
  @ViewChild('password') password;

  constructor(public navCtrl: NavController, public navParams: NavParams, private database: DatabaseProvider) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  save() {
    console.log("Data: ", this.username.value, this.password.value);
    // this.database.addCredentials(this.username.value, this.password.value).then(result => console.log("Ergebnis: " + result));
    this.database.createDatabase();
  }

}
