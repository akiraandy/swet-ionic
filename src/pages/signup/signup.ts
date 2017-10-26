import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AlertController } from 'ionic-angular';
import { User } from '../../models/user';
import { FirebaseErrorParserProvider } from '../../providers/firebase-error-parser';
import { LoginPage } from '../login/login';
import { FirebaseService } from '../../providers/firebase-service';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  user = {} as User;

  constructor(private firebase: FirebaseService, private errorParser: FirebaseErrorParserProvider, public toast: ToastController, private fire: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  async signup(user: User){
    try {
      this.fire.auth.createUserWithEmailAndPassword(user.email, user.password)
      .then((res) => {
        user.id = res.uid
        this.firebase.addUser(user);
        this.sendEmailVerification();
      })
      .catch(error => {
        this.errorParser.pop_toast(error);
      });
      
    }
    catch(error) {
      this.errorParser.pop_toast(error);
    }
  }

  sendEmailVerification(){
    this.fire.authState.subscribe(user => {
      user.sendEmailVerification()
      .then(() => {
        this.toast.create({
          message: "Please check your email to verify your account.",
          duration: 3000,
        }).present().then(res => {
          this.navCtrl.push(LoginPage);
          this.navCtrl.remove(1);
        });
      }).catch(error => {
        this.toast.create({
          message: error,
          duration: 3000,
        }).present();
      });
    })
  }

}
