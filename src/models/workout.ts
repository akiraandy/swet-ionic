export class Workout {


    constructor(public title: string, public date: Date, public exercises: any[]){
        this.title = title;
        this.date = date;
        this.exercises = exercises;
    }


}