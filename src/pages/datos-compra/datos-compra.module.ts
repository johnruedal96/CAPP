import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DatosCompraPage } from './datos-compra';

@NgModule({
  declarations: [
    DatosCompraPage,
  ],
  imports: [
    IonicPageModule.forChild(DatosCompraPage),
  ],
  exports: [
    DatosCompraPage
  ]
})
export class DatosCompraPageModule {}
