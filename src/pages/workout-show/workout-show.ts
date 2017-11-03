import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, AlertController } from 'ionic-angular';
import { FirebaseService } from '../../services/firebase-service';
import { UserService } from '../../services/user-service';
import { Workout } from '../../models/workout'
import { Observable } from 'rxjs/Observable';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-workout-show',
  templateUrl: 'workout-show.html',
})
export class WorkoutShowPage {
  workout: Promise<Workout>
  exercises = [];
  applyBlur = false;
  from_now : string;
  workout_id: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private _DB: FirebaseService,
              public loading: LoadingController,
              private modalCtrl: ModalController,
              private user: UserService,
              public alertCtrl: AlertController){
                this.workout_id = this.navParams.get("id");
  }

  ionViewWillEnter(){
    this.getWorkout();
  }

  getWorkout(){
    let loader = this.loading.create({
      content: "Fetching data..."
    });

    loader.present().then(() => {
      this.workout = this._DB.getFullWorkout(this.workout_id)
      .then(workout => {
        loader.dismiss();
        return workout;
      });
    });
  }

  goToExerciseCreatePage(){
    let modal = this.modalCtrl.create("ExerciseCreatePage", {workout_id: this.navParams.get("id")});
    this.addBlur();
    modal.onDidDismiss(exercise => {
      this.removeBlur();
      if (exercise){
        this.getWorkout();
      }
    });
    modal.present();
  }

  addBlur(){
    this.applyBlur = true;
  }

  removeBlur(){
    this.applyBlur = false;
  }

  goToRepCreatePage(exercise) {
    this.navCtrl.push("RepsCreatePage", {exercise_id: exercise.id, exercise_name: exercise.name, workout_id: this.workout_id});
  }

  navigateToExercise(exercise){
    this.navCtrl.push("ExerciseShowPage", {exercise_id: exercise.id, exercise_name: exercise.name, workout_id: this.workout_id});
  }

  deleteWorkout(){
    let loader = this.loading.create({
      content: "Deleting workout..."
    });
    loader.present()
    .then(() => {
      this._DB.deleteAllDependentOnWorkout(this.workout_id)
      .then(() => {
        this._DB.deleteWorkout(this.workout_id)
        .then(() => {
          loader.dismiss();
          this.navCtrl.pop();
        });
      });
    });
  }

  showDeletePrompt() {
    let prompt = this.alertCtrl.create({
      title: "Delete workout",
      message: "Are you sure you want to delete this workout?",
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log("Cancel clicked");
          }
        },
        {
          text: 'Delete',
          handler: data => {
            this.deleteWorkout();
          }
        }
      ]
    });
    prompt.present();
  }

}
