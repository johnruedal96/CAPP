import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { WebServiceProvider } from '../../providers/web-service/web-service'

/**
 * Generated class for the ServicioPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
 @IonicPage()
 @Component({
 	selector: 'page-servicio',
 	templateUrl: 'servicio.html',
 })
 export class ServicioPage {

 	public servicios:any;
 	public imagen:string;
 	public busqueda:boolean;

 	constructor(public navCtrl: NavController, public navParams: NavParams, public ws: WebServiceProvider) {
 		this.servicios = [];
		this.imagen = "http://www.contactoarquitectonico.com.co/capp_admin/archivos/";
		this.busqueda = false;
 	}

 	ionViewDidLoad() {

 		this.ws.getEmpresas(3)
		.subscribe(servicio => {
			this.servicios = servicio.data;
		});

 	}

 }
