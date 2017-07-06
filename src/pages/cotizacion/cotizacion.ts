import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
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
	// llega del modal lista-empresas variable que guarda los empresas (empresas)
	public empresas = [];
	// variable que indica si se va a cotizar una o muchas empresas
	public addEmpresa: boolean = true;

	public tabsCotizacion: string = 'productoTab';
	public tipoEmpresaId: number;
	public imagen: string;

	constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public alertCtrl: AlertController) {
		this.lista = [];
		this.empresa = this.navParams.get('empresa');
		if (this.empresa != undefined) {
			this.empresas.push(this.empresa);
			this.addEmpresa = false;
		}
		this.imagen = "http://www.contactoarquitectonico.com.co/capp_admin/archivos/";
	}

	ionViewDidLoad() {
	}

	presentEmpresaModal() {
		if (this.tipoEmpresaId != undefined) {
			let param = {
				empresas: this.empresas,
				id: this.tipoEmpresaId,
			}
			let profileModal = this.modalCtrl.create('ListaEmpresasPage', param);
			profileModal.onDidDismiss(data => {
				this.empresas = data.seleccion;
			});
			profileModal.present();
		}else{
			let alert = this.alertCtrl.create({
				title:'Error',
				subTitle: 'Seleccione primero el tipo de empresa',
				buttons:['cerrar']
			});
			alert.present();
		}
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

	goToEmpresa(empresa){
		this.navCtrl.push('EmpresaPage', empresa);
	}

}
