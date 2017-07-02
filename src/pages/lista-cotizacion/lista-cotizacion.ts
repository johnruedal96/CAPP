import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

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

 	public lista:any;

 	constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
 		this.lista = navParams.get('lista');
 	}

 	ionViewDidLoad() {

 	}

 	dismiss() {
 		let data = { 'foo': 'bar' };
 		this.viewCtrl.dismiss(data);
 	}

 }
