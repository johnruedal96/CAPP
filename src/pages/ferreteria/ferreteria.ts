import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Searchbar, LoadingController } from 'ionic-angular';

import { WebServiceProvider } from '../../providers/web-service/web-service';
import { Keyboard } from '@ionic-native/keyboard';
import { MyApp } from '../../app/app.component';

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

	public urlBaner = 'http://www.cappco.com.co/capp_admin/archivos/banners/banner_ferreterias.png'

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
	public showSpinner: boolean = true;
	public enabledInfinite: boolean = true;

	public refresher;

	constructor(public navCtrl: NavController, public navParams: NavParams, public ws: WebServiceProvider, public keyboard: Keyboard, public loadingCtrl: LoadingController, public app: MyApp) {
		this.ferreterias = [];
		this.ferreteriaLoad = [];
		this.imagen = "http://www.cappco.com.co/capp_admin/archivos/";
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
		this.ws.getEmpresas(1)
			.subscribe(
			(ferreteria) => {
				this.ferreterias = ferreteria.data;
				this.ferreteriaLoad = [];
				this.cargarVista(20, refresh);
			},
			(err) => {
				if (!refresh) {
					// this.loader.dismiss();
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
		if (this.ferreterias.length <= num) {
			num = this.ferreterias.length
		}

		this.llenarArrayLoad(0, num);

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

	isOpoen(i) {
		let date = new Date();
		let horaActual = date.getHours();
		let minutosActual = date.getMinutes();
		let abierto = this.ferreterias[i].abierto.split(',');
		let cerrado = this.ferreterias[i].cerrado.split(',');

		for (var j = 0; j < abierto.length; j++) {
			let a = abierto[j].split(':');
			let c = cerrado[j].split(':');
			if (a[0] <= horaActual && horaActual <= c[0]) {
				if (a[0] == horaActual || horaActual == c[0]) {
					if (a[1] <= minutosActual && minutosActual <= c[1]) {
						this.ferreterias[i].isOpen = true;
					} else {
						this.ferreterias[i].isOpen = false;
					}
				} else {
					this.ferreterias[i].isOpen = true;
				}
			} else {
				this.ferreterias[i].isOpen = false;
			}

			if (this.ferreterias[i].isOpen) {
				j = abierto.length;
			}
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
		this.ferreteriaLoad = [];
		this.showSpinner = true;
		// realiza la busqueda y la muestra en pantalla
		this.loadListSearch = true;
		this.ws.search(1, this.txtSearch)
			.subscribe(
			(search) => {
				this.ferreterias = search.data;
				this.ferreteriaLoad = [];
				this.cargarVista(20, false);
				// this.keyboard.close();
			},
			(err) => {
				// si no hay empresas para mostrar
				if (err.status == 400) {
					this.ferreterias = [];
					this.ferreteriaLoad = [];
					this.cargarVista(20, false);
					// this.keyboard.close();
				}
				// si el dispositivo no tiene internet muestra la pagina de no internet
				if (err.status == 0) {
					this.showSpinner = false;
					this.app.rootPage = 'NoInternetPage';
				}
			}
			);
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

			this.llenarArrayLoad(position, tamano);

			infiniteScroll.complete();
			if (tamano == this.ferreterias.length) {
				this.enabledInfinite = false;
			}
		}, 500);
	}

	// agregar elementos al array que muestra la informacion el pantalla
	llenarArrayLoad(position, tamano) {
		for (let i = position; i < tamano; i++) {
			this.isOpoen(i);
			// Separa el entero y del numero decimal
			let numero = this.ferreterias[i].puntos;
			let entero = parseInt(this.ferreterias[i].puntos);
			let decimal = 0;
			// si puntos es nullo, puntos = 5
			if(this.ferreterias[i].puntos == null){
				entero = 5;
				numero = 0;
			}else{
				// calcula el numero decumal
				decimal = numero - entero;
			}
			// si decimal < 0.5 no pinte estrella, si decimal es mayor o igual a 0.5 pinta media estrella
			if (decimal < 0.25) {
				decimal = 0
			} else if(decimal >= 0.25 && decimal < 0.75){
				decimal = 1;
			}else if(decimal >= 0.75){
				decimal = 0;
				entero++;
			}

			// llena arrays para recorrerlos en la vista
			let stars = [];
			for (var j = 1; j <= entero; j++) {
				stars.push(j);
			}
			let halfs = [];
			for (var j = 1; j <= decimal; j++) {
				halfs.push(j);
			}
			let outline = [];
			for (var j = 1; j <= 5-entero-decimal; j++) {
				outline.push(j);
			}
			// agrega valores nuevos en el array
			this.ferreterias[i].star = stars;
			this.ferreterias[i].starHalf = halfs;
			this.ferreterias[i].starOutline = outline;

			this.ferreteriaLoad.push(this.ferreterias[i]);
		}
	}

	doRefresh(refresher) {
		this.loadEmpresa(true);
		this.refresher = refresher;
	}
}
