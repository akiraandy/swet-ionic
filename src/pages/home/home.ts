import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, LoadingController } from 'ionic-angular';
import firebase from 'firebase';
import 'firebase/firestore';
import { FirebaseService } from '../../services/firebase-service';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private _COLL : string = "users";
  private _DC : string = "qeDQ8el6XzOuHl4Plgqq8cylhah2"
  private _CONTENT : any;
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