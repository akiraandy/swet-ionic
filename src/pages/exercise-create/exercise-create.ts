import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { UserService } from '../../services/user-service';
import { Exercise } from '../../models/exercise';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { FirebaseService } from '../../services/firebase-service';

@IonicPage()
@Component({
  selector: 'page-exercise-create',
  templateUrl: 'exercise-create.html',
})
export class ExerciseCreatePage {
  private exercise_form : FormGroup;
  exercise = {} as Exercise;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public user: UserService, 
    public viewCtrl: ViewController,
    private form: FormBuilder,
    private _DB: FirebaseService) {
      this.exercise_form = this.form.group({
        name: ["", Validators.compose([Validators.maxLength(15), Validators.required])],
      });
    
  }

  ionViewDidLoad() {
    
  }

  createExercise(exercise){
    let user_id = this.user.id;
    let workout_id = this.navParams.get("workout_id");
    this._DB.addExercise(exercise, workout_id, user_id)
    .subscribe(exercise => {
      this.close(exercise);
    });
  }

  close(exercise?) {
    this.viewCtrl.dismiss(exercise);
  }

  



}
