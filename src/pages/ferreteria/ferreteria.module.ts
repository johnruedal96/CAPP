import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FerreteriaPage } from './ferreteria';

@NgModule({
  declarations: [
    FerreteriaPage,
  ],
  imports: [
    IonicPageModule.forChild(FerreteriaPage),
  ],
  exports: [
    FerreteriaPage
  ]
})
export class FerreteriaPageModule {}
