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

  ionViewDidLoad() {
    this.getWorkout()
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
        console.log(this.workout);
      });

      this._DB.getExercisesFromWorkout(this.navParams.get("id"))
      .subscribe(exercise => {
        this.exercises.push(exercise);
        this.getSetCount(exercise);
        this.getRepCount(exercise);
        console.log(this.exercises);
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

  goToSetCreatePage(exercise){
    let modal = this.modalCtrl.create("SetCreatePage", {workout_id: this.navParams.get("id"), exercise_name: exercise.name});
    this.addBlur();
    modal.onDidDismiss(res => {
      this.removeBlur();
      this.getWorkout();
    });
    modal.present();
  }

  createSet(exercise){
    console.log(exercise);
    
    this._DB.addSet(this.user.id, this.navParams.get("id"), exercise.id)
    .subscribe(res => {
      console.log("Successfully created set");
    });
    this.updateSetCount(exercise);
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

  updateSetCount(exercise) {
    this._DB.getSetCount(exercise.id)
    .subscribe(setCount => exercise["setCount"] = setCount);
  }

  goToRepCreatePage(exercise) {
    let modal = this.modalCtrl.create("RepsCreatePage", {exercise_id: exercise.id, exercise_name: exercise.name, workout_id: this.navParams.get("id")});
    modal.onDidDismiss( () => {
      this.removeBlur();
    });
    this.addBlur();
    modal.present();
  }
}
