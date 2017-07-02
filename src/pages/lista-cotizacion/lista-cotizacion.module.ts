import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaCotizacionPage } from './lista-cotizacion';

@NgModule({
  declarations: [
    ListaCotizacionPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaCotizacionPage),
  ],
  exports: [
    ListaCotizacionPage
  ]
})
export class ListaCotizacionPageModule {}
