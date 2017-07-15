import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaCompraPage } from './lista-compra';

@NgModule({
  declarations: [
    ListaCompraPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaCompraPage),
  ],
  exports: [
    ListaCompraPage
  ]
})
export class ListaCompraPageModule {}
