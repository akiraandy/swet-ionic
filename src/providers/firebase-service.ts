import {AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';

@Injectable()
export class FirebaseService {

    constructor(public afd: AngularFireDatabase) { }

    getWorkouts() {
        return this.afd.list('/workouts/');
    }

    addWorkout(name) {
        this.afd.list('/workouts/').push(name);
    }

    removeWorkout(id) {
        this.afd.list('/workouts/').remove(id);
    }
}