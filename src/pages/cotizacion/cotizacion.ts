import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
/**
 * Generated class for the CotizacionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
 @IonicPage()
 @Component({
 	selector: 'page-cotizacion',
 	templateUrl: 'cotizacion.html',
 })
 export class CotizacionPage {

 	public product:any;
 	public cantidad:any;
 	public empresa:any;

 	public lista:any;

 	public tags = [];
 	public id:number;

 	public addEmpresa:boolean = true;

 	constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
 		this.lista = [];
 		this.empresa = this.navParams.get('empresa');
 		if(this.empresa != undefined){
 			this.tags.push(this.empresa);
 			this.addEmpresa = false;
 		}
 	}

 	ionViewDidLoad() {
 	}

 	presentCotizacionModal() {
 		let profileModal = this.modalCtrl.create('ListaCotizacionPage', { lista: this.lista });
 		profileModal.present();
 	}

 	presentEmpresaModal() {
 		let param = {
 			tags: this.tags,
 			id: this.id
 		}
 		let profileModal = this.modalCtrl.create('ListaEmpresasPage', param);
 		profileModal.onDidDismiss(data => {
 			this.tags = data.seleccion;
 			this.id = data.id;
 		});
 		profileModal.present();
 	}

 	agregar(){
 		let item = {
 			cantidad: this.cantidad,
 			producto: this.product
 		}
 		this.lista.push(item);
 		this.product = '';
 		this.cantidad = '';
 	}

 }
