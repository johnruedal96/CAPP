import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { WebServiceProvider } from '../../providers/web-service/web-service';
import { AuthProvider } from '../../providers/auth/auth';

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
	public hora: string;
	public empresa: string;
	public fecha_respuesta: string;
	public hora_respuesta: string;
	public clienteId: number;
	public estado: string;
	public estadoId: number;
	public lista: any;
	public total: number = 0;

	constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public ws: WebServiceProvider, public auth: AuthProvider) {
		this.id = navParams.get('id');
		this.fecha = this.formatDate(navParams.get('fecha'));
		this.hora = this.formatHora(navParams.get('fecha'));
		this.empresa = navParams.get('empresa');
		this.estado = navParams.get('estado');
		this.estadoId = navParams.get('estadoId');
		this.clienteId = navParams.get('clienteId');
		this.cargarLista();
	}

	ionViewDidLoad() {
		// this.isLogged();
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

	cargarLista() {
		this.ws.getCotizacion(this.id, this.estadoId, this.clienteId)
			.subscribe(
			(res) => {
				this.lista = res.json();
				for (var i = 0; i < this.lista.length; i++) {
					if (i == 0) {
						this.fecha_respuesta = this.formatDate(this.lista[i].fecha_respuesta);
						this.hora_respuesta = this.formatHora(this.lista[i].fecha_respuesta);
					}
					this.total += this.lista[i].precio;
					this.lista[i].cantidad = 1;
					this.lista[i].precioTotal = this.lista[i].precio;
				}
			},
			(err) => {
				console.log(err);
			}
			)
	}

	addCantidad(event) {
		this.lista.find((element, index) => {
			if (event.nombre == element.nombre) {
				if (element.cantidad == undefined) {
					element.cantidad = 1;
					this.total += element.precio;
					element.precioTotal = element.precio;
				} else {
					element.cantidad++;
					this.total += element.precio;
					element.precioTotal = element.precio * element.cantidad;
				}
			}
		})
	}

	rmCantidad(event) {
		this.lista.find((element, index) => {
			if (event.nombre == element.nombre) {
				if (element.cantidad == 0 || element.cantidad == undefined) {
					element.cantidad = 0;
				} else {
					element.cantidad--;
					this.total -= element.precio;
					if (this.total < 0) {
						this.total = 0;
					}
					element.precioTotal = element.precio * element.cantidad;
				}
			}
		})
	}

	comprar() {
		this.auth.getToken()
			.subscribe(
			(res) => {
				this.sendCompra(res.text());
			},
			(err) => {
				console.log(err);
			}
			)
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

	sendCompra(token) {
		let data = 'usuario=' + this.auth.user.id;
		data += '&cliente=' + this.clienteId;
		this.ws.sendCompra(data, token)
			.subscribe(
			(res) => {
				this.sendCompraProducto(token, res.json().id);
			},
			(err) => {
				console.log(err);
			}
			)
	}

	sendCompraProducto(token, compra) {
		for (let item of this.lista) {
			if (item.cantidad != 0) {
				let data = 'compra=' + compra;
				data += '&producto=' + item.idProducto;
				data += '&cantidad=' + item.cantidad;
				data += '&precioUnitario=' + item.precio;
				data += '&precioTotal=' + item.precioTotal;
				data += '&cotizacion=' + this.id;
				data += '&cliente=' + this.clienteId;

				this.ws.sendCompraProducto(data, token)
					.subscribe(
					(res) => {
						console.log(res);
					}
					)

			}
		}
	}

}
