import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-data-details',
  templateUrl: 'data-details.html',
})
export class DataDetailsPage {
  //------------------------------
  @ViewChild('SwipedTabsSlider') SwipedTabsSlider: Slides ;

  SwipedTabsIndicator :any= null;
  tabs:any=[];

  //------------------------------

  private item: any;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.loadData();
    this.tabs=["page1","page2","page3","page4"];
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




  ionViewDidEnter() {
    this.SwipedTabsIndicator = document.getElementById("indicator");
  }

   selectTab(index) {    
    this.SwipedTabsIndicator.style.webkitTransform = 'translate3d('+(100*index)+'%,0,0)';
    this.SwipedTabsSlider.slideTo(index, 500);
  }

  updateIndicatorPosition() {
      // this condition is to avoid passing to incorrect index
  	if( this.SwipedTabsSlider.length()> this.SwipedTabsSlider.getActiveIndex())
  	{
  		this.SwipedTabsIndicator.style.webkitTransform = 'translate3d('+(this.SwipedTabsSlider.getActiveIndex() * 100)+'%,0,0)';
  	}
    
    }

  animateIndicator($event) {
  	if(this.SwipedTabsIndicator)
   	    this.SwipedTabsIndicator.style.webkitTransform = 'translate3d(' + (($event.progress* (this.SwipedTabsSlider.length()-1))*100) + '%,0,0)';
  }

}
