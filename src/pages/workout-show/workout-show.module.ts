import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkoutShowPage } from './workout-show';

@NgModule({
  declarations: [
    WorkoutShowPage,
  ],
  imports: [
    IonicPageModule.forChild(WorkoutShowPage),
  ],
})
export class WorkoutShowPageModule {}
