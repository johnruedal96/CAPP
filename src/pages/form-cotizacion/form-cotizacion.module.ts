import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormCotizacionPage } from './form-cotizacion';

@NgModule({
  declarations: [
    FormCotizacionPage,
  ],
  imports: [
    IonicPageModule.forChild(FormCotizacionPage),
  ],
  exports: [
    FormCotizacionPage
  ]
})
export class FormCotizacionPageModule {}
