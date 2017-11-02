import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExerciseEditPage } from './exercise-edit';

@NgModule({
  declarations: [
    ExerciseEditPage,
  ],
  imports: [
    IonicPageModule.forChild(ExerciseEditPage),
  ],
})
export class ExerciseEditPageModule {}
