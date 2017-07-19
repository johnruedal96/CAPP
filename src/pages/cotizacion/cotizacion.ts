import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AlertController, LoadingController } from 'ionic-angular';
import { MyApp } from '../../app/app.component';

// providers
import { AuthProvider } from '../../providers/auth/auth';
import { WebServiceProvider } from '../../providers/web-service/web-service';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
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
	public id: number = 0;
	// llega del modal lista-empresas variable que guarda los empresas (empresas)
	public empresas: any = [];
	// variable que indica si se va a cotizar una o muchas empresas
	public addEmpresa: boolean = true;
	public tabsCotizacion: string = 'productoTab';
	public tipoEmpresaIdAntigua: number;
	public time: number = 0;
	public imagen: string;
	public selectOptions: any;

	public productos: any;
	public producto: any;
	public tipoEmpresa: boolean = false;
	public loader: any;

	public nroRequest: number;
	public nroRequestOk: number;
	public disabledButtonEnviar: boolean = false;

	constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public alertCtrl: AlertController, public ws: WebServiceProvider, public auth: AuthProvider, public loadingCtrl: LoadingController, public storage: LocalStorageProvider, public app: MyApp) {
		this.storage.productos = [];
		this.productos = [];
		this.empresa = this.navParams.get('empresa');
		let mantenerProductos = this.navParams.get('mantener');
		if (this.empresa != undefined) {
			this.storage.empresas = [];
			this.storage.empresas.push(this.empresa);
			this.addEmpresa = false;
			this.tipoEmpresa = true;
			this.storage.empresaId= this.empresa.tipo;
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
	}

	obtenerCotizacionGuardada() {
		let tipoEmpresaId= window.localStorage.getItem('cotizacionTipoEmpresa');
		if (tipoEmpresaId!= null) {
			this.storage.empresaId= Number(tipoEmpresaId);
			this.time++;
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

	presentEmpresaModal() {
		if (this.storage.empresaId!= undefined) {
			let param = {
				empresas: this.storage.empresas,
				id: this.storage.empresaId,
				app: this.app
			}
			let profileModal = this.modalCtrl.create('ListaEmpresasPage', param);
			profileModal.onDidDismiss(data => {
				this.storage.empresas = data.seleccion;
				window.localStorage.setItem('CotizacionEmpresas', JSON.stringify(this.storage.empresas));
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
		this.storage.productos.push(item);
		this.producto = null;
		this.cantidad = '';
		window.localStorage.setItem('CotizacionLista', JSON.stringify(this.storage.productos));
	}

	deleteItem(item) {
		this.storage.productos.find((element, index) => {
			if (element == item) {
				this.storage.productos.splice(index, 1);
			}
		});
		window.localStorage.setItem('CotizacionLista', JSON.stringify(this.storage.productos));
	}

	goToEmpresa(empresa) {
		let params = {
			empresa: empresa,
			viewBtnCotizacion: false
		}
		this.navCtrl.push('EmpresaPage', params);
	}

	listarProductos() {
		if (this.storage.empresaId!= undefined) {
			let param = {
				id: this.storage.empresaId,
				app: this.app
			}
			let productoModal = this.modalCtrl.create('ListaProductosPage', param);
			productoModal.onDidDismiss(data => {
				let producto = null;
				if (data != null) {
					producto = data.producto;
				}
				if (data == null && this.producto != null) {
					// producto = this.producto;
				}
				this.producto = producto;
				this.verificarProducto();
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

	alertCotizacion() {
		this.disabledButtonEnviar = true;
		if (this.storage.empresas.length > 0) {
			let alert = this.alertCtrl.create({
				title: 'Comfirmar envio',
				message: 'El tiempo de entrega y el valor del domicilio para cada zona es responsabilidad de la ferreteria. <br><br> <b>CAPP</b> es totalmente gratuito no cobra por el servicio',
				buttons: [
					{
						text: 'Cancelar',
						role: 'cancel',
						handler: ()=>{
							this.disabledButtonEnviar = false;
						}
					},
					{
						text: 'Enviar',
						handler: () => {
							this.enviarCotizacion();
						}
					}
				]
			});
			alert.present();
		} else {
			this.disabledButtonEnviar = false;
			let alert = this.alertCtrl.create({
				title: 'Error',
				message: 'Seleccione minimo una empresa',
				buttons: [
					{
						text: 'Aceptar',
						role: 'cancel',
					}
				]
			});
			alert.present();
		}
	}

	enviarCotizacion() {
		this.auth.getToken()
			.subscribe(
			(token) => {
				let data = {
					usuario: this.auth.user,
					lista: this.storage.productos,
					empresas: this.storage.empresas,
				}
				this.nroRequestOk = 0;
				this.nroRequest = this.storage.productos.length + this.storage.empresas.length;
				this.sendCotizacionWs(data, token.text());
			},
			(err) => {
				let alert = this.alertCtrl.create({
					title: 'Error',
					subTitle: 'La cotización no se ha enviado',
					buttons: ['Aceptar']
				});
				alert.present();
			}
			)
	}

	sendCotizacionWs(data, token) {
		this.loader = this.loadingCtrl.create({
			content: 'Enviando Cotización'
		});

		this.loader.present();
		this.ws.sendCotizacion(data, token)
			.subscribe(
			(res) => {
				let cotizacion = res.json();
				let params;
				for (var i = 0; i < data.lista.length; i++) {
					params = 'cantidad=' + data.lista[i].cantidad;
					params += '&idProducto=' + data.lista[i].producto.id;
					params += '&idCotizacion=' + cotizacion.id;
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
					let subTitle = '';
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
					let subTitle = '';
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

	changeTipo(event) {
		if (this.time > 0) {
			if (this.storage.productos.length > 0 || this.storage.empresas.length > 0) {
				let alert = this.alertCtrl.create({
					title: '¿Desa continuar?',
					subTitle: 'Se borraran los productos agregados a la lista y las empresas seleccionadas',
					buttons: [
						{
							text: 'No',
							role: 'cancel',
							handler: () => {
								this.storage.empresaId= this.tipoEmpresaIdAntigua;
								this.time = 0;
							}
						},
						{
							text: 'Si',
							handler: () => {
								this.storage.productos = [];
								this.storage.empresas = [];
								localStorage.removeItem('CotizacionLista');
								localStorage.removeItem('CotizacionEmpresas');
								this.tipoEmpresaIdAntigua = event;
							}
						}
					]
				})
				alert.present();
			}
		} else {
			this.tipoEmpresaIdAntigua = event;
			this.time++;
		}
		window.localStorage.setItem('cotizacionTipoEmpresa', this.storage.empresaId.toLocaleString());
	}

	showAlertCotizacionEnviada(title, subTitle) {
		this.loader.dismiss();
		let alert = this.alertCtrl.create({
			title: title,
			subTitle: subTitle,
			buttons: ['Aceptar']
		});
		alert.present();
		this.storage.productos = [];
		this.storage.empresas = [];
		window.localStorage.removeItem('CotizacionLista');
		window.localStorage.removeItem('CotizacionEmpresas');
		this.time = 0;
		this.disabledButtonEnviar = false;
	}

	eliminarSeleccion(empresa) {
		this.storage.empresas.find((item, index) => {
			if (item == empresa) {
				this.storage.empresas.splice(index, 1);
				window.localStorage.setItem('CotizacionEmpresas', JSON.stringify(this.storage.empresas));
			}
		})
	}

}
