import { Component } from '@angular/core';
import { NavParams, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  templateUrl: 'tabs.html',
  selector: 'page-tabs',
})
export class TabsPage {

  home = "HomePage";
  workout = "WorkoutPage";
  stats = "StatsPage";
  homeParams : any;

  constructor(public params: NavParams) {
    this.homeParams = params.data;
  }
}
