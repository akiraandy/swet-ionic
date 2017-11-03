import { Exercise } from './exercise';
import moment from 'moment';

export class Workout {
    id: string;
    title: string;
    user_id: string;
    exercises: Exercise[];
    created_at: string;
    created_at_unix: number;

    constructor(docSnapshot) {
        this.id = docSnapshot.id;
        this.title = docSnapshot.data().title;
        this.user_id = docSnapshot.data().user_id;
        this.created_at = docSnapshot.data().created_at;
        this.created_at_unix = docSnapshot.data().created_at_unix;
    }

    addExercise(exercise: Exercise) {
        this.exercises.push(exercise);
    }

    date() :string{
        return moment(this.created_at).format('dddd MMMM Do YYYY')
    }

    fromNow() :string{
        return moment(this.created_at).fromNow();
    }



}