import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the LocalStorageProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class LocalStorageProvider {

  //   window.localStorage.setItem('CotizacionEmpresas', JSON.stringify(this.empresas));
  // window.localStorage.setItem('CotizacionLista', JSON.stringify(this.lista));
  // window.localStorage.setItem('cotizacionTipoEmpresa', this.tipoEmpresaId.toLocaleString());
  // Cotizacion
  public empresas: any = [];
  public productos: any = [];
  public empresaId: any;
  public filtro: boolean = false;
  public desarrollo: boolean = true;

  constructor(public http: Http) {

  }

}
