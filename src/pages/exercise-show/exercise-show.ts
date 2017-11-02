import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Exercise } from '../../models/exercise';
import { FirebaseService } from '../../services/firebase-service';


@IonicPage()
@Component({
  selector: 'page-exercise-show',
  templateUrl: 'exercise-show.html',
})
export class ExerciseShowPage {

  exercise = {} as Exercise;
  edit = false;
  workout_id : string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private _DB: FirebaseService,
    private modalCtrl: ModalController) {
    this.exercise.name = this.navParams.get("exercise_name");
    this.exercise.id = this.navParams.get("exercise_id");
    this.workout_id = this.navParams.get("workout_id");
    this.exercise.sets = [];
  }

  ionViewDidLoad() {
    this.getSetsWithReps();
  }

  leave(){
    this.navCtrl.pop();
  }

  clearSets() {
    this.exercise.sets = [];
  }
  
  getSetsWithReps(){
    this.clearSets();
    this._DB.getSetsWithReps(this.exercise.id)
    .subscribe(set => {
      this.exercise.sets.push(set);
      console.log(this.exercise.sets);
    });
  }

  navigateToExerciseEditPage(){
    let modal = this.modalCtrl.create("ExerciseEditPage", {exercise_id: this.exercise.id, exercise_name: this.exercise.name},{enableBackdropDismiss: true});
    modal.onWillDismiss(nameChanged => {
      if (nameChanged) {
        this.exercise.name = nameChanged;
      }
    });
    modal.present();
  }

  navigateToSetEditPage(set){
    let modal = this.modalCtrl.create("SetEditPage", {set_id: set.id, reps: set.reps, weight: set.weight, workout_id: this.workout_id, exercise_id: this.exercise.id});
    modal.present();
  }

  deleteSet(set){
    this._DB.deleteRepsFromSet(set.id)
    .then(() => {
      this._DB.deleteSet(set.id)
      .then(() => {
        this.getSetsWithReps();
      });
    })
  }

  deleteExercise() {
    this._DB.deleteAllDependentOnExercise(this.exercise.id)
    .then(() => {
      this._DB.deleteExercise(this.exercise.id)
      .then(() => {
        this.leave();
      });
    });
  }

}
