import { Component, ElementRef, Renderer, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { ActionSheetController, AlertController, LoadingController } from 'ionic-angular';
import { Content } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';
import { WebServiceProvider } from '../../providers/web-service/web-service';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';

import { Camera } from '@ionic-native/camera';
import { File, FileEntry } from '@ionic-native/file';

/**
 * Generated class for the PerfilPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
	selector: 'page-perfil',
	templateUrl: 'perfil.html',
})
export class PerfilPage {

	public myProfile: string;
	public seleccionCompra: number;
	public cotizaciones: any;
	public compras: any;
	public showSpinner: boolean;
	public showSpinnerCompras: boolean;

	public cotizacionAntigua: any;
	public contadorCotizaciones: any;
	public idShowCotizacion: any;

	public email: string;
	public nombreUsuario: string;
	public password: string = '';
	public passwordConfirm: string = '';
	public loader;

	@ViewChild(Content) content: Content;

	constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public auth: AuthProvider, public ws: WebServiceProvider, public modalCtrl: ModalController, public element: ElementRef, public renderer: Renderer, public storage: LocalStorageProvider, public camera: Camera, public file: File, public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
		this.cotizaciones = [];
		this.compras = [];
		this.myProfile = this.navParams.get('tab');
		if (this.myProfile == null) {
			this.myProfile = 'perfil';
		}
		this.seleccionCompra = this.navParams.get('compra');
	}

	ionViewDidLoad() {
		this.email = this.auth.user.email;
		this.nombreUsuario = this.auth.user.nombre;
		this.searchCotizacion();
		this.getCompras();
		if (!this.storage.desarrollo) {
			this.isLogged();
		}
	}

	isLogged() {
		if (!this.auth.loginFacebookGoogle) {
			this.auth.isLogged()
				.subscribe(res => {
					if (res.text() == '') {
						this.navCtrl.setRoot('LoginPage');
					} else {
						this.auth.user = JSON.parse(res.text());
					}
				});
		}else{
			this.auth.getCredencialesFacebook(this.navCtrl);
		}
	}

	searchCotizacion() {
		this.showSpinner = true;
		this.cotizaciones = [];
		this.ws.searchCotizacionUsuario(this.auth.user.id)
			.subscribe(
			(res) => {
				this.cotizaciones = this.formatDate(res.json());
				this.showSpinner = false;
			},
			(err) => {
				console.log(err);
			}
			)
	}

	showCotizacionList(item) {
		if (this.idShowCotizacion != item.cotizacion) {
			this.idShowCotizacion = item.cotizacion;
		} else {
			this.idShowCotizacion = 0;
		}
	}

	formatDate(array) {
		let lista = array;
		let options = { weekday: "short", year: "numeric", month: "long", day: "numeric" };
		let cotizacionAntigua = 0;
		let contador = 1;
		for (let item of lista) {
			if (item.cotizacion != cotizacionAntigua) {
				cotizacionAntigua = item.cotizacion;
				item.encabezado = true;
				item.contador = contador;
				contador++;
			} else {
				item.encabezado = false;
			}
			let fecha = new Date(item.fecha);
			item.fechaFormat = fecha.toLocaleDateString('es-ES', options);
		}
		return lista;
	}

	getCompras() {
		this.showSpinnerCompras = true;
		this.compras = [];
		this.ws.getCompras(this.auth.user.id)
			.subscribe(
			(res) => {
				this.compras = this.formatDate(res.json());
				this.showSpinnerCompras = false;
				if (this.seleccionCompra != null) {
					this.aplicarColor();
				}
			}
			)
	}

	verCotizacion(cotizacion) {
		let params = {
			id: cotizacion.cotizacion,
			fecha: cotizacion.fecha,
			empresa: cotizacion.cliente,
			estado: cotizacion.estado,
			estadoId: cotizacion.estadoid,
			clienteId: cotizacion.clienteid
		}
		this.navCtrl.push('ListaCotizacionPage', params);
	}

	verCompra(compra) {
		this.navCtrl.push('ListaCompraPage', compra);
	}

	aplicarColor() {
		let seleccionCompra = this.seleccionCompra.toLocaleString();
		this.myProfile = 'compras';
		let content;
		setTimeout(() => {
			content = document.getElementById(seleccionCompra);
			let coors = content.getBoundingClientRect();
			this.content.scrollTo(coors.top, coors.top)
			// window.scrollTo(coors.top, 0);
			if (content != null) {
				content.style.setProperty('transition', 'background-color 2s');
				content.style.setProperty('background-color', 'red');
			}
		}, 750);

		setTimeout(() => {
			if (content != null) {
				content.style.setProperty('transition', 'background-color 2s');
				content.style.setProperty('background-color', 'white');
				this.seleccionCompra = null;
			}
		}, 5000);
	}

	takePhoto() {
		this.camera.getPicture({
			quality: 100,
			destinationType: this.camera.DestinationType.FILE_URI,
			sourceType: this.camera.PictureSourceType.CAMERA,
			encodingType: this.camera.EncodingType.JPEG,
			saveToPhotoAlbum: false,
			targetWidth: 500,
			targetHeight: 500,
			correctOrientation: true,
		}).then(imageData => {
			this.auth.imagen = imageData;
			this.uploadPhoto(imageData);
		}, error => {
			console.log(JSON.stringify(error));
		});
	}

	selectPhoto(): void {
		this.camera.getPicture({
			sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
			destinationType: this.camera.DestinationType.FILE_URI,
			quality: 100,
			encodingType: this.camera.EncodingType.JPEG,
			targetWidth: 500,
			targetHeight: 500,
		}).then(imageData => {
			this.auth.imagen = imageData;
			this.uploadPhoto(imageData);
		}, error => {
			console.log(JSON.stringify(error));
		});
	}

	uploadPhoto(imageFileUri: any): void {
		this.file.resolveLocalFilesystemUrl(imageFileUri)
			.then(entry => (<FileEntry>entry).file(file => this.readFile(file)))
			.catch(err => console.log(err));
	}

	readFile(file: any) {
		const reader = new FileReader();
		reader.onloadend = () => {
			const formData = new FormData();
			const imgBlob = new Blob([reader.result], { type: file.type });
			formData.append('file', imgBlob, file.name);
			this.postData(formData);
		};
		reader.readAsArrayBuffer(file);
	}

	postData(formData: FormData) {
		this.ws.uploadImage(formData, this.auth.user.id)
			.subscribe(ok => ok);
	}

	showSheet() {
		let actionSheet = this.actionSheetCtrl.create({
			buttons: [
				{
					text: 'Tomar foto',
					icon: 'camera',
					handler: () => {
						this.takePhoto();
					}
				},
				{
					text: 'Seleccionar foto desde galeria',
					icon: 'md-photos',
					handler: () => {
						this.selectPhoto();
					}
				},
				{
					text: 'Cancelar',
					role: 'cancel'
				}
			]
		});

		actionSheet.present();
	}


	editar() {
		if (this.password.length > 0 || this.passwordConfirm.length > 0) {
			if (this.password == this.passwordConfirm) {
				this.enviarDatosNuevos(true);
			} else {
				this.toastCtrl.create({
					message: 'Las contraseñas no coinciden',
					duration: 3000,
				}).present();
			}
		} else {
			this.enviarDatosNuevos(false);
		}
	}

	enviarDatosNuevos(password) {
		this.nombreUsuario = this.auth.user.nombre;
		this.email = this.auth.user.email;
		this.loader = this.loadingCtrl.create({
			content: 'Actualizando datos'
		});
		this.loader.present();
		this.auth.getToken()
			.subscribe(
			(res) => {
				let params = 'id=' + this.auth.user.id;
				params += '&nombre=' + this.auth.user.nombre;
				params += '&email=' + this.auth.user.email;
				if (password) {
					params += '&password=' + this.password;
				}
				this.auth.actualizarDatos(res.text(), params)
					.subscribe(
					(res) => {
						this.showAlertConfirm();
					},
					(err) => {
						console.log(err);
					}
					)
			},
			(err) => {
				console.log(err);
			}
			)
	}

	showAlertConfirm() {
		this.loader.dismiss();
		let alert = this.alertCtrl.create({
			title: 'alert',
			message: 'Datos actualizados',
			cssClass: 'alert-icon',
			buttons: [
				{
					text: 'Aceptar',
					role: 'cancel'
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
			head.innerHTML = '<ion-icon name="checkmark" style="color:#5fb471; text-aling:center; font-size: 3em !important" role="img" class="icon icon-md ion-md-checkmark" aria-label="checkmark" ng-reflect-name="checkmark"></ion-icon>';
		}, 100)
	}
}