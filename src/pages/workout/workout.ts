import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { WorkoutCreatePage } from '../workout-create/workout-create';
@IonicPage()
@Component({
  selector: 'page-workout',
  templateUrl: 'workout.html',
})
export class WorkoutPage {

  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams) {
  }

  addWorkout() {
    let modal = this.modalCtrl.create(WorkoutCreatePage);
    modal.present();
  }

}
