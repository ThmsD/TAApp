import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-data-details',
  templateUrl: 'data-details.html',
})
export class DataDetailsPage {

  private item: any;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.loadData();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DataDetailsPage');
  }

  loadData() {
    console.log("navParams: " + this.navParams.get("item"));
    this.item = JSON.parse(JSON.stringify(this.navParams.get("item")));
    //this.item = JSON.parse(temp);
    console.log("item: " + (this.item.name));
  }

}
