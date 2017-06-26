import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { WebServiceProvider } from '../../providers/web-service/web-service';

/**
 * Generated class for the FerreteriaPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
	selector: 'page-ferreteria',
	templateUrl: 'ferreteria.html',
})
export class FerreteriaPage {

	public ferreterias:any;
	public imagen:string;
	public busqueda:boolean;

	constructor(public navCtrl: NavController, public navParams: NavParams, public ws: WebServiceProvider) {
		this.ferreterias = [];
		this.imagen = "http://www.contactoarquitectonico.com.co/capp_admin/archivos/";
		this.busqueda = false;
	}

	ionViewDidLoad() {
		this.ws.getEmpresas(1)
		.subscribe(ferreteria => {
			this.ferreterias = ferreteria.data;
		});
	}

}
