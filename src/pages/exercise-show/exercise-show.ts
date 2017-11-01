import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormArray, ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { Set } from '../../models/set';
import { Exercise } from '../../models/exercise';
import { FirebaseService } from '../../services/firebase-service';


@IonicPage()
@Component({
  selector: 'page-exercise-show',
  templateUrl: 'exercise-show.html',
})
export class ExerciseShowPage {

  exercise = {} as Exercise;
  set_form : FormGroup;
  edit = false;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private _DB: FirebaseService,
    private form: FormBuilder) {


    
    this.exercise.name = this.navParams.get("exercise_name");
    this.exercise.id = this.navParams.get("exercise_id");
    this.exercise.sets = [];
  }

  ionViewDidLoad() {
    this.getSetsWithReps();
  }

  leave(){
    this.navCtrl.pop();
  }
  
  getSetsWithReps(){
    this._DB.getSetsWithReps(this.exercise.id)
    .subscribe(set => {
      this.exercise.sets.push(set);
      console.log(this.exercise.sets);
    });
  }
}
