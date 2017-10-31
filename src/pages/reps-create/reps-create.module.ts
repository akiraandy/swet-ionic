import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RepsCreatePage } from './reps-create';

@NgModule({
  declarations: [
    RepsCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(RepsCreatePage),
  ],
})
export class RepsCreatePageModule {}
