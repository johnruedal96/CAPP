import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

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
	public user: any;
	public myProfile: string = 'profile';

	lastImage: string = null;
	public editarCampos: boolean = false;

	constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController) {
		let user = JSON.parse(window.localStorage.getItem('user'));
		// Funciona con dispositivos moviles
		user = JSON.parse(user);
		this.user = user;
	}

	ionViewDidLoad() {

	}

	editar() {
		this.editarCampos = !this.editarCampos;
		if (this.editarCampos) {
			this.presentToast(3000,'Ahora puede editar sus datos');
		}
	}

	presentToast(time, message) {
		let toast = this.toastCtrl.create({
			message: message,
			duration: time
		});

		toast.present();
	}
}
