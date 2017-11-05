import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, ToastController, FabContainer } from 'ionic-angular';
import { FirebaseService } from '../../services/firebase-service';
import { UserService } from '../../services/user-service';
import { Observable } from 'rxjs/Observable';
import { Workout } from '../../models/workout';
import 'rxjs/add/operator/map';

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
    public toast: ToastController) {
      this.getWorkouts();
  }

  ionViewWillEnter(){
  }

  getWorkouts(){
    this._DB.getFullWorkouts(this.user.id)
    .subscribe(data => {
      this.workoutList = <any[]>data;
    });
  }


  toggleSection(i) {
    this.workoutList[i].open = !this.workoutList[i].open;
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
      this.resetBlur();
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
