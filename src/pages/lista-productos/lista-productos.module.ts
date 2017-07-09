import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaProductosPage } from './lista-productos';

@NgModule({
  declarations: [
    ListaProductosPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaProductosPage),
  ],
  exports: [
    ListaProductosPage
  ]
})
export class ListaProductosPageModule {}
