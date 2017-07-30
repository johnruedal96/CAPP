import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, Searchbar, Platform } from 'ionic-angular';
import { AlertController, LoadingController } from 'ionic-angular';
import { MyApp } from '../../app/app.component';

// providers
import { AuthProvider } from '../../providers/auth/auth';
import { WebServiceProvider } from '../../providers/web-service/web-service';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';

import { Subscription } from 'rxjs/Subscription';
import { Keyboard } from '@ionic-native/keyboard';

import { TabsPage } from '../tabs/tabs';
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

	@ViewChild('searchbar') searchInput: Searchbar;
	// en cazo que llegue desde la vista de las empresas
	public empresa: any;
	// almacena las empresas seleccioandas
	public empresas: any = [];
	// variable que indica si se va a cotizar una o muchas empresas
	public addEmpresa: boolean = true;
	public tabsCotizacion: string = 'productoTab';
	public imagen: string;

	public producto: any;
	public loader: any;

	public nroRequest: number;
	public nroRequestOk: number;
	public disabledButtonEnviar: boolean = false;

	public showSpinnerEmpresas: boolean = true;
	public auxEmpresas: any = [];
	public busqueda: boolean = false;
	// suscripcion a los metodos del teclado
	private onHideSubscription: Subscription;
	// indica cuando se realizo una busqueda
	public loadListSearch: boolean = false;
	// guarda lo escrito en el input de busqueda
	public txtSearch: string;
	public enabledInfinite: boolean = true;
	public empresasLoad: any = [];
	public refresher;

	constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public alertCtrl: AlertController, public ws: WebServiceProvider, public auth: AuthProvider, public loadingCtrl: LoadingController, public storage: LocalStorageProvider, public app: MyApp, public toastCtrl: ToastController, public keyboard: Keyboard, public platform: Platform) {
		this.storage.productos = [];
		this.empresa = this.navParams.get('empresa');
		let mantenerProductos = this.navParams.get('mantener');
		if (this.empresa != undefined) {
			this.empresa.selected = true;
			this.storage.empresas = [];
			this.storage.empresas.push(this.empresa);
			this.empresasLoad.push(this.empresa);
			this.showSpinnerEmpresas = false;
			this.addEmpresa = false;
			this.storage.empresaId = this.empresa.tipo;
			window.localStorage.setItem('CotizacionEmpresas', JSON.stringify(this.storage.empresas));
			if (mantenerProductos) {
				this.storage.productos = JSON.parse(window.localStorage.getItem('CotizacionLista'));
			} else {
				window.localStorage.setItem('CotizacionLista', JSON.stringify(this.storage.productos));
			}
			window.localStorage.setItem('cotizacionTipoEmpresa', this.storage.empresaId.toLocaleString());
		}
		this.imagen = "http://www.contactoarquitectonico.com.co/capp_admin/archivos/";
	}

	ionViewDidLoad() {
		this.obtenerCotizacionGuardada();
		if (this.addEmpresa) {
			this.loadEmpresa(false);
		}
		// ejecuta la funcion closeSearch() cuando el teclado es cerrado
		this.onHideSubscription = this.keyboard.onKeyboardHide().subscribe(() => this.closeKeyboard());
		let filtro = window.localStorage.getItem('filtro');
		if (filtro != undefined) {
			this.storage.filtro = Boolean(window.localStorage.getItem('filtro') == 'true');
		} else {
			this.storage.filtro = false;
		}
	}

	obtenerCotizacionGuardada() {
		let tipoEmpresaId = window.localStorage.getItem('cotizacionTipoEmpresa');
		if (tipoEmpresaId != null) {
			this.storage.empresaId = Number(tipoEmpresaId);
		}

		let lista = window.localStorage.getItem('CotizacionLista');
		if (lista != null) {
			this.storage.productos = JSON.parse(lista);
		}

		let empresas = window.localStorage.getItem('CotizacionEmpresas');
		if (empresas != null) {
			this.storage.empresas = JSON.parse(empresas);
		}
	}

	showSelectEmpresa(empresas) {
		let alert = this.alertCtrl.create({
			subTitle: 'Seleccione el tipo de empresa',
			inputs: [
				{
					type: 'radio',
					label: 'Ferreterias',
					value: '1',
					handler: (event) => {
						this.dismisAlert(event, alert, empresas);
					}
				},
				{
					type: 'radio',
					label: 'Electricos',
					value: '2',
					handler: (event) => {
						this.dismisAlert(event, alert, empresas);
					}
				}
			],
			buttons: [
				{
					text: 'Cancelar',
					handler: () => {
						this.showSpinnerEmpresas = false;
					}
				}
			]
		});
		alert.present();
	}

	dismisAlert(event, alert, empresas) {
		alert.dismiss();
		this.loadEmpresa(false);
		this.storage.empresaId = event.value;
		window.localStorage.setItem('cotizacionTipoEmpresa', this.storage.empresaId.toLocaleString());
		if (!empresas) {
			this.listarProductos();
		}
	}

	deleteItem(item) {
		this.storage.productos.find((element, index) => {
			if (element == item) {
				this.storage.productos.splice(index, 1);
			}
		});
		window.localStorage.setItem('CotizacionLista', JSON.stringify(this.storage.productos));
	}

	selectEmpresa(empresa) {
		if (this.storage.empresas.length == 5 && !empresa.selected) {
			this.toastCtrl.create({
				message: 'Ha seleccionado el máximo de empresas',
				duration: 3000
			}).present();
		}

		if (empresa.selected) {
			this.storage.empresas.find((element, index) => {
				if (element.id == empresa.id) {
					this.storage.empresas.splice(index, 1);
					empresa.selected = false;
				}
			})
		} else {
			if (this.storage.empresas.length < 5) {
				this.storage.empresas.push(empresa);
				empresa.selected = true;
			}
		}

		window.localStorage.setItem('CotizacionEmpresas', JSON.stringify(this.storage.empresas));
	}

	listarProductos() {
		if (this.storage.empresaId != undefined && this.storage.empresaId != 0) {
			let param = {
				id: this.storage.empresaId,
				app: this.app
			}
			let productoModal = this.modalCtrl.create('ListaProductosPage', param);
			productoModal.onDidDismiss(data => {
				if (data != undefined) {
					let item = {
						cantidad: data.cantidad,
						producto: data.producto,
						unidad: data.unidad
					};
					this.storage.productos.push(item);
					window.localStorage.setItem('CotizacionLista', JSON.stringify(this.storage.productos));
				}
			});
			productoModal.present();
		} else {
			this.showSelectEmpresa(false);
			this.storage.filtro = false;
		}
	}

	alertCotizacionEmpresa() {
		this.disabledButtonEnviar = true;
		if (this.storage.empresas.length > 0) {
			this.enviarCotizacion();
		} else {
			this.disabledButtonEnviar = false;
			let alert = this.alertCtrl.create({
				title: 'Error',
				message: 'Seleccione minimo una empresa',
				buttons: [
					{
						text: 'Aceptar',
						handler: () => {
							this.tabsCotizacion = 'empresaTab';
						}
					}
				]
			})
			alert.present();
			setTimeout(() => {
				let hdr = alert.instance.hdrId;
				let desc = alert.instance.descId;
				let head = window.document.getElementById(hdr);
				let msg = window.document.getElementById(desc);
				head.style.textAlign = 'center';
				msg.style.textAlign = 'center';
				head.innerHTML = '<ion-icon name="warning" style="color:#f0ad4e; text-aling:center; font-size: 3em !important" role="img" class="icon icon-md ion-md-warning" aria-label="warning" ng-reflect-name="warning"></ion-icon>';
			}, 100)
		}
	}

	alertCotizacionProducto() {
		this.disabledButtonEnviar = true;
		if (this.storage.productos.length > 0) {
			this.enviarCotizacion();
		} else {
			this.disabledButtonEnviar = false;
			let alert = this.alertCtrl.create({
				title: 'Error',
				message: 'Ningun producto seleccionado',
				buttons: [
					{
						text: 'Aceptar',
						handler: () => {
							this.tabsCotizacion = 'productoTab';
						}
					}
				]
			})
			alert.present();
			setTimeout(() => {
				let hdr = alert.instance.hdrId;
				let desc = alert.instance.descId;
				let head = window.document.getElementById(hdr);
				let msg = window.document.getElementById(desc);
				head.style.textAlign = 'center';
				msg.style.textAlign = 'center';
				head.innerHTML = '<ion-icon name="warning" style="color:#f0ad4e; text-aling:center; font-size: 3em !important" role="img" class="icon icon-md ion-md-warning" aria-label="warning" ng-reflect-name="warning"></ion-icon>';
			}, 100)
		}
	}

	enviarCotizacion() {
		this.loader = this.loadingCtrl.create({
			content: 'Enviando Cotización'
		});

		this.loader.present();
		this.auth.getToken()
			.subscribe(
			(token) => {
				let data = {
					usuario: this.auth.user,
					lista: this.storage.productos,
					empresas: this.storage.empresas
				}
				this.nroRequestOk = 0;
				this.nroRequest = this.storage.productos.length + this.storage.empresas.length;
				this.sendCotizacionWs(data, token.text());
			},
			(err) => {
				let alert = this.alertCtrl.create({
					title: 'Error',
					message: 'La cotización no se ha enviado',
					buttons: ['Aceptar']
				})
				alert.present();
				setTimeout(() => {
					let hdr = alert.instance.hdrId;
					let desc = alert.instance.descId;
					let head = window.document.getElementById(hdr);
					let msg = window.document.getElementById(desc);
					head.style.textAlign = 'center';
					msg.style.textAlign = 'center';
					head.innerHTML = '<ion-icon name="warning" style="color:#f0ad4e; text-aling:center; font-size: 3em !important" role="img" class="icon icon-md ion-md-warning" aria-label="warning" ng-reflect-name="warning"></ion-icon>';
				}, 100)

			}
			)
	}

	sendCotizacionWs(data, token) {
		this.ws.sendCotizacion(data, token)
			.subscribe(
			(res) => {
				let cotizacion = res.json();
				let params;
				for (var i = 0; i < data.lista.length; i++) {
					params = 'cantidad=' + data.lista[i].cantidad;
					params += '&idProducto=' + data.lista[i].producto.id;
					params += '&idCotizacion=' + cotizacion.id;
					params += '&unidad=' + data.lista[i].unidad.id;
					this.saveCotizacionProducto(params, token);
				}

				for (var i = 0; i < data.empresas.length; i++) {
					params = 'idCliente=' + data.empresas[i].id;
					params += '&idCotizacion=' + cotizacion.id;
					this.saveCotizacionCliente(params, token);
				}
			},
			(err) => {
				this.showAlert();
			}
			)
	}

	showAlert() {
		let alert = this.alertCtrl.create({
			title: 'Error',
			subTitle: 'La cotización no se ha enviado',
			buttons: [{
				text: 'OK',
				role: 'cancel',
				handler: () => {
					this.loader.dismiss();
				}
			}]
		});
		alert.present();
	}

	saveCotizacionProducto(params, token) {
		this.ws.saveCotizacionProducto(params, token)
			.subscribe(
			(res) => {
				this.nroRequestOk++;
				if (this.nroRequest == this.nroRequestOk) {
					let title = 'Cotización enviada';
					let subTitle = 'Cotización enviada';
					this.showAlertCotizacionEnviada(title, subTitle);
				}
			},
			(err) => {
				let title = 'Cotización enviada con errores';
				let subTitle = 'Ha ocurrido un error en el proceso de envio, la cotización se ha enviado incompleta';
				this.showAlertCotizacionEnviada(title, subTitle);
			}
			)
	}

	saveCotizacionCliente(params, token) {
		this.ws.saveCotizacionCliente(params, token)
			.subscribe(
			(res) => {
				this.nroRequestOk++;
				if (this.nroRequest == this.nroRequestOk) {
					let title = 'Cotización enviada';
					let subTitle = 'Cotización enviada';
					this.showAlertCotizacionEnviada(title, subTitle);
				}
			},
			(err) => {
				let title = 'Cotización enviada con errores';
				let subTitle = 'Ha ocurrido un error en el proceso de envio, la cotización se ha enviado incompleta';
				this.showAlertCotizacionEnviada(title, subTitle);
			}
			)
	}

	verificarProducto() {
		if (this.producto != null) {
			this.storage.productos.find((element, index) => {
				if (element.producto.id == this.producto.id) {
					let alert = this.alertCtrl.create({
						title: 'Error',
						subTitle: 'El producto ya fue agregado a la lista',
						buttons: [
							{
								text: 'Aceptar',
								handler: () => {
									this.listarProductos();
								}
							}
						]
					});
					alert.present();
				}
			})
		}
	}

	showAlertCotizacionEnviada(title, subTitle) {
		this.storage.filtro = false;
		this.loader.dismiss();
		let alert = this.alertCtrl.create({
			title: title,
			message: subTitle,
			buttons: ['Aceptar']
		})
		alert.present();
		setTimeout(() => {
			let hdr = alert.instance.hdrId;
			let desc = alert.instance.descId;
			let head = window.document.getElementById(hdr);
			let msg = window.document.getElementById(desc);
			head.style.textAlign = 'center';
			msg.style.textAlign = 'center';
			head.innerHTML = '<ion-icon name="checkmark" style="color:#5cb85c; text-aling:center; font-size: 3em !important" role="img" class="icon icon-md ion-md-checkmark" aria-label="checkmark" ng-reflect-name="checkmark"></ion-icon>';
		}, 100)

		this.storage.productos = [];
		this.storage.empresas = [];
		this.storage.empresaId = 0;
		this.empresasLoad = [];
		this.auxEmpresas = [];
		window.localStorage.removeItem('CotizacionLista');
		window.localStorage.removeItem('CotizacionEmpresas');
		window.localStorage.removeItem('cotizacionTipoEmpresa');
		this.disabledButtonEnviar = false;
		this.app.nav.setRoot(TabsPage);
	}

	eliminarSeleccion(empresa) {
		this.storage.empresas.find((item, index) => {
			if (item == empresa) {
				this.storage.empresas.splice(index, 1);
				window.localStorage.setItem('CotizacionEmpresas', JSON.stringify(this.storage.empresas));
			}
		})
	}

	cancelarCotizacion() {
		let alert = this.alertCtrl.create({
			title: 'alert',
			message: 'Se cancelará la cotización',
			cssClass: 'alert-icon',
			buttons: [
				{
					text: 'NO Cancelar',
					role: 'cancel'
				},
				{
					text: 'Cancelar',
					handler: (event) => {
						this.storage.empresaId = 0;
						this.storage.empresas = [];
						this.storage.productos = [];
						this.empresasLoad = [];
						this.auxEmpresas = [];
						this.storage.filtro = false;
						window.localStorage.removeItem('CotizacionLista');
						window.localStorage.removeItem('CotizacionEmpresas');
						window.localStorage.removeItem('cotizacionTipoEmpresa');
						window.localStorage.setItem('filtro', 'false');
						if (!this.addEmpresa) {
							this.app.nav.setRoot(TabsPage);
						} else {
							if (this.tabsCotizacion == 'empresaTab') {
								this.scroll({ scrollTop: 0 });
							}
						}
					}
				}
			]
		})
		alert.present();
		setTimeout(() => {
			let hdr = alert.instance.hdrId;
			let desc = alert.instance.descId;
			let head = window.document.getElementById(hdr);
			let msg = window.document.getElementById(desc);
			head.style.textAlign = 'center';
			msg.style.textAlign = 'center';
			head.innerHTML = '<ion-icon name="warning" style="color:#f0ad4e; text-aling:center; font-size: 3em !important" role="img" class="icon icon-md ion-md-warning" aria-label="warning" ng-reflect-name="warning"></ion-icon>';
		}, 100)
		// div.
	}

	changeCantidad(eliminar, item) {
		this.storage.productos.find((element, index) => {
			if (element == item) {
				if (eliminar) {
					if (element.cantidad > 1) {
						element.cantidad--;
					}
				} else {
					element.cantidad++;
				}
			}
		});

		window.localStorage.setItem('CotizacionLista', JSON.stringify(this.storage.productos));
	}

	aplicarFiltro(filtro) {
		this.storage.filtro = filtro;
		window.localStorage.setItem('filtro', this.storage.filtro.toString());
		if (!this.storage.filtro) {
			if (this.auxEmpresas.length > 0) {
				this.empresasLoad = this.auxEmpresas;
			}
		} else {
			if (this.storage.empresas.length > 0) {
				this.auxEmpresas = this.empresasLoad;
				this.empresasLoad = this.storage.empresas;
			} else {
				this.storage.filtro = false;
				this.toastCtrl.create({
					message: 'Seleccione minimo una empresa',
					duration: 3000
				}).present();
			}
		}
		this.scroll({ scrollTop: 0 });
	}

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

	loadEmpresa(refresh) {
		if (this.storage.empresaId != 0) {
			this.enabledInfinite = true;
			// muestra el 'Cargando' en la vista
			// se la pagina se refresca con el efecto de estirar no se muestra el 'cargando'
			if (!refresh) {
				this.showSpinnerEmpresas = true;
			}
			// carga la informacion del web service
			this.ws.getEmpresas(this.storage.empresaId)
				.subscribe(
				(res) => {
					this.empresas = res.data;
					this.empresasLoad = [];
					this.cargarVista(30, refresh);
					this.aplicarFiltro(this.storage.filtro);
				},
				(err) => {
					if (!refresh) {
						// this.loader.dismiss();
						this.showSpinnerEmpresas = false;
					} else {
						this.refresher.complete();
					}

					if (err.status == 0) {
						this.app.rootPage = 'NoInternetPage';
					}
				}
				);
		}
	}

	cargarVista(numElemetos, refresh) {
		let num = numElemetos;
		if (this.empresas.length <= num) {
			num = this.empresas.length
		}
		for (var i = 0; i < num; ++i) {
			for (let e of this.storage.empresas) {
				this.empresas.find((element, index) => {
					if (element.id == e.id) {
						element.selected = true;
					}
				})
			}
			this.empresasLoad.push(this.empresas[i]);
		}

		if (refresh) {
			this.refresher.complete();
			this.txtSearch = '';
			this.busqueda = false;
			this.loadListSearch = false;
		} else {
			// oculta el 'cargando' de la vista
			this.showSpinnerEmpresas = false;
		}
	}

	doInfinite(infiniteScroll) {

		setTimeout(() => {
			// numero de elementos cargados en la vista
			let position = this.empresasLoad.length;
			// numero de elementos a agregar en la vista (20)
			let tamano = position + 20;
			// si tamaño es mañor que el array de elementos, tamaño es igual al tamaño del array
			if (tamano > this.empresas.length) {
				tamano = this.empresas.length;
			}

			// agregar elementos al array que muestra la informacion el pantalla
			for (let i = position; i < tamano; i++) {
				this.empresasLoad.push(this.empresas[i]);
			}

			infiniteScroll.complete();
			if (tamano == this.empresas.length) {
				this.enabledInfinite = false;
			}
		}, 500);
	}

	search(event) {
		this.empresasLoad = [];
		this.showSpinnerEmpresas = true;
		// realiza la busqueda y la muestra en pantalla
		this.loadListSearch = true;
		this.ws.search(1, this.txtSearch)
			.subscribe(
			(search) => {
				this.empresas = search.data;
				this.empresasLoad = [];
				this.cargarVista(30, false);
				this.keyboard.close();
			},
			(err) => {
				// si no hay empresas para mostrar
				if (err.status == 400) {
					this.empresas = [];
					this.empresasLoad = [];
					this.cargarVista(30, false);
					this.keyboard.close();
				}
				// si el dispositivo no tiene internet muestra la pagina de no internet
				if (err.status == 0) {
					this.showSpinnerEmpresas = false;
					this.app.rootPage = 'NoInternetPage';
				}
			}
			);
	}

	scroll(e) {
		if (this.tabsCotizacion == 'empresaTab') {
			let top = document.getElementById('btnListoFixed');
			if (e.scrollTop < 43) {
				top.style.position = 'relative';
				top.style.top = '0px';
			}
			if (e.scrollTop >= 43) {
				top.style.position = 'fixed';
				top.style.zIndex = '2';
				top.style.width = '100%';
				top.style.top = '50px';
			}
		}
	}
}
