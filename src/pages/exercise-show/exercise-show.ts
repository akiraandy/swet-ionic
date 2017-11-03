import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { Exercise } from '../../models/exercise';
import { FirebaseService } from '../../services/firebase-service';


@IonicPage()
@Component({
  selector: 'page-exercise-show',
  templateUrl: 'exercise-show.html',
})
export class ExerciseShowPage {

  exercise : Promise<Exercise>;
  edit = false;
  workout_id : string;
  exercise_id: string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private _DB: FirebaseService,
    private modalCtrl: ModalController,
    private loading: LoadingController,
    private alertCtrl: AlertController) {
      this.exercise_id = this.navParams.get("exercise_id");
      
  }

  ionViewWillEnter() {
    this.getExercise();
  }

  leave(){
    this.navCtrl.pop();
  }
  
  getExercise(){
    this.exercise = this._DB.getFullExercise(this.exercise_id);
  }

  navigateToExerciseEditPage(){
    this.exercise.then(exercise => {
      let modal = this.modalCtrl.create("ExerciseEditPage", {exercise_id: exercise.id, exercise_name: exercise.name},{enableBackdropDismiss: true});
      modal.present();
    })

  }

  navigateToSetEditPage(set){
    this.exercise.then(exercise => {
      let modal = this.modalCtrl.create("SetEditPage", {set_id: set.id, reps: set.reps, weight: set.weight, workout_id: exercise.workout_id, exercise_id: exercise.id});
      modal.onDidDismiss(() =>{
        this.getExercise();
      });
      modal.present();
    });
  }

  deleteSet(set){
    this._DB.deleteRepsFromSet(set.id)
    .then(() => {
      this._DB.deleteSet(set.id)
      .then(() => {
        this.exercise = this._DB.getFullExercise(this.exercise_id);
      });
    })
  }

  deleteExercise() {
    let loader = this.loading.create({
      content: "Deleting data..."
    });
    loader.present()
    .then(() => {
      this._DB.deleteAllDependentOnExercise(this.exercise_id)
      .then(() => {
        this._DB.deleteExercise(this.exercise_id)
        .then(() => {
          loader.dismiss();
          this.leave();
        });
      });
    });
  }

  showDeletePrompt() {
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
            this.deleteExercise();
          }
        }
      ]
    });
    prompt.present();
  }

}
