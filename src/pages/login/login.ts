import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AlertController } from 'ionic-angular';
import { User } from '../../models/user';
import { FirebaseErrorParserProvider } from '../../providers/firebase-error-parser/firebase-error-parser';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;

  constructor(private errorParser: FirebaseErrorParserProvider, private toast: ToastController, public alertCtrl: AlertController, private fire: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  alert(message: string){

  }

  login(user: User) {
    try {
      this.fire.auth.signInWithEmailAndPassword(user.email, user.password)
      .then(data => {
        console.log('got some data', data);
        // user is logged in
      })
      .catch( error => {
        this.errorParser.pop_toast(error)
      });
    }
    catch(error) {
      this.errorParser.pop_toast(error)
    }
    
  }
}

