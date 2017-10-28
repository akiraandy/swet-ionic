import { Component, Pipe, PipeTransform } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, ToastController, FabContainer } from 'ionic-angular';
import { WorkoutCreatePage } from '../workout-create/workout-create';
import { FirebaseService } from '../../services/firebase-service';
import { UserService } from '../../services/user-service';
import { WorkoutShowPage } from '../../pages/workout-show/workout-show';

@IonicPage()
@Component({
  selector: 'page-workout',
  templateUrl: 'workout.html',
})

export class WorkoutPage {
  workouts = [];
  fabOpened : boolean = false;
  constructor(public modalCtrl: ModalController, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    private _DB: FirebaseService,
    public user: UserService,
    public loading: LoadingController,
    public toast: ToastController) {
  }

  addWorkout() {
    console.log("Going to create workout page");
    let modal = this.modalCtrl.create(WorkoutCreatePage);
    modal.onDidDismiss(workout_created => {
      this.resetBlur();
      if (workout_created) {
        this.toast.create({
          message: "Workout created!",
          position: "top",
          duration: 3000
        }).present();
      }
      this.getWorkouts();
    });
    modal.present();
  }

  ionViewDidLoad() {
   this.getWorkouts();
  }

  refresh(refresher){
      this.workouts = [];
      this.getWorkouts();
      refresher.complete();
  }

  getWorkouts(){
    this.workouts = [];
    let loader = this.loading.create({
      content: "Getting workouts..."
    });

    loader.present().then(() => {
      this._DB.getWorkouts(this.user.id)
      .subscribe(res => {
        console.log("SUCESS", res);
        this.workouts.push(res)
      });
    });
    loader.dismiss();
    
  }

  goToWorkoutShowPage(workout){
    if (!this.fabOpened){
      this.navCtrl.push(WorkoutShowPage, {
        id: workout.id
      });
    }
  }

  resetBlur(){
    this.fabOpened = false;
  }

  fabContainerClicked(fab: FabContainer){
    this.fabOpened = !fab._listsActive;
  }

  closeFab(fab: FabContainer){
    fab.close();
  }
}
