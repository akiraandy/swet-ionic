import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, IonicPage } from 'ionic-angular';
import { UserService } from '../../services/user-service';

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
    public loadingCtrl: LoadingController) {}

  ionViewWillEnter(){
    this.userFirstName = this.navParams.data.currentUser.first
  }

  getNav(){
    console.log(this.navParams);
  }
}