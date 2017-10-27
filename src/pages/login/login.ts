import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, App } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AlertController } from 'ionic-angular';
import { User } from '../../models/user';
import { FirebaseErrorParserProvider } from '../../providers/firebase-error-parser';
import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';
import { FirebaseService } from '../../providers/firebase-service';
import { UserService } from '../../services/user-service';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;

  constructor(
    private app: App, 
    private errorParser: FirebaseErrorParserProvider, 
    private toast: ToastController, 
    private fire: AngularFireAuth, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    private _DB: FirebaseService,
    public userService: UserService) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  alert(message: string){

  }

  login(user: User) {
    try {
      this.fire.auth.signInWithEmailAndPassword(user.email, user.password)
      .then(user => {
        if(user.emailVerified) {
          let userData = this._DB.getUser(user.uid)
          userData.then(data => {
            this.userService.setUser(data);
            this.navCtrl.setRoot(TabsPage, {
              currentUser : data
            });
          })
          .catch( error => {
            console.log(error);
          })
        } else {
          this.toast.create({
            message: "Please verify your email.",
            duration: 3000
          }).present();
        }
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

