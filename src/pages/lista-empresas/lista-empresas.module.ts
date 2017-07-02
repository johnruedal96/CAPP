import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaEmpresasPage } from './lista-empresas';

@NgModule({
  declarations: [
    ListaEmpresasPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaEmpresasPage),
  ],
  exports: [
    ListaEmpresasPage
  ]
})
export class ListaEmpresasPageModule {}
