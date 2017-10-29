import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { FirebaseService } from '../../services/firebase-service';
import { ExerciseCreatePage } from '../exercise-create/exercise-create';

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
              private modalCtrl: ModalController){
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
      });

    });
    loader.dismiss();
    
  }

  goToExerciseCreatePage(){
    let modal = this.modalCtrl.create(ExerciseCreatePage, {workout_id: this.navParams.get("id")});
    this.addBlur();
    modal.onDidDismiss(res => {
      this.removeBlur();
      this.getWorkout();
    });
    modal.present();
  }

  addBlur(){
    this.applyBlur = true;
  }

  removeBlur(){
    this.applyBlur = false;
  }


  

}
