import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import firebase from 'firebase';
import 'firebase/firestore';
import { Observable } from 'rxjs/Observable';
import moment from 'moment';

@Injectable()
export class FirebaseService {

    private _DB : any;

    constructor() { 
        this._DB = firebase.firestore();
    }

    getWorkout(workout_id) {
        return new Observable((observer) => {
            this._DB
            .collection("workouts").doc(workout_id)
            .get()
            .then(doc => {
                if (doc.exists){
                    let workout = {};
                    workout["id"] = doc.id;
                    workout["title"] = doc.data().title
                    workout["date"] = moment(doc.data().date).format('YYYY M D');
                    observer.next(workout);
                } else {
                    console.log("Doc does not exist!");
                }
                
                observer.complete();
            }).catch(error => {
                observer.error(error);
                console.log("Error occurred while fetching workout: ", error);
            });
        })
    }

    getWorkouts(user_id) {
        return new Observable((observer) => {
            this._DB
            .collection("workouts").where("user_id", "==", user_id)
            .orderBy("created_at")
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(workoutData => {
                    let workout = {};
                    workout["id"] = workoutData.id;
                    workout["title"] = workoutData.data().title
                    workout["date"] = moment(workoutData.data().created_at).fromNow();
                    observer.next(workout);
                });
                observer.complete();
            }).catch(error => {
                observer.error(error);
                console.log("Error getting workouts!", error);
            });
        });
    }
    

    getExercisesFromWorkout(workout_id) {
        return new Observable((observer) => {
            this._DB
            .collection("exercises").where("workout_id", "==", workout_id)
            .orderBy("created_at")
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(exerciseData => {
                    let exercise = {};
                    exercise["id"] = exerciseData.id;
                    exercise["name"] = exerciseData.data().name;
                    observer.next(exercise);
                });
                observer.complete();
            }).catch(error => {
                observer.error(error);
                console.log("Error getting exercise!", error);
            });
        });
    }

    getUser(userID : string) : Promise<any>
    {
        return new Promise((resolve, reject) => 
        {
            this._DB.collection("users").doc(userID)
            .get()
            .then((doc) =>
            {
                let user : any = {};
                user["id"] = doc.id,
                user["first"] = doc.data().firstName,
                user["last"] = doc.data().lastName,
                user["email"] = doc.data().email,
                user["DoB"] = doc.data().DoB
                resolve(user);
            })
            .catch(error => 
            {
                reject(error);
            });
        });
    }

    addUser(user) {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        this._DB.collection("users").doc(user.id).set({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            DoB: user.dateOfBirth,
            created_at: timestamp,
            updated_at: timestamp
        }).then(res => {
            console.log("User created with ID:", res);
        }).catch(error => {
            console.error("Error adding user: ", error);
        });
    }

    addWorkout(workout, user_id) {
        return new Promise ((resolve, reject) => {
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            this._DB.collection("workouts").add({
                user_id: user_id,
                title: workout.title,
                created_at: timestamp,
                updated_at: timestamp
            }).then(res => {
                console.log("Workout successfully created!", res);
                resolve(res);
            }).catch(error => {
                console.log("Save unsuccessful: ", error);
                reject(error);
            });
        });
    }

    addExercise(exercise, workout_id, user_id) {
        return new Observable ((observer) => {
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            this._DB.collection("exercises").add({
                user_id: user_id,
                workout_id: workout_id,
                name: exercise.name,
                created_at: timestamp,
                updated_at: timestamp
            }).then(res => {
                console.log("Exercise successfully created!", res);
                observer.next(res);
                observer.complete();
            }).catch(error => {
                console.log("Error committing to database: ", error);
                observer.error(error);
            });
        });
    }

    addSet(user_id, workout_id, exercise_id, weight){
        return new Observable ((observer) => {
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            this._DB.collection("sets").add({
                weight: weight,
                user_id: user_id,
                workout_id: workout_id,
                exercise_id: exercise_id,
                created_at: timestamp,
                updated_at: timestamp
            }).then(res => {
                console.log("Set successfully created!", res);
                observer.next(res.id);
                observer.complete();
            }).catch(error => {
                console.log("Error committing to database: ", error);
                observer.error(error);
            });
        })
    }

    getSets(exercise_id){
        return new Observable ((observer) => {
            this._DB.collection("sets")
            .where("exercise_id", "==", exercise_id)
            .get()
            .then((querySnapshot) => {
                querySnapshot.docs.forEach(set => {
                    observer.next({id: set.id});
                });
                observer.complete();
            }).catch(error => {
                observer.error(error);
                console.log(error);
            });
        }); 
    }

    getSetCount(exercise_id) {
        return new Observable ((observer) => {
            this._DB.collection("sets")
            .where("exercise_id", "==", exercise_id)
            .get()
            .then(querySnapshot => {
                observer.next(querySnapshot.docs.length);
                observer.complete();
            }).catch(error => {
                console.log(error);
            });
        });
    }

    addRepToSet(user_id, workout_id, exercise_id, set_id, weight) {
        return new Promise((resolve, reject) => {
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            this._DB.collection("reps").add({
                user_id: user_id,
                workout_id: workout_id,
                exercise_id: exercise_id,
                set_id: set_id,
                weight: weight,
                created_at: timestamp,
                updated_at: timestamp
            }).then(res => {
                console.log('Successfully added rep', res);  
                resolve(res);
            }).catch(error => {
                console.log("Error when committing to database: ", error);
                reject(error);
            });
        });
    }

    getReps(set) {
        return new Observable(observer => {
            this._DB.collection("reps")
            .where("set_id", "==", set.id)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(repData => {
                    let rep = {};
                    rep["id"] = repData.id;
                    rep["weight"] = repData.data().weight;
                    observer.next(rep);
                })
            }).catch(error => {
                console.log("error occurred", error);
                observer.error(error);
            });
        });
    }

    getSetsWithReps(exercise_id){
        return new Observable ((observer) => {
            this._DB.collection("sets")
            .where("exercise_id", "==", exercise_id)
            .orderBy("created_at")
            .get()
            .then((querySnapshot) => {
                querySnapshot.docs.forEach(setData => {
                    let set = {id: "", reps: [], weight: ""};
                    set["id"] = setData.id;
                    set["weight"] = setData.data().weight;
                    set["reps"] = [];
                    this.getReps(setData).subscribe(rep => {
                        set.reps.push(rep);
                        });
                    observer.next(set);
                    });
            }).catch(error => {
                observer.error(error);
                console.log(error);
            });
        }); 
    }

    getRepCountForExercise(exercise_id) {
        return new Observable ((observer) => {
            this._DB.collection("reps")
            .where("exercise_id", "==", exercise_id)
            .get()
            .then((querySnapshot) => {
               observer.next(querySnapshot.size);
               observer.complete();
            }).catch(error => {
                observer.error(error);
            });
        });
    }

    updateExerciseName(exercise_id, newName){
        this._DB.collection("exercises")
        .doc(exercise_id)
        .update({
            name: newName
        })
        .then(res => {
            console.log("Exercise name changed!", res);
        })
        .catch(error => {
            console.log("Error occured when updating name: ", error);
        });
    }

    updateSetWithReps(set_id, rep_count, newWeight){
        this._DB.collection("sets")
        .doc(set_id)
        .update({
            weight: newWeight
        })
        .then(() => {
            this._DB.collection("reps")
            .where("set_id", "==", set_id)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach(rep => {
                    rep.ref.update({
                        weight: newWeight
                    });
                    console.log("Successfully updated!");
                });
            })
            .catch(error => {
                console.log("Something went wrong!");
            });
        }).catch(error => {
            console.log("Error updating set", error);
        });
    }

    adjustRepCount(set_id, rep_count, args) {
        return new Promise ((resolve, reject) => {
            this._DB.collection("reps")
            .where("set_id", "==", set_id)
            .get()
            .then(reps => {
                if (rep_count > reps.size) {
                    let numofRepsToCreate = rep_count - reps.size;
                    for (let i = 0; i < numofRepsToCreate; i++){
                        this.addRepToSet(args.user_id, args.workout_id, args.exercise_id, set_id, args.weight);
                    }
                    resolve();
                } else {
                    let numOfRepsToDestroy = reps.size - rep_count;
                    for (let i = 0; i < numOfRepsToDestroy; i++) {
                        reps.docs[i].ref.delete()
                        .then(() => {
                            console.log("Successfully delete rep");
                        })
                        .catch(error => {
                            reject();
                            console.log("Did not successfully delete rep");
                        });  
                    }
                    resolve();
                }  
            })
            .catch(error => {
                console.log("Error: ", error); 
                reject();
            });
        });
    }

    deleteRepsFromSet(set_id){
        return new Promise ((resolve, reject) => {
            this._DB.collection("reps")
            .where("set_id", "==", set_id)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(rep => {
                    rep.ref.delete();
                });
                resolve();
            })
            .catch(() => {
                console.log("Did not successfully delete reps belonging to set");
                reject();
            });
        });
    }

    deleteSet(set_id){
        return new Promise((resolve, reject) => {
            this._DB.collection("sets")
            .doc(set_id)
            .delete()
            .then(() => {
                console.log("Successfully deleted set");
                resolve();
            })
            .catch(error => {
                console.log("Error occurred trying to delete set: ", error);
                reject();
            });
        });
    }

    deleteExercise(exercise_id){
        return new Promise((resolve, reject) => {
            this._DB.collection("exercises")
            .doc(exercise_id)
            .delete()
            .then(() => {
                console.log("Successfully deleted exercise");
                resolve();
            })
            .catch(error => {
                console.log("Error occurred while trying to delete set: ", error);
                reject();
            });
        });
    }

    deleteAllDependentOnExercise(exercise_id){
        return new Promise((resolve, reject) => {
            this.deleteRepsFromExercise(exercise_id)
            .then(() => {
                this.deleteSetsFromExercise(exercise_id)
                .then(() => {
                    resolve();
                })
                .catch(error => {
                    console.log("Error occurred: ", error);
                })
            });
        });
        
    }

    deleteRepsFromExercise(exercise_id){
        return new Promise ((resolve, reject) => {
            this._DB.collection("reps")
            .where("exercise_id", "==", exercise_id)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(rep => {
                    rep.ref.delete()
                    .then(() => {
                        console.log("Successfully deleted rep from exercise");
                    })
                    .catch(error => {
                        reject();
                        console.log("Error occurred: ", error);  
                    });
                });
                resolve();
            })
            .catch(error => {
                console.log("Error occurred: ", error);
                reject();
            });
        });
    }

    deleteSetsFromExercise(exercise_id){
        return new Promise ((resolve, reject) => {
            this._DB.collection("sets")
            .where("exercise_id", "==", exercise_id)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(set => {
                    set.ref.delete()
                    .then(() => {
                        console.log("Successfully deleted set from exercise");
                    })
                    .catch(error => {
                        console.log("Error occurred: ", error);
                        reject();
                    });
                });
                resolve();
            })
            .catch(error => {
                console.log("Error occurred: ", error);
                reject();
            });
        });
    }
}