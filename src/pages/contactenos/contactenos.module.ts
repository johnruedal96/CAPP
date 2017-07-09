import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactenosPage } from './contactenos';

@NgModule({
  declarations: [
    ContactenosPage,
  ],
  imports: [
    IonicPageModule.forChild(ContactenosPage),
  ],
  exports: [
    ContactenosPage
  ]
})
export class ContactenosPageModule {}
