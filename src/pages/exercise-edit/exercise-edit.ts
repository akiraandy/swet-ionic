import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormArray, ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { FirebaseService } from '../../services/firebase-service';
import { Exercise } from '../../models/exercise';


@IonicPage()
@Component({
  selector: 'page-exercise-edit',
  templateUrl: 'exercise-edit.html',
})
export class ExerciseEditPage {

  exercise_form: FormGroup;
  formErrors = {name: ''};

  validationMessages = {
    name: {
      required: "Exercise must have name",
      minLength: "Name must have at least 1 character",
      maxLength: "Name must not be more than 20 characters",
    }
  };

  exercise = {} as Exercise;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController,
    private form: FormBuilder,
    private _DB: FirebaseService) {
      this.exercise.name = this.navParams.get("exercise_name");
      this.exercise.id = this.navParams.get("exercise_id");
      this.exercise.sets = [];

      this.exercise_form = this.form.group({
        name: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(20)])]
      });
  }
  
  close(name?){
    this.viewCtrl.dismiss(name);
  }

  submit(){
    let name = this.exercise_form.value.name;
    this.updateExerciseName(name);
    this.close(name);
  }

  updateExerciseName(name){
    this._DB.updateExerciseName(this.exercise.id, name)
  }






}
