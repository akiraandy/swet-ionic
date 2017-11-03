import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, AlertController } from 'ionic-angular';
import { FirebaseService } from '../../services/firebase-service';
import { UserService } from '../../services/user-service';
import { Workout } from '../../models/workout'
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-workout-show',
  templateUrl: 'workout-show.html',
})
export class WorkoutShowPage {
  workout = {} as Workout;
  exercises = [];
  applyBlur = false;
  workout_id : string;
  workout_title :string
  from_now : string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private _DB: FirebaseService,
              public loading: LoadingController,
              private modalCtrl: ModalController,
              private user: UserService,
              public alertCtrl: AlertController){
                this.workout.title = "";
                this.workout.date = "";
                this.workout.id = this.navParams.get("id");
                this.from_now = "";

  }

  printId(){
    console.log(this.user.id);
    
  }

  ionViewWillEnter(){
    this.getWorkout();
  }

  clearData(){
    this.workout = {id: "", title: "", date: "", exercises: []};
    this.exercises = [];
  }

  formatDate(){
    this.from_now = moment(this.workout.date).fromNow();
    this.workout.date = moment(this.workout.date).format('MMMM Do YYYY');
  }

  getWorkout(){
    this.clearData();
    let loader = this.loading.create({
      content: "Fetching data..."
    });

    loader.present().then(() => {
      this._DB.getWorkout(this.navParams.get("id"))
      .subscribe(workout => {
        this.workout = <Workout>workout;
        this.formatDate();
      });

      this._DB.getExercisesFromWorkout(this.navParams.get("id"))
      .subscribe(exercise => {
        this.exercises.push(exercise);
        this.getSetCount(exercise);
        this.getRepCount(exercise);
      });
    });
    loader.dismiss();
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

  getSetCount(exercise){
    let sets = [];
    exercise["sets"] = [];
    this._DB.getSets(exercise.id)
    .subscribe(set => exercise.sets.push(set),
    error => console.log(error),
    () => exercise["setCount"] = exercise.sets.length);
  }

  getRepCount(exercise){
    exercise["repCount"] = Number;
    this._DB.getRepCountForExercise(exercise.id)
    .subscribe(res => {
      exercise["repCount"] = res;
    });
  }

  goToRepCreatePage(exercise) {
    this.navCtrl.push("RepsCreatePage", {exercise_id: exercise.id, exercise_name: exercise.name, workout_id: this.workout.id});
  }

  navigateToExercise(exercise){
    this.navCtrl.push("ExerciseShowPage", {exercise_id: exercise.id, exercise_name: exercise.name, workout_id: this.workout.id});
  }

  deleteWorkout(){
    let loader = this.loading.create({
      content: "Deleting workout..."
    });
    loader.present()
    .then(() => {
      this._DB.deleteAllDependentOnWorkout(this.workout.id)
      .then(() => {
        this._DB.deleteWorkout(this.workout.id)
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
