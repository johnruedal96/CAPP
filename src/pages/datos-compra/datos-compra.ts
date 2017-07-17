import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { WebServiceProvider } from '../../providers/web-service/web-service';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the DatosCompraPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-datos-compra',
  templateUrl: 'datos-compra.html',
})
export class DatosCompraPage {

  public lista: any;
  public cliente: number;
  public direcciones:any;
  public direccionSelectedId:any;
  public direccionSelectedName:any;
  public formasPago:any;
  public formasPagoSelectedId:any;
  public formasPagoSelectedName:any;
  public total:number
  public cotizacion:number

  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: WebServiceProvider, public auth: AuthProvider) {
    this.cliente = this.navParams.get('cliente');
    this.lista = this.navParams.get('lista');
    this.total = this.navParams.get('total');
    this.cotizacion = this.navParams.get('cotizacion');
  }

  ionViewDidLoad() {
    this.getDireccion();
    this.getFormasPago();
  }

  getDireccion() {
    this.ws.getDireccion(this.auth.user.id)
      .subscribe(
      (res) => {
        this.direcciones = res.json();
        // this.showPrompt(res.json());
      }
      )
  }

  getFormasPago(){
    this.ws.getFormasPago()
      .subscribe(
        (res)=>{
          this.formasPago = res.json();
        }
      )
  }

  changeDireccion(event){
    this.direcciones.find(
      (element,item)=>{
        if(event == element.id){
          this.direccionSelectedName = element.direccion;
        }
      }
    )
  }

  changeFormaPago(event){
    this.formasPago.find(
      (element,item)=>{
        if(event == element.id){
          this.formasPagoSelectedName = element.nombre;
        }
      }
    )
  }
  
  siguiente(){
    let params = {
      direccionNombre: this.direccionSelectedName,
      direccionId: this.direccionSelectedId,
      formaPagoNombre: this.formasPagoSelectedName,
      formaPagoId: this.formasPagoSelectedId,
      productos: this.lista,
      cliente: this.cliente,
      total: this.total,
      cotizacion: this.cotizacion
    }
    this.navCtrl.push('ConfirmarCompraPage', params);
  }

}
