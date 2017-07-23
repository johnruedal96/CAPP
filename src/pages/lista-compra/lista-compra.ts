import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { WebServiceProvider } from '../../providers/web-service/web-service';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the ListaCompraPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-lista-compra',
  templateUrl: 'lista-compra.html',
})
export class ListaCompraPage {

  public idCompra:number;
  public idCliente:number;
  public fecha:string;
  public hora:string;
  public total:number;
  public cliente:string;
  public compra:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ws: WebServiceProvider, public auth: AuthProvider) {
    this.idCompra = navParams.get('idCompra');
    this.idCliente = navParams.get('idCliente');
    this.fecha = this.formatDate(navParams.get('fecha'));
    this.hora = this.formatHora(navParams.get('fecha'));
    this.total = navParams.get('total');
    this.cliente = navParams.get('cliente');
    this.compra = [];
  }

  ionViewDidLoad() {
    this.getCompra();
    this.isLogged();
  }

  isLogged() {
    this.auth.isLogged()
      .subscribe(res => {
        if (res.text() == '') {
          this.navCtrl.setRoot('LoginPage');
        } else {
          this.auth.user = JSON.parse(res.text());
        }
      });
  }

  getCompra(){
    this.ws.getCompra(this.idCompra)
    .subscribe(
      (res)=>{
        this.compra = res.json();
      }
    )
  }

  formatDate(date) {
		let options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
		let fecha = new Date(date);
		return fecha.toLocaleDateString('es-ES', options);
	}

	formatHora(date){
		let options = {	hour:'numeric',minute:'numeric', hour12:true }
		let hora = new Date(date);
		return hora.toLocaleTimeString('es-ES', options);
	}

}
