import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the EmpresaPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
	selector: 'page-empresa',
	templateUrl: 'empresa.html',
})
export class EmpresaPage {

	public imagen: string;
	public empresa: string;

	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.imagen = "http://www.contactoarquitectonico.com.co/capp_admin/archivos/";
		this.empresa = navParams.get('empresa');
	}

	ionViewDidLoad() {

	}

	cotizar() {
		this.navCtrl.push('CotizacionPage', { empresa: this.empresa });
	}

}
