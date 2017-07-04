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

	// variable que almacena el producto seleccionado
	public product: any;
	// variable que almacena la cantidad seleccionada
	public cantidad: any;
	// variable que llega de la ventana modal
	public empresa: any;
	// variable que agrega todos los productos
	public lista: any;
	// llega del modal lista-empresas variable que guarda los tags (empresas)
	public tags = [];
	//  variable que llega del modal lista-empresas que indica el tipo de empresa seleccionado
	public id: number;
	// variable que indica si se va a cotizar una o muchas empresas
	public addEmpresa: boolean = true;

	constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
		this.lista = [];
		this.empresa = this.navParams.get('empresa');
		if (this.empresa != undefined) {
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

	agregar() {
		let item = {
			cantidad: this.cantidad,
			producto: this.product
		}
		this.lista.push(item);
		this.product = '';
		this.cantidad = '';
	}

}
