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
	public myProfile: string = 'profile';

	public compras: any;

	public editarCampos: boolean = false;

	constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public auth: AuthProvider, public ws: WebServiceProvider, public modalCtrl: ModalController) {
		this.compras = [];
	}

	ionViewDidLoad() {
		this.searchCotizacion();
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
		this.ws.searchCotizacionUsuario(this.auth.user.id)
			.subscribe(
			(res) => {
				this.compras = res.json();
			},
			(err) => {
				console.log(err);
			}
			)
	}

	segmentChanged() {

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
}
