import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AlertController, LoadingController } from 'ionic-angular';

// providers
import { AuthProvider } from '../../providers/auth/auth';
import { WebServiceProvider } from '../../providers/web-service/web-service';
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

	constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public alertCtrl: AlertController, public ws: WebServiceProvider, public auth: AuthProvider, public loadingCtrl: LoadingController) {
		this.lista = [];
		this.productos = [];
		this.empresa = this.navParams.get('empresa');
		if (this.empresa != undefined) {
			this.empresas.push(this.empresa);
			this.addEmpresa = false;
			this.tipoEmpresa = true;
			this.tipoEmpresaId = this.empresa.tipo;
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
	}

	goToEmpresa(empresa) {
		let params = {
			empresa: empresa,
			viewBtnCotizacion: false
		}
		this.navCtrl.push('EmpresaPage', params);
	}

	listarProductos() {
		if (this.tipoEmpresaId != undefined) {
			let param = {
				id: this.tipoEmpresaId,
			}
			let productoModal = this.modalCtrl.create('ListaProductosPage', param);
			productoModal.onDidDismiss(data => {
				this.producto = data.producto;
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
		if (this.empresas.length > 0) {
			let alert = this.alertCtrl.create({
				title: 'Comfirmar envio',
				message: 'El tiempo de entrega y el valor del domicilio para cada zona es responsabilidad de la ferreteria. <br><br> <b>CAPP</b> es totalmente gratuito no cobra por el servicio',
				buttons: [
					{
						text: 'Cancelar',
						role: 'cancel',
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
					lista: this.lista,
					empresas: this.empresas,
				}
				this.nroRequestOk = 0;
				this.nroRequest = this.lista.length + this.empresas.length;
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
			this.lista.find((element, index) => {
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
			if (this.lista.length > 0 || this.empresas.length > 0) {
				let alert = this.alertCtrl.create({
					title: '¿Desa continuar?',
					subTitle: 'Se borraran los productos agregados a la lista y las empresas seleccionadas',
					buttons: [
						{
							text: 'No',
							role: 'cancel',
							handler: () => {
								this.tipoEmpresaId = this.tipoEmpresaIdAntigua;
								this.time = 0;
							}
						},
						{
							text: 'Si',
							handler: () => {
								this.lista = [];
								this.empresas = [];
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
	}

	showAlertCotizacionEnviada(title, subTitle) {
		this.loader.dismiss();
		let alert = this.alertCtrl.create({
			title: title,
			subTitle: subTitle,
			buttons: ['Aceptar']
		});
		alert.present();
		this.lista = [];
		this.empresas = [];
		this.time = 0;
		this.disabledButtonEnviar = false;
	}

}
