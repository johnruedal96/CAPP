import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ElectricoPage } from './electrico';

@NgModule({
  declarations: [
    ElectricoPage,
  ],
  imports: [
    IonicPageModule.forChild(ElectricoPage),
  ],
  exports: [
    ElectricoPage
  ]
})
export class ElectricoPageModule {}
