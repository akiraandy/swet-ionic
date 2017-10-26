import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkoutCreatePage } from './workout-create';

@NgModule({
  declarations: [
    WorkoutCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(WorkoutCreatePage),
  ],
})
export class WorkoutCreatePageModule {}
