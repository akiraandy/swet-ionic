export class Rep {
    id: string;
    user_id: string;
    set_id: string;
    exercise_id: string;
    workout_id: string;
    created_at: string;
    weight: number;

    constructor(docSnapshot){
        this.id = docSnapshot.id;
        this.workout_id = docSnapshot.data().workout_id;
        this.user_id = docSnapshot.data().user_id;
        this.exercise_id = docSnapshot.data().exercise_id;
        this.created_at = docSnapshot.data().created_at;
        this.weight = docSnapshot.data().weight;
        this.set_id = docSnapshot.data().set_id;
    }
}