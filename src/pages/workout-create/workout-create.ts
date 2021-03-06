import { Component } from '@angular/core';
import { IonicPage, ViewController, ToastController } from 'ionic-angular';
import { Workout } from '../../models/workout';
import { Validators, FormBuilder, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { FirebaseService } from '../../services/firebase-service';
import { UserService } from '../../services/user-service';
import moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-workout-create',
  templateUrl: 'workout-create.html',
})
export class WorkoutCreatePage {

  private workout_form : FormGroup;
  workout = {} as Workout;
  trans = true;
  dummy_date = moment(new Date).format('dddd MMMM Do');
  constructor(private user: UserService, 
    public viewCtrl: ViewController, 
    private form: FormBuilder, 
    private _DB: FirebaseService,
    public toast: ToastController) 
    {
      this.workout.title = `${this.dummy_date} Workout`;
    this.workout_form = this.form.group({
      title: ["", [Validators.compose([Validators.maxLength(30), Validators.required])]]
    });
  }

  ionViewDidEnter(){
  }
  
  close(workout?) {
    this.viewCtrl.dismiss(workout);
  }

  submit(workout) {
    this._DB.addWorkout(workout, this.user.id)
    .then(res => {
      this.close(res);
    })
    .catch(error => {
      this.toast.create({
        message: "Couldn't save your workout...",
        position: "bottom",
        duration: 3000
      }).present();
    });
  }
}
