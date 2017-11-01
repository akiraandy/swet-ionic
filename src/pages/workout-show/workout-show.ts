import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { FirebaseService } from '../../services/firebase-service';
import { UserService } from '../../services/user-service';

@IonicPage()
@Component({
  selector: 'page-workout-show',
  templateUrl: 'workout-show.html',
})
export class WorkoutShowPage {
  workout = {};
  exercises = [];
  applyBlur = false;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private _DB: FirebaseService,
              public loading: LoadingController,
              private modalCtrl: ModalController,
              private user: UserService){
                this.workout["title"] = "";
                this.workout["date"] ="";
  }

  ionViewWillEnter(){
    this.getWorkout();
  }

  clearData(){
    this.workout = {};
    this.exercises = [];
  }

  getWorkout(){
    this.clearData();
    let loader = this.loading.create({
      content: "Fetching data..."
    });

    loader.present().then(() => {
      this._DB.getWorkout(this.navParams.get("id"))
      .subscribe(workout => {
        this.workout = workout;
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
    this.navCtrl.push("RepsCreatePage", {exercise_id: exercise.id, exercise_name: exercise.name, workout_id: this.navParams.get("id")});
  }

  navigateToExercise(exercise){
    this.navCtrl.push("ExerciseShowPage", {exercise_id: exercise.id, exercise_name: exercise.name});
  }
}
