import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { WebServiceProvider } from '../../providers/web-service/web-service';

/**
 * Generated class for the ElectricoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
 @IonicPage()
 @Component({
 	selector: 'page-electrico',
 	templateUrl: 'electrico.html',
 })
 export class ElectricoPage {

 	public electricos:any;
	public imagen:string;
	public busqueda:boolean;

 	constructor(public navCtrl: NavController, public navParams: NavParams, public ws: WebServiceProvider) {
 		this.electricos = [];
		this.imagen = "http://www.contactoarquitectonico.com.co/capp_admin/archivos/";
		this.busqueda = false;
 	}

 	ionViewDidLoad() {
 		
 		this.ws.getEmpresas(2)
		.subscribe(electrico => {
			this.electricos = electrico.data;
		});

 	}

 }
