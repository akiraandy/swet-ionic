import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AlertController } from 'ionic-angular';
import { User } from '../../models/user';
import { FirebaseErrorParserProvider } from '../../providers/firebase-error-parser/firebase-error-parser';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  user = {} as User;

  constructor(private errorParser: FirebaseErrorParserProvider, public alertCtrl: AlertController, private fire: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  async signup(user: User){
    try {
      this.fire.auth.createUserWithEmailAndPassword(user.email, user.password)
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        this.errorParser.pop_toast(error);
      });
      
    }
    catch(error) {
      this.errorParser.pop_toast(error);
    }
  }

  showAlert(errorMessage) {
    let alert = this.alertCtrl.create({
      title: 'Invalid input',
      subTitle: errorMessage,
      buttons: ['OK']
    });
    alert.present();
  }

}
