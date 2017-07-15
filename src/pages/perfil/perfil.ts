import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';
import { WebServiceProvider } from '../../providers/web-service/web-service';

/**
 * Generated class for the PerfilPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
	selector: 'page-perfil',
	templateUrl: 'perfil.html',
})
export class PerfilPage {

	public urlImagen: string = 'http://www.contactoarquitectonico.com.co/capp_admin/archivos/perfiles/img_user/';
	public myProfile: string = 'perfil';
	public cotizaciones: any;
	public compras: any;
	public editarCampos: boolean = false;
	public showSpinner: boolean;

	constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public auth: AuthProvider, public ws: WebServiceProvider, public modalCtrl: ModalController) {
		this.cotizaciones = [];
		this.compras = [];
	}

	ionViewDidLoad() {
		this.searchCotizacion();
		this.getCompras();
	}

	editar() {
		this.editarCampos = !this.editarCampos;
		if (this.editarCampos) {
			this.presentToast(3000, 'Ahora puede editar sus datos');
		}
	}

	presentToast(time, message) {
		let toast = this.toastCtrl.create({
			message: message,
			duration: time
		});

		toast.present();
	}

	searchCotizacion() {
		this.showSpinner = true;
		this.cotizaciones = [];
		this.ws.searchCotizacionUsuario(this.auth.user.id)
			.subscribe(
			(res) => {
				this.cotizaciones = this.formatDate(res.json());
				this.showSpinner = false;
			},
			(err) => {
				console.log(err);
			}
			)
	}

	segmentChanged() {

	}

	formatDate(array) {
		let lista = array;
		let options = { weekday: "short", year: "numeric", month: "long", day: "numeric" };
		for (let item of lista) {
			let fecha = new Date(item.fecha);
			item.fechaFormat = fecha.toLocaleDateString('es-ES', options);
		}
		return lista;
	}

	getCompras() {
		this.ws.getCompras(this.auth.user.id)
			.subscribe(
			(res) => {
				this.compras = this.formatDate(res.json());
			}
			)
	}

	verCotizacion(cotizacion) {
		let params = {
			id: cotizacion.cotizacion,
			fecha: cotizacion.fecha,
			empresa: cotizacion.cliente,
			estado: cotizacion.estado,
			estadoId: cotizacion.estadoid,
			clienteId: cotizacion.clienteid
		}
		this.navCtrl.push('ListaCotizacionPage', params);
	}

	verCompra(compra) {
		console.log(compra);
		this.navCtrl.push('ListaCompraPage', compra);
	}
}
