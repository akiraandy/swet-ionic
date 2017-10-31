import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { FirebaseService } from '../../services/firebase-service';
import { Set } from '../../models/set';
import { UserService } from '../../services/user-service';

@IonicPage()
@Component({
  selector: 'page-reps-create',
  templateUrl: 'reps-create.html',
})
export class RepsCreatePage {

  set = {} as Set;
  sets = [];
  uniform: boolean;
  rep_form: FormGroup;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController,
    private _DB: FirebaseService,
    private loading: LoadingController,
    private form: FormBuilder,
    private user: UserService) {
      this.rep_form = this.form.group({
        count: ["", Validators.required],
        weight: ["", Validators.required],
      });
  }

  ionViewDidLoad() {
    this.getSets();
  }

  getSets() {
    let loader = this.loading.create({
      content: "Fetching data..."
    });

    loader.present().then(() => {
      this._DB.getSets(this.navParams.get("exercise_id"))
      .subscribe(res => {
        this.sets.push(res);
      });
    });
    loader.dismiss();
  }

  close() {
    this.navCtrl.pop();
  }
  
  submit(set){
    this.createRepsForSet(set.weight, set.rep_count);
  }

  createRepsForSet(weight, repCount){
    this.sets.forEach(set => {
      for (let i = 0; i < repCount; i++){
        this._DB.addRepToSet(this.user.id, this.navParams.get("workout_id"), this.navParams.get("exercise_id"), set.id, weight)
        .then(res => {
          console.log("Created rep!");
        }).catch(error => {
          console.log("Something went wrong!");
        });
      }

    });
  }
}
