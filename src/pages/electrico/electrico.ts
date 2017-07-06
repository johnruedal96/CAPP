import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Searchbar, LoadingController } from 'ionic-angular';

import { WebServiceProvider } from '../../providers/web-service/web-service';

import { Keyboard } from '@ionic-native/keyboard';

import { Subscription } from 'rxjs/Subscription';

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

	@ViewChild('searchbar') searchInput: Searchbar;

	public electricos: any;
	public imagen: string;
	public electricoLoad: any;
	// muestra/oculta la barra de busqueda en el encabezado
	public busqueda: boolean;
	// guarda lo escrito en el input de busqueda
	public txtSearch: string;
	// indica cuando se realizo una busqueda
	public loadListSearch: boolean = false;
	// suscripcion a los metodos del teclado
	private onHideSubscription: Subscription;

	public enabledInfinite:boolean = true;

	public loader;

	public refresher;

	constructor(public navCtrl: NavController, public navParams: NavParams, public ws: WebServiceProvider, public keyboard: Keyboard, public loadingCtrl: LoadingController) {
		this.electricos = [];
		this.electricoLoad = [];
		this.imagen = "http://www.contactoarquitectonico.com.co/capp_admin/archivos/";
		this.busqueda = false;
	}

	ionViewDidLoad() {
		this.loadEmpresa(false);
		// ejecuta la funcion closeSearch() cuando el teclado es cerrado
		this.onHideSubscription = this.keyboard.onKeyboardHide().subscribe(() => this.closeKeyboard());
	}

	loadEmpresa(refresh) {
		this.enabledInfinite = true;
		// muestra el 'Cargando' en la vista
		// se la pagina se refresca con el efecto de estirar no se muestra el 'cargando'
		if (!refresh) {
			this.presentLoading();
		}
		// carga la informacion del web service
		this.ws.getEmpresas(2)
			.subscribe(
			(electrico) => {
				this.electricos = electrico.data;
				this.electricoLoad = [];
				this.cargarVista(20, refresh);
			},
			(err) => {
				if (!refresh) {
					this.loader.dismiss();
				} else {
					this.refresher.complete();
				}
			}
			);
	}

	// Cargar los elementos en la lista
	// numElemtos = numero de elementos a mostrar
	cargarVista(numElemetos, refresh) {
		let num = numElemetos;
		if (this.electricos.length <= num) {
			num = this.electricos.length
		}
		for (var i = 0; i < num; ++i) {
			this.electricoLoad.push(this.electricos[i]);
		}
		if (refresh) {
			this.refresher.complete();
			this.txtSearch = '';
			this.busqueda = false;
			this.loadListSearch = false;
		} else {
			// oculta el 'cargando' de la vista
			this.loader.dismiss();
		}
	}

	// ejecuta el scroll infinito
	presentLoading() {
		this.loader = this.loadingCtrl.create({
			content: "Cargando",
		});
		this.loader.present();
	}

	// navega a las diferentes empresas
	goToEmpresa(empresa) {
		this.navCtrl.push('EmpresaPage', { empresa: empresa });
	}

	// muestra el input de busqueda y le pone el foco
	inputSearch() {
		this.busqueda = true;
		setTimeout(() => {
			this.searchInput.setFocus();
		}, 300);

	}

	closeSearch() {
		// si ya se realizo una busqueda, pone el texto del input en blanco
		// oculta la barra de busqueda
		// y carga todas las empresas
		if (this.loadListSearch) {
			this.txtSearch = '';
			this.busqueda = false;
			this.loadEmpresa(false);
			this.loadListSearch = false;
		}
	}

	closeKeyboard() {
		if (!this.loadListSearch) {
			this.busqueda = false;
		}
	}

	loadSearch() {
		if (this.txtSearch != '' && this.txtSearch != undefined) {
			// mustra el 'cargando' en la vista
			this.presentLoading();
			// realiza la busqueda y la muestra en pantalla
			this.loadListSearch = true;
			this.ws.search(2, this.txtSearch)
				.subscribe(
				(search) => {
					this.electricos = search.data;
					this.electricoLoad = [];
					this.keyboard.close();
					this.cargarVista(20, false);
				},
				(err) => {
					this.electricos = [];
					this.electricoLoad = [];
					this.keyboard.close();
					this.cargarVista(20, false);
				}
				);
		}

	}

	search(event) {
		// si se presiona el boton de buscar (teclado) se ejecuta la funciona
		if (event == 13) {
			this.loadSearch();
		}
	}

	doInfinite(infiniteScroll) {

		setTimeout(() => {
			// numero de elementos cargados en la vista
			let position = this.electricoLoad.length;
			// numero de elementos a agregar en la vista (20)
			let tamano = position + 20;
			// si tamaño es mañor que el array de elementos, tamaño es igual al tamaño del array
			if (tamano > this.electricos.length) {
				tamano = this.electricos.length;
			}

			// agregar elementos al array que muestra la informacion el pantalla
			for (let i = position; i < tamano; i++) {
				this.electricoLoad.push(this.electricos[i]);
			}

			infiniteScroll.complete();
			if(tamano == this.electricos.length){
				this.enabledInfinite = false;
			}
		}, 500);
	}

	doRefresh(refresher) {
		this.loadEmpresa(true);
		this.refresher = refresher;
	}
}
