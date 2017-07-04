import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Searchbar, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';

import { WebServiceProvider } from '../../providers/web-service/web-service';

import { Keyboard } from '@ionic-native/keyboard';

import { Subscription } from 'rxjs/Subscription';

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

	@ViewChild('searchbar') searchInput: Searchbar;

	public ferreterias: any;
	public imagen: string;
	// array elemtos scroll infinite
	public ferreteriaLoad: any;
	// muestra/oculta la barra de busqueda en el encabezado
	public busqueda: boolean;
	// guarda lo escrito en el input de busqueda
	public txtSearch: string;
	// indica cuando se realizo una busqueda
	public loadListSearch: boolean = false;
	// suscripcion a los metodos del teclado
	private onHideSubscription: Subscription;

	public loader;

	public refresher;

	constructor(public navCtrl: NavController, public navParams: NavParams, public ws: WebServiceProvider, public keyboard: Keyboard, public loadingCtrl: LoadingController, public statusBar: StatusBar) {
		this.ferreterias = [];
		this.ferreteriaLoad = [];
		this.imagen = "http://www.contactoarquitectonico.com.co/capp_admin/archivos/";
		this.busqueda = false;

		// console.log(window.localStorage.getItem('token'));
	}

	ionViewDidLoad() {
		this.loadEmpresa(false);
		// ejecuta la funcion closeSearch() cuando el teclado es cerrado
		this.onHideSubscription = this.keyboard.onKeyboardHide().subscribe(() => this.closeKeyboard());
	}

	loadEmpresa(refresh) {
		// muestra el 'Cargando' en la vista
		// se la pagina se refresca con el efecto de estirar no se muestra el 'cargando'
		if (!refresh) {
			this.presentLoading();
		}
		// carga la informacion del web service
		this.ws.getEmpresas(1)
			.subscribe(ferreteria => {
				this.ferreterias = ferreteria.data;
				this.ferreteriaLoad = [];
				this.cargarVista(20, refresh);
			});
	}

	// Cargar los elementos en la lista
	// numElemtos = numero de elementos a mostrar
	cargarVista(numElemetos, refresh) {
		let num = numElemetos;
		if (this.ferreterias.length <= num) {
			num = this.ferreterias.length
		}
		for (var i = 0; i < num; ++i) {
			this.ferreteriaLoad.push(this.ferreterias[i]);
		}
		if (refresh) {
			this.refresher.complete();
			this.txtSearch = '';
			this.busqueda = false;
			this.loadListSearch = false;
			this.statusBar.backgroundColorByHexString('#F57C00');
		} else {
			// oculta el 'cargando' de la vista
			this.loader.dismiss();
		}
	}

	// ejecuta el scroll infinito
	presentLoading() {
		this.loader = this.loadingCtrl.create({
			content: "Cargango",
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

		this.statusBar.backgroundColorByHexString('#757575');
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
			this.statusBar.backgroundColorByHexString('#F57C00');
		}
	}

	closeKeyboard() {
		if (!this.loadListSearch) {
			this.busqueda = false;
			this.statusBar.backgroundColorByHexString('#F57C00');
		}
	}

	loadSearch() {
		if (this.txtSearch != '' && this.txtSearch != undefined) {
			// mustra el 'cargando' en la vista
			this.presentLoading();
			// realiza la busqueda y la muestra en pantalla
			this.loadListSearch = true;
			this.ws.search(1, this.txtSearch)
				.subscribe(
				(search) => {
					this.ferreterias = search.data;
					this.ferreteriaLoad = [];
					this.cargarVista(20, false);
					this.keyboard.close();
				},
				(err) => {
					this.ferreterias = [];
					this.ferreteriaLoad = [];
					this.cargarVista(20, false);
					this.keyboard.close();
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
			let position = this.ferreteriaLoad.length;
			// numero de elementos a agregar en la vista (20)
			let tamano = position + 20;
			// si tamaño es mañor que el array de elementos, tamaño es igual al tamaño del array
			if (tamano > this.ferreterias.length) {
				tamano = this.ferreterias.length;
			}

			// agregar elementos al array que muestra la informacion el pantalla
			for (let i = position; i < tamano; i++) {
				this.ferreteriaLoad.push(this.ferreterias[i]);
			}

			infiniteScroll.complete();
		}, 500);
	}

	doRefresh(refresher) {
		this.loadEmpresa(true);
		this.refresher = refresher;
	}
}
