import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormArray, ReactiveFormsModule, FormsModule } from '@angular/forms';
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

  formErrors = {
    sets: [
      { count: '', weight: ''}
    ]
  };

  validationMessages = {
    sets: {
      count: {
        required: 'Rep count is required.',
        min: 'Rep count must be greater than 0.',
        max: 'Rep count must be less than 100.'
      },
      weight: {
        required: 'Set weight is required.',
        min: 'Weight must be greater than 0.',
        max: 'Weight must less than 1000.',
      }
    }
  };
  

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController,
    private _DB: FirebaseService,
    private loading: LoadingController,
    private form: FormBuilder,
    private user: UserService) {
      this.exercise_form = this.form.group({
        sets: this.form.array([
            this.createSet()
        ])
      });

      this.exercise_form.valueChanges.subscribe(data => this.validateSets());
      
  }

  validateSets(){
    let sets = <FormArray>this.exercise_form.get("sets");

    this.formErrors.sets = [];

    let n = 1;
    while (n <= sets.length) {
      this.formErrors.sets.push({ count: '', weight: ''});

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
    sets.push(this.createSet());
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
        console.log(i);
        console.log(sets.length);
        
        
        sets.removeAt(i);
      }
    }
  }

  createSet(){
    return this.form.group({
      count: ['', Validators.compose([Validators.required, Validators.min(1), Validators.max(100)])],
      weight: ['', Validators.compose([Validators.required, Validators.min(1), Validators.max(1000)])]
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

  submit() {
    console.log(this.exercise_form.value.sets);
     
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
