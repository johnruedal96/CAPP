import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmarCompraPage } from './confirmar-compra';

@NgModule({
  declarations: [
    ConfirmarCompraPage,
  ],
  imports: [
    IonicPageModule.forChild(ConfirmarCompraPage),
  ],
  exports: [
    ConfirmarCompraPage
  ]
})
export class ConfirmarCompraPageModule {}
