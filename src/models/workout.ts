import { Exercise } from './exercise';

export class Workout {
    id: string;
    title: string;
    user_id: string;
    exercises: Exercise[];
    created_at: string;
    created_at_unix: number;

    constructor(queryRef?) {
        this.id = queryRef.id;
        this.title = queryRef.data().title;
        this.user_id = queryRef.data().user_id;
        this.created_at = queryRef.data().created_at;
        this.created_at_unix = queryRef.data().created_at_unix;
    }

    addExercise(exercise: Exercise) {
        this.exercises.push(exercise);
    }

}