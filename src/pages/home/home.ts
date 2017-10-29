import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, LoadingController, IonicPage } from 'ionic-angular';
import firebase from 'firebase';
import 'firebase/firestore';
import { FirebaseService } from '../../services/firebase-service';
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
    private _DB: FirebaseService, 
    public userService: UserService,
    public loadingCtrl: LoadingController) {}

  ionViewWillEnter(){
    this.userFirstName = this.navParams.data.currentUser.first
  }

  getNav(){
    console.log(this.navParams);
  }
}