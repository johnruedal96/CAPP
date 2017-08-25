import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Searchbar, LoadingController } from 'ionic-angular';

import { WebServiceProvider } from '../../providers/web-service/web-service'
import { Keyboard } from '@ionic-native/keyboard';
import { MyApp } from '../../app/app.component';

import { Subscription } from 'rxjs/Subscription';

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

	@ViewChild('searchbar') searchInput: Searchbar;

	public urlBaner = 'http://www.contactoarquitectonico.com.co/capp_admin/archivos/banners/banner_servicios.png'

	public servicios: any;
	public imagen: string;
	public servicioLoad: any;
	// muestra/oculta la barra de busqueda en el encabezado
	public busqueda: boolean;
	// guarda lo escrito en el input de busqueda
	public txtSearch: string;
	// indica cuando se realizo una busqueda
	public loadListSearch: boolean = false;
	// suscripcion a los metodos del teclado
	private onHideSubscription: Subscription;
	public showSpinner: boolean = true;
	public enabledInfinite: boolean = true;

	public refresher;

	constructor(public navCtrl: NavController, public navParams: NavParams, public ws: WebServiceProvider, public keyboard: Keyboard, public loadingCtrl: LoadingController, public app: MyApp) {
		this.servicios = [];
		this.servicioLoad = [];
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
			this.showSpinner = true;
		}
		// carga la informacion del web service
		this.ws.getEmpresas(3)
			.subscribe(
			(servicio) => {
				this.servicios = servicio.data;
				this.servicioLoad = [];
				this.cargarVista(20, refresh);
			},
			(err) => {
				if (!refresh) {
					this.showSpinner = false;
				} else {
					this.refresher.complete();
				}

				if (err.status == 0) {
					this.app.rootPage = 'NoInternetPage';
				}
			}
			);
	}

	// Cargar los elementos en la lista
	// numElemtos = numero de elementos a mostrar
	cargarVista(numElemetos, refresh) {
		let num = numElemetos;
		if (this.servicios.length <= num) {
			num = this.servicios.length
		}
		for (var i = 0; i < num; ++i) {
			this.isOpoen(i);
			this.servicioLoad.push(this.servicios[i]);
		}
		if (refresh) {
			this.refresher.complete();
			this.txtSearch = '';
			this.busqueda = false;
			this.loadListSearch = false;
		} else {
			// oculta el 'cargando' de la vista
			this.showSpinner = false;
		}
	}

	// navega a las diferentes empresas
	goToEmpresa(empresa) {
		this.app.nav.push('EmpresaPage', { empresa: empresa });
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

	search(event) {
		this.servicioLoad = [];
		// mustra el 'cargando' en la vista
		this.showSpinner = true;
		// realiza la busqueda y la muestra en pantalla
		this.loadListSearch = true;
		this.ws.search(3, this.txtSearch)
			.subscribe(
			(search) => {
				this.servicios = search.data;
				this.servicioLoad = [];
				this.cargarVista(20, false);
				// this.keyboard.close();
			},
			(err) => {
				this.servicios = [];
				this.servicioLoad = [];
				this.cargarVista(20, false);
				// this.keyboard.close();

				if (err.status == 0) {
					this.app.rootPage = 'NoInternetPage';
				}
			}
			);
	}

	doInfinite(infiniteScroll) {

		setTimeout(() => {
			// numero de elementos cargados en la vista
			let position = this.servicioLoad.length;
			// numero de elementos a agregar en la vista (20)
			let tamano = position + 20;
			// si tamaño es mañor que el array de elementos, tamaño es igual al tamaño del array
			if (tamano > this.servicios.length) {
				tamano = this.servicios.length;
			}

			// agregar elementos al array que muestra la informacion el pantalla
			for (let i = position; i < tamano; i++) {
				this.isOpoen(i);
				this.servicioLoad.push(this.servicios[i]);
			}

			infiniteScroll.complete();
			if (tamano == this.servicios.length) {
				this.enabledInfinite = false;
			}
		}, 500);
	}

	doRefresh(refresher) {
		this.loadEmpresa(true);
		this.refresher = refresher;
	}

	isOpoen(i) {
		let date = new Date();
		let horaActual = date.getHours();
		let minutosActual = date.getMinutes();
		let abierto = this.servicios[i].abierto.split(',');
		let cerrado = this.servicios[i].cerrado.split(',');

		for (var j = 0; j < abierto.length; j++) {
			let a = abierto[j].split(':');
			let c = cerrado[j].split(':');
			if (a[0] <= horaActual && horaActual <= c[0]) {
				if (a[0] == horaActual || horaActual == c[0]) {
					if (a[1] <= minutosActual && minutosActual <= c[1]) {
						this.servicios[i].isOpen = true;
					} else {
						this.servicios[i].isOpen = false;
					}
				} else {
					this.servicios[i].isOpen = true;
				}
			} else {
				this.servicios[i].isOpen = false;
			}

			if (this.servicios[i].isOpen) {
				j = abierto.length;
			}

		}
	}

}
