import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from '../../models/user';
import { FirebaseErrorParserProvider } from '../../providers/firebase-error-parser';
import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';
import { FirebaseService } from '../../services/firebase-service';
import { UserService } from '../../services/user-service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import firebase from 'firebase';
import 'firebase/firestore';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;
  private login_form : FormGroup;

  constructor( 
    private errorParser: FirebaseErrorParserProvider, 
    private toast: ToastController, 
    private fire: AngularFireAuth, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    private _DB: FirebaseService,
    public userService: UserService,
    private form: FormBuilder) {
      this.login_form = this.form.group({
        email: ["", Validators.compose([Validators.email, Validators.required])],
        password: ["", Validators.required]
      });
    }

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

