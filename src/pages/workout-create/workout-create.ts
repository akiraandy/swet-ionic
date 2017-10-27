import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Workout } from '../../models/workout';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-workout-create',
  templateUrl: 'workout-create.html',
})
export class WorkoutCreatePage {

  private workout_form : FormGroup;
  workout = Workout;

  constructor(public viewCtrl: ViewController, private form: FormBuilder) {
    this.workout_form = this.form.group({
      title: ["", Validators.compose([Validators.maxLength(30), Validators.required])],
      date: ["", Validators.required]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WorkoutCreatePage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  submit() {

  }

  

}
