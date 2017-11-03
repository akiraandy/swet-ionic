import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormArray, ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
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
  exercise_form: FormGroup;
  workout_id: string;
  exercise_id: string;

  formErrors = {
    sets: [
      { repCount: '', weight: '', setCount: ''}
    ]
  };

  validationMessages = {
    sets: {
      repCount: {
        required: 'Rep repCount is required',
        min: 'Rep repCount must be greater than 0',
        max: 'Rep repCount must be less than 100'
      },
      weight: {
        required: 'Set weight is required',
        min: 'Weight must be greater than 0',
        max: 'Weight must less than 1000',
      },
      setCount: {
        required: 'Set count is required',
        min: 'Set count must be greater than 0',
        max: 'Set count must be less than 50'
      }
    }
  };
  

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController,
    private _DB: FirebaseService,
    private loading: LoadingController,
    private form: FormBuilder,
    private user: UserService,
    private toast: ToastController) {

      this.workout_id = this.navParams.get("workout_id");
      this.exercise_id = this.navParams.get("exercise_id");

      this.exercise_form = this.form.group({
        sets: this.form.array([
            this.setControls()
        ])
      });

      this.exercise_form.disable

      this.exercise_form.valueChanges.subscribe(data => this.validateSets());
  }

  checkboxClicked(){
    this.exercise_form.reset();
    this.toggleSetCountValidator();
  }

  toggleSetCountValidator(){
    let sets = this.getSetFormArray();
    let set = <FormGroup>sets.at(0);
    let setCountControl = <FormControl>set.get("setCount");
    if (this.uniform){
      setCountControl.enable();
      setCountControl.updateValueAndValidity();
    } else {
        setCountControl.disable();
        setCountControl.updateValueAndValidity();
    }
  }

  validateSets(){
    let sets = <FormArray>this.exercise_form.get("sets");

    this.formErrors.sets = [];

    let n = 1;
    while (n <= sets.length) {
      this.formErrors.sets.push({ repCount: '', weight: '', setCount: ''});

      let set = <FormGroup>sets.at(n - 1);

      for (let field in set.controls) {
        let input = set.get(field);

        if (input.invalid && input.dirty) {
          for (let error in input.errors) {
            this.formErrors.sets[n - 1][field] = this.validationMessages.sets[field][error];
          }
        }
      }
      n++;
    }
  }

  addSet(){
    let sets = this.getSetFormArray();
    sets.push(this.setControls());
  }

  getSetFormArray() {
    return <FormArray>this.exercise_form.get('sets');
  }

  removeSet(i){
    let sets = this.getSetFormArray();
    sets.removeAt(i);
  }

  removeAllSets(){
    let sets = this.getSetFormArray();
    if (this.uniform && sets.length > 0){
      for (let i = sets.length - 1; i > 0 ; i--) {
        sets.removeAt(i);
      }
    }
  }

  setControls(){
    return this.form.group({
      repCount: ['', Validators.compose([Validators.required, Validators.min(1), Validators.max(100)])],
      weight: ['', Validators.compose([Validators.required, Validators.min(1), Validators.max(1000)])],
      setCount: [{value: '', disabled: true}, Validators.compose([Validators.required, Validators.min(1), Validators.max(25)])],
    });
  }

  ionViewDidLoad() {
    this.getSets();
  }

  getSets() {
    // let loader = this.loading.create({
    //   content: "Fetching data..."
    // });

    // loader.present().then(() => {
    //   this._DB.getSets(this.navParams.get("exercise_id"))
    //   .subscribe(res => {
    //     this.sets.push(res);
    //   });
    // });
    // loader.dismiss();
  }

  close() {
    this.navCtrl.pop();
  }

  exitAfterLoading(){
    let loader = this.loading.create({
      content: "Uploading..."
    });

    loader.present();

    setTimeout(() => {
      loader.dismiss();
      this.close();
    }, 4000);
  }

  condensedSet(condensedSet){
    let set = {count: 0, reps: 0, weight: 0};
    set.count = parseInt(condensedSet.setCount, 10);
    set.reps = parseInt(condensedSet.repCount, 10);
    set.weight = parseInt(condensedSet.weight, 10);
    return set;
  }

  submit() {
    if (this.exercise_form.value.sets[0].setCount) {
      let set = this.condensedSet(this.exercise_form.value.sets[0]);
      for (let i = 0; i < set.count; i++) {
        this.createSetWithReps(set.reps, set.weight);
      };
    } else {
      this.exercise_form.value.sets.forEach(set => {
        this.createSetWithReps(parseInt(set.repCount, 10), parseInt(set.weight, 10));
      })
    }
    this.exitAfterLoading();
  }

  createSetWithReps(repCount, weight){
    this._DB.addSet(this.user.id, this.workout_id, this.exercise_id, weight)
    .subscribe(set_id => {
      for (let i = 0; i < repCount; i++) {
        this._DB.addRepToSet(this.user.id, this.workout_id, this.exercise_id, set_id, weight);
      }
    }, error => this.createToast());
  }

  createToast(){
    this.toast.create({
      message: "An error occurred.",
      duration: 3000
    }).present();
  }
}
