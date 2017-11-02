import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, ToastController, FabContainer } from 'ionic-angular';
import { FirebaseService } from '../../services/firebase-service';
import { UserService } from '../../services/user-service';


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
    let modal = this.modalCtrl.create("WorkoutCreatePage", {enableBackdropDismiss: true});
    modal.onDidDismiss(workout_created => {
      this.resetBlur();
      if (workout_created) {
        this.getWorkouts();
        this.toast.create({
          message: "Workout created!",
          position: "top",
          duration: 3000
        }).present();
      }
    });
    modal.present();
  }

  ionViewWillEnter() {
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
        console.log("SUCCESS", res);
        this.workouts.push(res)
      });
    });
    loader.dismiss();
    
  }

  goToWorkoutShowPage(workout){
    if (!this.fabOpened){
      this.navCtrl.push("WorkoutShowPage", {
        id: workout.id
      });
    }
  }

  resetBlur(){
    this.fabOpened = false;
  }

  addBlur(){
    this.fabOpened = true;
  }

  fabContainerClicked(fab: FabContainer){
    this.fabOpened = !fab._listsActive;
  }

  closeFab(fab: FabContainer){
    fab.close();
  }
}
