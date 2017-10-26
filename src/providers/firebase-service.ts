import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';

@Injectable()
export class FirebaseService {

    constructor(private db: AngularFirestore) { }
    addUser(user) {
        this.db.collection("users").doc(user.id).set({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            DoB: user.dateOfBirth,
            created_at: this.db.firestore.FieldValue.serverTimestamp(),
            updated_at: this.db.firestore.FieldValue.serverTimestamp()
        }).then(res => {
            console.log("User created with ID: ", res)
        }).catch(error => {
            console.error("Error adding user: ", error);
        });
    }

    addWorkout(workout) {
        this.db.collection("workouts")
    }
}