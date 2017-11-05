import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import firebase from 'firebase';
import 'firebase/firestore';
import { Observable } from 'rxjs/Observable';
import moment from 'moment';
import { Workout } from '../models/workout';
import { Exercise } from '../models/exercise';
import { Set } from '../models/set';
import { Rep } from '../models/rep';


@Injectable()
export class FirebaseService {

    private _DB : any;
    timestamp : any;
    unix_timestamp : any;
    constructor() { 
        this._DB = firebase.firestore();
        this.timestamp = firebase.firestore.FieldValue.serverTimestamp();
        this.unix_timestamp = parseInt(moment(this.timestamp).format("X"));
    }

    getWorkout(workout_id: string) :Promise<Workout> {
        return new Promise((resolve, reject) => {
            this._DB
            .collection("workouts").doc(workout_id)
            .get()
            .then(doc => {
                let workout = new Workout(doc);
                resolve(workout);
            }).catch(error => {
                reject(error);
                console.log("Error occurred while fetching workout: ", error);
            });
        });
    }

    noWorkoutExistsForToday(user_id) {
        let date = new Date;
        let startOfDay = parseInt(moment(date.toISOString()).startOf('day').format("X"));
        let endOfDay = parseInt(moment(date.toISOString()).endOf('day').format("X"));
        return new Promise((resolve, reject) => {
            this._DB.collection("workouts")
            .where("user_id", "==", user_id)
            .where("created_at_unix", ">=", startOfDay)
            .where("created_at_unix", "<=", endOfDay)
            .get()
            .then(querySnapshot => {
                if(querySnapshot.empty){
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch(error => {
                console.log("Error occurred", error);
            })
            .catch(error => {
                console.log("Error occurred", error);
                reject(error);
            });
        });
    }

    getFullExercise(exercise_id: string) :Promise<Exercise> {
        return new Promise<Exercise>((resolve, reject) => {
            this.getExercise(exercise_id)
            .then(exercise => {
                this.getSets(exercise.id)
                .then(sets => {
                    exercise.sets = sets;
                    sets.forEach(set => {
                        this.getReps(set.id)
                        .then(reps => {
                            set.reps = reps;
                        });
                    });
                    resolve(exercise);
                });
            });
        });
    }

    getExercise(exercise_id: string) :Promise<Exercise> {
        return new Promise<Exercise>((resolve, reject) => {
            this._DB.collection("exercises")
            .doc(exercise_id)
            .get()
            .then(docSnapShot => {
                let exercise = new Exercise(docSnapShot);
                resolve(exercise);
            })
            .catch(error => {
                console.log("Error occurred: ", error);
            });
        });
    }

    getWorkouts(user_id) {
        return new Promise<Workout[]>((resolve, reject) => {
            this._DB
            .collection("workouts").where("user_id", "==", user_id)
            .orderBy("created_at")
            .get()
            .then(querySnapshot => {
                let workoutArr : Array<Workout> = [];
                querySnapshot.forEach(workoutRef => {
                    let workout = new Workout(workoutRef);
                    workoutArr.push(workout);
                });
                resolve(workoutArr);
            }).catch(error => {
                reject(error);
                console.log("Error getting workouts!", error);
            });
        });
    }

    getFullWorkouts(user_id) {
        return new Observable((observer) => {
            let result = [];
            this.getWorkouts(user_id)
            .then(workouts => {
                workouts.forEach(workout => {
                    this.getFullWorkout(workout.id)
                    .then(fullWorkout => {
                        result.push(fullWorkout);
                    })
                    .catch(error => {
                        console.log("Error: ", error);
                    });
                });
                observer.next(result);
            })
            .catch(error => {
                console.log("Error: ", error);
                observer.error(error);
            });
        });
    }

    getFullWorkout(workout_id: string) :Promise<Workout> {
        return new Promise<Workout>((resolve, reject) => {
            this.getWorkout(workout_id)
            .then(workout => {
                this.getExercises(workout_id)
                .then(exerciseArr => {
                    workout.exercises = exerciseArr;
                    if (workout.exercises.length == 0) {
                        resolve(workout);
                    }
                    workout.exercises.forEach(exercise => {
                        this.getSets(exercise.id)
                        .then(setArr => {
                            exercise.sets = setArr;
                            exercise.sets.forEach(set => {
                                this.getReps(set.id)
                                .then(repArr => {
                                    set.reps = repArr;
                                });
                            });
                            resolve(workout);
                        });
                    });
                },
                error => {
                    reject(error);
                });
            });
        });
    }

    getExercises(workout_id) {
        return new Promise<Exercise[]>((resolve, reject) => {
            this._DB
            .collection("exercises").where("workout_id", "==", workout_id)
            .orderBy("created_at")
            .get()
            .then(querySnapshot => {
                let exerciseArr = <Exercise[]>[];
                querySnapshot.forEach(exerciseData => {
                    let exercise = new Exercise(exerciseData);
                    exerciseArr.push(exercise);
                });
                resolve(exerciseArr);
            }).catch(error => {
                console.log("Error getting exercise!", error);
                reject(error);
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
        
        this._DB.collection("users").doc(user.id).set({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            DoB: user.dateOfBirth,
            created_at: this.timestamp,
            updated_at: this.timestamp
        }).then(res => {
            console.log("User created with ID:", res);
        }).catch(error => {
            console.error("Error adding user: ", error);
        });
    }

    addWorkout(workout, user_id) {
        return new Promise ((resolve, reject) => {
            this._DB.collection("workouts").add({
                user_id: user_id,
                title: workout.title,
                created_at_unix: this.unix_timestamp,
                created_at: this.timestamp,
                updated_at: this.timestamp
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
            
            this._DB.collection("exercises").add({
                user_id: user_id,
                workout_id: workout_id,
                name: exercise.name,
                created_at: this.timestamp,
                updated_at: this.timestamp
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
            
            this._DB.collection("sets").add({
                weight: weight,
                user_id: user_id,
                workout_id: workout_id,
                exercise_id: exercise_id,
                created_at: this.timestamp,
                updated_at: this.timestamp
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

    getSets(exercise_id: string) :Promise<Set[]>{
        return new Promise<Set[]> ((resolve, reject) => {
            this._DB.collection("sets")
            .where("exercise_id", "==", exercise_id)
            .get()
            .then((querySnapshot) => {
                let setArr = <Set[]>[];
                querySnapshot.docs.forEach(setData => {
                    let set = new Set(setData);
                    setArr.push(set);
                });
                
                resolve(setArr);
            }).catch(error => {
                reject(error);
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
            
            this._DB.collection("reps").add({
                user_id: user_id,
                workout_id: workout_id,
                exercise_id: exercise_id,
                set_id: set_id,
                weight: weight,
                created_at: this.timestamp,
                updated_at: this.timestamp
            }).then(res => {
                console.log('Successfully added rep', res);  
                resolve(res);
            }).catch(error => {
                console.log("Error when committing to database: ", error);
                reject(error);
            });
        });
    }

    getReps(set_id: string) :Promise<Rep[]> {
        return new Promise<Rep[]>((resolve, reject) => {
            this._DB.collection("reps")
            .where("set_id", "==", set_id)
            .get()
            .then(querySnapshot => {
                let repArr = <Rep[]>[];
                querySnapshot.forEach(repData => {
                    let rep = new Rep(repData);
                    repArr.push(rep);
                });
                resolve(repArr);
            }).catch(error => {
                console.log("error occurred", error);
                reject(error);
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
        return new Promise((resolve, reject) => {
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
                        resolve();
                        console.log("Successfully updated!");
                    });
                })
                .catch(error => {
                    reject();
                    console.log("Something went wrong!");
                });
            }).catch(error => {
                reject();
                console.log("Error updating set", error);
            });
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

    deleteAllDependentOnWorkout(workout_id) {
        return new Promise ((resolve, reject) => {
            this.deleteRepsFromWorkout(workout_id)
            .then(() => {
                this.deleteSetsFromWorkout(workout_id)
                .then(() => {
                    this.deleteExercisesFromWorkout(workout_id)
                    .then(() => {
                        resolve();
                    })
                    .catch(error => {
                        reject();
                        console.log("Error occurred: ", error);
                    });
                })
                .catch(error => {
                    console.log("Error occured: ", error);
                    reject();
                });
            }).catch(error => {
                console.log("Error occured: ", error);
                reject();
            });
        });
    }

    deleteExercisesFromWorkout(workout_id){
        return new Promise ((resolve, reject) => {
            this._DB.collection("exercises")
            .where("workout_id", "==", workout_id)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(exercise => {
                    exercise.ref.delete()
                    .then(() => {
                        console.log("Successfully deleted exercise from workout");
                    })
                    .catch(error => {
                        reject();
                        console.log("Error occurred: ", error);
                    });
                });
                resolve();
            })
            .catch(error => {
                reject();
                console.log("Error occurred: ", error);
            });
        });
    }

    deleteSetsFromWorkout(workout_id){
        return new Promise ((resolve, reject) => {
            this._DB.collection("sets")
            .where("workout_id", "==", workout_id)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(set => {
                    set.ref.delete()
                    .then(() => {
                        console.log("Successfully deleted set from workout");
                    })
                    .catch(error => {
                        reject();
                        console.log("Error occurred: ", error);
                    });
                });
                resolve();
            })
            .catch(error => {
                reject();
                console.log("Error occurred: ", error);
            });
        });
    }

    deleteRepsFromWorkout(workout_id){
        return new Promise ((resolve, reject) => {
            this._DB.collection("reps")
            .where("workout_id", "==", workout_id)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(rep => {
                    rep.ref.delete()
                    .then(() => {
                        console.log("Successfully deleted rep from workout");
                    })
                    .catch(error => {
                        reject();
                        console.log("Error occurred: ", error);
                    });
                });
                resolve();
            })
            .catch(error => {
                reject();
                console.log("Error occurred: ", error);
            });
        });
    }

    deleteWorkout(workout_id){
        return new Promise((resolve, reject) => {
            this._DB.collection("workouts")
            .doc(workout_id)
            .delete()
            .then(() => {
                console.log("Successfully deleted workout");
                resolve();
            })
            .catch(error => {
                console.log("Error occurred while trying to delete workout: ", error);
                reject();
            });
        });
    }
}