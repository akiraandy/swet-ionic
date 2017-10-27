import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { WorkoutPage } from '../workout/workout';
import { StatsPage } from '../stats/stats';
import { NavParams, Events } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = WorkoutPage;
  tab3Root = StatsPage;
  homeParams : any;

  constructor(public params: NavParams) {
    this.homeParams = params.data;
  }
}
