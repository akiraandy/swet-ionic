import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from '../../models/user';
import { FirebaseErrorParserProvider } from '../../providers/firebase-error-parser';
import { FirebaseService } from '../../services/firebase-service';

import { Validators, FormBuilder, FormGroup } from '@angular/forms';



@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  private signup_form : FormGroup;
  user = {} as User;

  constructor( 
    private errorParser: FirebaseErrorParserProvider, 
    public toast: ToastController,
    private fire: AngularFireAuth,
    private _DB: FirebaseService, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    private form: FormBuilder) {
      this.signup_form = this.form.group({
        firstName: ["", Validators.required],
        lastName: ["", Validators.required],
        DoB: ["", Validators.required],
        email: ["", Validators.compose([Validators.email, Validators.required])],
        password: ["", Validators.required]
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  async signup(user: User){
    try {
      this.fire.auth.createUserWithEmailAndPassword(user.email, user.password)
      .then((res) => {
        user.id = res.uid
        this._DB.addUser(user);
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
          this.navCtrl.push("LoginPage");
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
