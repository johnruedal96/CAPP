import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegistroPage } from './registro';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    RegistroPage,
  ],
  imports: [
    IonicPageModule.forChild(RegistroPage),
    FormsModule
  ],
  exports: [
    RegistroPage
  ]
})
export class RegistroPageModule {}
