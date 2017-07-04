import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

	@ViewChild('inputNombre') inputNombre;
	@ViewChild('inputEmail') inputEmail;

	public urlImagen: string = 'http://www.contactoarquitectonico.com.co/capp_admin/archivos/perfiles/img_user/';
	public user: any;
	public myProfile: string = 'profile';

	lastImage: string = null;
	public editarNombre: boolean = false;
	public editarEmail: boolean = false;

	constructor(public navCtrl: NavController, public navParams: NavParams) {
		let user = JSON.parse(window.localStorage.getItem('user'));
		// Funciona con dispositivos moviles
		user = JSON.parse(user);
		this.user = user;
	}

	ionViewDidLoad() {

	}

	editar() {
		setTimeout(() => {
			this.inputNombre.setFocus();
		}, 150);
		this.editarEmail = !this.editarEmail;
		this.editarNombre = !this.editarNombre;
	}

}
