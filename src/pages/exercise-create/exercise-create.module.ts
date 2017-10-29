import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExerciseCreatePage } from './exercise-create';

@NgModule({
  declarations: [
    ExerciseCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(ExerciseCreatePage),
  ],
})
export class ExerciseCreatePageModule {}
