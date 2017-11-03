import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, ToastController, FabContainer } from 'ionic-angular';
import { FirebaseService } from '../../services/firebase-service';
import { UserService } from '../../services/user-service';
import { Observable } from 'rxjs/Observable';
import { Workout } from '../../models/workout';

@IonicPage()
@Component({
  selector: 'page-workout',
  templateUrl: 'workout.html',
})

export class WorkoutPage {
  workouts : Promise<Workout[]>;

  fabOpened: boolean = false;
  constructor(public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private _DB: FirebaseService,
    public user: UserService,
    public loading: LoadingController,
    public toast: ToastController) {
      this.workouts = this.getWorkouts();
  }

  addWorkout() {
    let modal = this.modalCtrl.create("WorkoutCreatePage", { enableBackdropDismiss: true });
    modal.onDidDismiss(workout_created => {
      this.resetBlur();
      if (workout_created) {
        this.workouts = this.getWorkouts();
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
    this.workouts = this.getWorkouts();
    refresher.complete();
  }

  getWorkouts() {
    return this._DB.getWorkouts(this.user.id);
  }

  goToWorkoutShowPage(workout) {
    if (!this.fabOpened) {
      this.navCtrl.push("WorkoutShowPage", {
        id: workout.id
      });
    }
  }

  resetBlur() {
    this.fabOpened = false;
  }

  addBlur() {
    this.fabOpened = true;
  }

  fabContainerClicked(fab: FabContainer) {
    this.fabOpened = !fab._listsActive;
  }

  closeFab(fab: FabContainer) {
    fab.close();
  }
}
