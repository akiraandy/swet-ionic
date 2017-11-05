import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, ToastController, AlertController} from 'ionic-angular';
import { FirebaseService } from '../../services/firebase-service';
import { UserService } from '../../services/user-service';
import { Observable } from 'rxjs/Observable';
import { Workout } from '../../models/workout';
import 'rxjs/add/operator/map';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-workout',
  templateUrl: 'workout.html',
})

export class WorkoutPage {
  workouts : Observable<Workout[]>;
  workoutList: any[];

  fabOpened: boolean = false;
  constructor(public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private _DB: FirebaseService,
    public user: UserService,
    public loading: LoadingController,
    public toast: ToastController,
    public alertCtrl: AlertController) {
      this.getWorkouts();
  }

  navigateToExerciseCreatePage(workout){
    let modal = this.modalCtrl.create("ExerciseCreatePage", {workout_id: workout.id});

    modal.onDidDismiss(exercise => {
      if (exercise){
        this.getWorkouts();
      }
    });
    modal.present();
  }

  navigateToExerciseEditPage(exercise){
      let modal = this.modalCtrl.create("ExerciseEditPage", {exercise_id: exercise.id, exercise_name: exercise.name},{enableBackdropDismiss: true});
      modal.present();
  }

  deleteWorkout(workout){
    let loader = this.loading.create({
      content: "Deleting workout..."
    });
    loader.present()
    .then(() => {
      this._DB.deleteAllDependentOnWorkout(workout.id)
      .then(() => {
        this._DB.deleteWorkout(workout.id)
        .then(() => {
          loader.dismiss();
          this.getWorkouts();
        });
      });
    });
  }

  showDeletePromptForWorkout(workout) {
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
            this.deleteWorkout(workout);
          }
        }
      ]
    });
    prompt.present();
  }

  deleteExercise(exercise) {
    let loader = this.loading.create({
      content: "Deleting data..."
    });
    loader.present()
    .then(() => {
      this._DB.deleteSetsFromExercise(exercise.id)
      .then(() => {
        this._DB.deleteExercise(exercise.id)
        .then(() => {
          loader.dismiss();
          this.getWorkouts();
        });
      });
    });
  }

  showDeletePromptForExercise(exercise) {
    let prompt = this.alertCtrl.create({
      title: "Delete exercise",
      message: "Are you sure you want to delete this exercise?",
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
            this.deleteExercise(exercise);
          }
        }
      ]
    });
    prompt.present();
  }

  goToRepCreatePage(workout, exercise) {
    this.navCtrl.push("RepsCreatePage", {exercise_id: exercise.id, exercise_name: exercise.name, workout_id: workout.id});
  }

  getWorkouts(){
    let loader = this.loading.create({
      content: "Fetching data..."
    });

    loader.present();
    this._DB.getFullWorkouts(this.user.id)
    .subscribe(
      data => {this.workoutList = <any[]>data, this.assignTodaysWorkout();},
      error => {console.log("Error: ", error), loader.dismiss()},
      () => loader.dismiss()
    );
  }

  assignTodaysWorkout(){
    let date = new Date;
    let startOfDay = parseInt(moment(date.toISOString()).startOf('day').format("X"));
    let endOfDay = parseInt(moment(date.toISOString()).endOf('day').format("X"));
    this.workoutList.forEach(workout => {
      if (workout.created_at_unix > startOfDay && workout.created_at_unix < endOfDay){
        workout.todays = true;
      } else {
        workout.todays = false;
      }
    })
  }

  navigateToSetEditPage(workout, exercise, set){
    let modal = this.modalCtrl.create("SetEditPage", {set_id: set.id, rep_count: set.rep_count, weight: set.weight, workout_id: workout.id, exercise_id: exercise.id});
    modal.onDidDismiss(edit =>{
      if (edit) {
        this.getWorkouts();
      }
    });
    modal.present();
  }

  deleteSet(set){
    this._DB.deleteSet(set.id)
      .then(() => {
        this.getWorkouts();
    });
  }

  toggleSection(i) {
    this.workoutList[i].open = !this.workoutList[i].open;
    this.assignTodaysWorkout();
    for (let j = 0; j < this.workoutList.length; j++){
      if (j != i && this.workoutList[j].open) {
        this.workoutList[j].open = !this.workoutList[j].open;
      }
    }
  }
 
  toggleItem(i, j) {
    this.workoutList[i].exercises[j].open = !this.workoutList[i].exercises[j].open;
  }

  addWorkout() {
    let modal = this.modalCtrl.create("WorkoutCreatePage", { enableBackdropDismiss: true });
    modal.onDidDismiss(workout_created => {
      if (workout_created) {
        this.getWorkouts();
        this.toast.create({
          message: "Workout created!",
          position: "middle",
          duration: 3000
        }).present();
      }
    });
    modal.present();
  }

  refresh(refresher) {
    this.getWorkouts();
    refresher.complete();
  }
}
