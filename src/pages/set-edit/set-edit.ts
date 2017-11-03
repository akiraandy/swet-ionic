import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Set } from '../../models/set';
import { Validators, FormBuilder, FormGroup, FormArray, ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { FirebaseService } from '../../services/firebase-service'; 
import { UserService } from '../../services/user-service';

@IonicPage()
@Component({
  selector: 'page-set-edit',
  templateUrl: 'set-edit.html',
})
export class SetEditPage {

  set = {} as Set;
  set_form : FormGroup;
  workout_id : string;
  exercise_id : string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController,
    private form: FormBuilder,
    private _DB: FirebaseService,
    private user: UserService) {
    this.set.id = this.navParams.get("set_id");
    this.set.reps = this.navParams.get("reps");
    this.set.weight = this.navParams.get("weight");
    this.workout_id = this.navParams.get("workout_id");
    this.exercise_id = this.navParams.get("exercise_id");

    this.set_form = this.form.group({
      repCount: ['', Validators.compose([Validators.required, Validators.min(1), Validators.max(100)])],
      weight: ['', Validators.compose([Validators.required, Validators.min(1), Validators.max(1000)])]
    });

  }

  close(){
    this.viewCtrl.dismiss();
  }

  submit(){
    let repCount = this.set_form.value.repCount;
    let weight = this.set_form.value.weight;
    this.updateSet(repCount, weight);
  }

  updateSet(repCount, weight){
    let args = {};
    args["user_id"] = this.user.id;
    args["workout_id"] = this.workout_id;
    args["exercise_id"] = this.exercise_id;
    args["weight"] = weight;
    this._DB.adjustRepCount(this.set.id, this.set_form.value.repCount, args)
    .then(() => {
      this._DB.updateSetWithReps(this.set.id, repCount, weight);
    });
    
  }
}
