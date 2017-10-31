import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Set } from '../../models/set';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { FirebaseService } from '../../services/firebase-service';
import { UserService } from '../../services/user-service';

@IonicPage()
@Component({
  selector: 'page-set-create',
  templateUrl: 'set-create.html',
})
export class SetCreatePage {

  set = {} as Set;
  set_form : FormGroup;
  exercise_name : String;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private form: FormBuilder,
    private viewCtrl: ViewController) {
      
      this.set_form = this.form.group({
        count: ["", Validators.required]
      });
  }

  ionViewWillEnter(){
    this.exercise_name = this.navParams.get("exercise_name");
  }

  close(){
    this.viewCtrl.dismiss();
  }

  submit(){

  }



}
