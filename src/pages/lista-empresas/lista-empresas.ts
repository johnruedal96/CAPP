import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';

import { WebServiceProvider } from '../../providers/web-service/web-service';

/**
 * Generated class for the ListaEmpresasPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
	selector: 'page-lista-empresas',
	templateUrl: 'lista-empresas.html',
})
export class ListaEmpresasPage {

	// guarda las empresas a mostrar en la vista
	public empresas: any;
	// auxiliar, mantiene el valor del array de empresas, se utiliza en el metodo filtrar
	public empresasAntiguas: any;
	// array que guarda las empresas seleccionadas por el usuario
	public seleccion: any = [];
	// guardar el id del tipo de empresa (ferreteria, electricos, servicios)
	public id: number;
	// guarda el tipo de filtro (todos = 1, seleccionados = 2)
	public filtro: number = 1;
	public aplicoFiltro: boolean = false;
	public disabledCheck: boolean = false;

	constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public ws: WebServiceProvider, public toastCtrl: ToastController) {

		// si ecuentra el parametro, ejecuta la busqueda por el tipo de empresa (combo)
		this.id = navParams.get('id');
		this.buscar(this.id);
		// si no encuentra el parametro asigna un array vacio a seleccion 
		this.seleccion = navParams.get('empresas');
		if (this.seleccion == undefined) {
			this.seleccion = [];
		}

		if (this.seleccion.length == 5) {
			this.disabledCheck = true;
		}

	}

	ionViewDidLoad() {

	}

	dismiss() {
		// cierra la ventana modal, y envia data como parametro a la ventana pdre
		let data = {
			'seleccion': this.seleccion,
			'id': this.id
		};
		this.viewCtrl.dismiss(data);
	}

	buscar(id) {
		// busca las empresas segun el id seleccionado
		this.id = id;
		this.seleccion = [];
		this.ws.getEmpresas(id)
			.subscribe(empresas => {
				this.loadList(empresas.data);
			})
	}

	loadList(empresas) {
		// carga las empresas en la vista
		this.empresas = empresas;
		for (var i = 0; i < empresas.length; ++i) {
			for (var j = 0; j < this.seleccion.length; ++j) {
				if (empresas[i].id == this.seleccion[j].id) {
					this.empresas[i].check = true;
					break;
				} else {
					this.empresas[i].check = false;
				}
			}
		}
	}

	seleccionar(event, empresa) {
		// agrega al array seleccion las empresas seleccionadas
		if (event) {
			empresa.check = true;
			this.seleccion.push(empresa);
		} else {
			// elimina del array seleccion las empresas seleccionadas
			for (var i = 0; i < this.seleccion.length; ++i) {
				if (empresa.id == this.seleccion[i].id) {
					this.seleccion.splice(i, 1);
					empresa.check = false;
				}
			}
			this.disabledCheck = false;
		}
		if (this.seleccion.length == 5) {
			let alert = this.toastCtrl.create({
				message: 'Ha seleccionado el máximo de empresas',
				duration: 3000,
				position: 'bottom'
			});
			alert.present();
			this.disabledCheck = true;
		}
	}

	filtrar(event) {
		if (!this.aplicoFiltro && event == 1) {
			this.aplicoFiltro = true;
		} else {
			// todos = 1
			if (event == 1) {
				this.empresas = this.empresasAntiguas;
				// compara si la empresa ha sido seleccionada por el usuario, le agrega el atributo check
				for (var i = 0; i < this.empresasAntiguas.length; i++) {
					for (var j = 0; j < this.seleccion.length; j++) {
						// si fue seleccionada agrega a check true
						if (this.empresasAntiguas[i].id == this.seleccion[j].id) {
							this.empresasAntiguas[i].check = true;
							break;
							// si NO fue seleccionada agrega a check false
						} else {
							this.empresasAntiguas[i].check = false;
						}

					}
				}

				this.empresas = this.empresasAntiguas;
			}
			// seleccionadas = 2
			if (event == 2) {
				this.aplicoFiltro = true;
				this.empresasAntiguas = this.empresas;
				this.empresas = this.seleccion;
			}
		}
	}

}
