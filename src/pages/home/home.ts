import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, IonicPage } from 'ionic-angular';
import { UserService } from '../../services/user-service';
import moment from 'moment';
import {FirebaseService} from '../../services/firebase-service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public userFirstName;

  constructor(public navParams: NavParams, 
    public navCtrl: NavController, 
    public userService: UserService,
    public loadingCtrl: LoadingController,
    private _DB: FirebaseService,
    private user: UserService) {}

  ionViewWillEnter(){
    this.userFirstName = this.navParams.data.currentUser.first
  }

  getNav(){
    this._DB.getWorkout("91c9531ZeVbFJ65iSMcN")
    .then(response => {
      console.log(response);
    })
  }
}