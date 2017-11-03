import { Set } from './set';

export class Exercise {
    id : string;
    user_id: string;
    workout_id: string;
    name : string;
    sets : Array<Set>;
    created_at : string;

    constructor(docSnapshot){
        this.id = docSnapshot.id;
        this.name = docSnapshot.data().name;
        this.created_at = docSnapshot.data().created_at;
        this.workout_id = docSnapshot.data().workout_id;
        this.user_id = docSnapshot.data().user_id;
    }
}