import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Set } from '../../models/set';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { FirebaseService } from '../../services/firebase-service';
import { UserService } from '../../services/user-service';

@IonicPage()
@Component({
  selector: 'page-set-and-rep-create',
  templateUrl: 'set-and-rep-create.html',
})
export class SetAndRepCreatePage {

  set = {} as Set;
  set_form : FormGroup;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private form: FormBuilder,
    private viewCtrl: ViewController) {
      this.set_form = this.form.group({
        reps: ["", Validators.required]
      });
  }

  close(){
    this.viewCtrl.dismiss();
  }

  submit(){
    
  }



}
