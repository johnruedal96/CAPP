import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { Platform, Searchbar } from 'ionic-angular';
import { WebServiceProvider } from '../../providers/web-service/web-service';

import { Subscription } from 'rxjs/Subscription';
import { Keyboard } from '@ionic-native/keyboard';

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

	// Busquedas
	// indica cuando se realizo una busqueda
	public loadListSearch: boolean = false;
	// suscripcion a los metodos del teclado
	private onHideSubscription: Subscription;
	// muestra/oculta la barra de busqueda en el encabezado
	public busqueda: boolean;
	// array elemtos scroll infinite
	public empresaLoad: any;
	// guarda lo escrito en el input de busqueda
	public txtSearch: string;
	public showSpinner: boolean = true;
	public enabledInfinite: boolean = true;
	public app;

	public refresher;

	@ViewChild('searchbar') searchInput: Searchbar;

	constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public ws: WebServiceProvider, public toastCtrl: ToastController, public platform: Platform, public keyboard: Keyboard) {

		// si ecuentra el parametro, ejecuta la busqueda por el tipo de empresa (combo)
		this.id = navParams.get('id');
		this.app = navParams.get('app');
		this.buscar(false);
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
		this.onHideSubscription = this.keyboard.onKeyboardHide().subscribe(() => this.closeKeyboard());
		this.platform.registerBackButtonAction(() => {
			this.dismiss();
			this.app.buttomBack();
		});
	}

	closeKeyboard() {
		if (!this.loadListSearch) {
			this.busqueda = false;
		}
	}

	dismiss() {
		// cierra la ventana modal, y envia data como parametro a la ventana pdre
		let data = {
			'seleccion': this.seleccion,
			'id': this.id
		};
		this.viewCtrl.dismiss(data);
	}

	buscar(refresh) {
		// busca las empresas segun el id seleccionado
		this.enabledInfinite = true;
		// muestra el 'Cargando' en la vista
		// se la pagina se refresca con el efecto de estirar no se muestra el 'cargando'
		if (!refresh) {
			this.showSpinner = true;
		}
		// carga la informacion del web service
		this.ws.getEmpresas(this.id)
			.subscribe(
			(res) => {
				this.empresas = res.data;
				this.empresaLoad = [];
				this.seleccionView();
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
					this.navCtrl.setRoot('NoInternetPage');
				}
			}
			);
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

				this.empresaLoad = this.empresasAntiguas;
			}
			// seleccionadas = 2
			if (event == 2) {
				this.aplicoFiltro = true;
				this.empresasAntiguas = this.empresas;
				this.empresaLoad = this.seleccion;
			}
		}
	}

	// muestra el input de busqueda y le pone el foco
	inputSearch() {
		this.busqueda = true;
		setTimeout(() => {
			this.searchInput.setFocus();
		}, 300);
	}

	search(event) {
		// si se presiona el boton de buscar (teclado) se ejecuta la funciona
		if (event == 13) {
			this.empresaLoad = [];
			this.loadSearch();
		}
	}

	loadSearch() {
		if (this.txtSearch == '' || this.txtSearch == undefined) {
			this.closeSearch();
		}
		if (this.txtSearch != '' && this.txtSearch != undefined) {
			// mustra el 'cargando' en la vista
			this.showSpinner = true;
			// realiza la busqueda y la muestra en pantalla
			this.loadListSearch = true;
			this.ws.search(this.id, this.txtSearch)
				.subscribe(
				(search) => {
					this.empresas = search.data;
					this.seleccionView();
					this.cargarVista(20, false);
					this.keyboard.close();
				},
				(err) => {
					// si no hay empresas para mostrar
					if (err.status == 400) {
						this.empresas = [];
						this.cargarVista(20, false);
						this.keyboard.close();
					}
					// si el dispositivo no tiene internet muestra la pagina de no internet
					if (err.status == 0) {
						this.showSpinner = false;
						this.navCtrl.setRoot('NoInternetPage');
					}
				}
				);
		}

	}

	seleccionView() {
		for (var i = 0; i < this.empresas.length; i++) {
			for (var j = 0; j < this.seleccion.length; j++) {
				if (this.seleccion[j].id == this.empresas[i].id) {
					this.empresas[i].check = true;
				}
			}
		}
	}
	// Cargar los elementos en la lista
	// numElemtos = numero de elementos a mostrar
	cargarVista(numElemetos, refresh) {
		let num = numElemetos;
		if (this.empresas.length <= num) {
			num = this.empresas.length
		}
		for (var i = 0; i < num; ++i) {
			this.empresaLoad.push(this.empresas[i]);
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

	closeSearch() {
		// si ya se realizo una busqueda, pone el texto del input en blanco
		// oculta la barra de busqueda
		// y carga todas las empresas
		if (this.loadListSearch) {
			this.txtSearch = '';
			this.busqueda = false;
			this.buscar(false);
			this.loadListSearch = false;
		}
	}

	doInfinite(infiniteScroll) {

		setTimeout(() => {
			// numero de elementos cargados en la vista
			let position = this.empresaLoad.length;
			// numero de elementos a agregar en la vista (20)
			let tamano = position + 20;
			// si tamaño es mañor que el array de elementos, tamaño es igual al tamaño del array
			if (tamano > this.empresas.length) {
				tamano = this.empresas.length;
			}

			// agregar elementos al array que muestra la informacion el pantalla
			for (let i = position; i < tamano; i++) {
				this.empresaLoad.push(this.empresas[i]);
			}

			infiniteScroll.complete();
			if (tamano == this.empresas.length) {
				this.enabledInfinite = false;
			}
		}, 500);
	}

}
