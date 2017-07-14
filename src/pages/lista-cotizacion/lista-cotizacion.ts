import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { WebServiceProvider } from '../../providers/web-service/web-service';

/**
 * Generated class for the ListaCotizacionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
	selector: 'page-lista-cotizacion',
	templateUrl: 'lista-cotizacion.html',
})
export class ListaCotizacionPage {

	public id: number;
	public fecha: string;
	public empresa: string;
	public fecha_respuesta: string;
	public clienteId: number;
	public estado: string;
	public estadoId: number;
	public lista: any;
	public total: number = 0;

	constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public ws: WebServiceProvider) {
		this.id = navParams.get('id');
		this.fecha = navParams.get('fecha');
		this.empresa = navParams.get('empresa');
		this.estado = navParams.get('estado');
		this.estadoId = navParams.get('estadoId');
		this.clienteId = navParams.get('clienteId');
		this.cargarLista();
	}

	ionViewDidLoad() {

	}

	cargarLista() {
		this.ws.getCotizacion(this.id, this.estadoId, this.clienteId)
			.subscribe(
			(res) => {
				this.lista = res.json();
				for (let item of this.lista) {
					this.fecha_respuesta = item.fecha_respuesta;
					this.total += item.precio;
				}
			},
			(err) => {
				console.log(err);
			}
			)
	}

	aca(event) {
		console.log(event);
	}

}
