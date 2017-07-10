import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { WebServiceProvider } from '../../providers/web-service/web-service';
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
	public id: number = 0;
	// llega del modal lista-empresas variable que guarda los empresas (empresas)
	public empresas = [];
	// variable que indica si se va a cotizar una o muchas empresas
	public addEmpresa: boolean = true;

	public tabsCotizacion: string = 'productoTab';
	public tipoEmpresaId: number;
	public imagen: string;
	public selectOptions: any;

	public productos: any;
	public producto: any;

	constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public alertCtrl: AlertController, public ws: WebServiceProvider) {
		this.lista = [];
		this.productos = [];
		this.empresa = this.navParams.get('empresa');
		if (this.empresa != undefined) {
			this.empresas.push(this.empresa);
			this.addEmpresa = false;
		}
		this.imagen = "http://www.contactoarquitectonico.com.co/capp_admin/archivos/";
		this.selectOptions = {
			title: 'Productos',
			// subTitle: 'Select your toppings',
		};
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
		} else {
			let alert = this.alertCtrl.create({
				title: 'Error',
				subTitle: 'Seleccione primero el tipo de empresa',
				buttons: ['cerrar']
			});
			alert.present();
		}
	}

	agregar() {
		let item = {
			id: this.id,
			cantidad: this.cantidad,
			producto: this.producto
		}
		this.id++;
		this.lista.push(item);
		this.producto = null;
		this.cantidad = '';
	}

	deleteItem(item) {
		this.lista.find((element, index) => {
			if (element == item) {
				this.lista.splice(index, 1);
			}
		});
		// function isBigEnough(element){
		// 	if(element == item){
		// 		console.log(element);
		// 	}
		// }
	}

	// isBigEnough(element) {
	// 	// return element.id = item.id
	// }

	goToEmpresa(empresa) {
		this.navCtrl.push('EmpresaPage', { empresa: empresa });
	}

	listarProductos(){
		if (this.tipoEmpresaId != undefined) {
			let param = {
				id: this.tipoEmpresaId,
			}
			let productoModal = this.modalCtrl.create('ListaProductosPage', param);
			productoModal.onDidDismiss(data => {
				this.producto = data.producto;
			});
			productoModal.present();
		} else {
			let alert = this.alertCtrl.create({
				title: 'Error',
				subTitle: 'Seleccione primero el tipo de empresa',
				buttons: ['cerrar']
			});
			alert.present();
		}
	}

}
