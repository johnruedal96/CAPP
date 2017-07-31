import { Component, ElementRef, Renderer, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
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

	public urlImagen: string = 'http://www.contactoarquitectonico.com.co/capp_admin/archivos/perfiles/img_user/';
	public myProfile: string;
	public seleccionCompra: number;
	public cotizaciones: any;
	public compras: any;
	public editarCampos: boolean = false;
	public showSpinner: boolean;
	public showSpinnerCompras: boolean;

	public cotizacionAntigua: any;
	public contadorCotizaciones: any;
	public idShowCotizacion: any;

	@ViewChild(Content) content: Content;

	constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public auth: AuthProvider, public ws: WebServiceProvider, public modalCtrl: ModalController, public element: ElementRef, public renderer: Renderer, public storage: LocalStorageProvider, public camera: Camera, public file: File) {
		this.cotizaciones = [];
		this.compras = [];
		this.myProfile = this.navParams.get('tab');
		if (this.myProfile == null) {
			this.myProfile = 'perfil';
		}
		this.seleccionCompra = this.navParams.get('compra');
	}

	ionViewDidLoad() {
		this.searchCotizacion();
		this.getCompras();
		if (!this.storage.desarrollo) {
			this.isLogged();
		}
	}

	isLogged() {
		this.auth.isLogged()
			.subscribe(res => {
				if (res.text() == '') {
					this.navCtrl.setRoot('LoginPage');
				} else {
					this.auth.user = JSON.parse(res.text());
				}
			});
	}

	editar() {
		this.editarCampos = !this.editarCampos;
		if (this.editarCampos) {
			this.presentToast(3000, 'Ahora puede editar sus datos');
		}
	}

	presentToast(time, message) {
		let toast = this.toastCtrl.create({
			message: message,
			duration: time
		});

		toast.present();
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
				console.log(this.compras);
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
			encodingType: this.camera.EncodingType.PNG,
			saveToPhotoAlbum: true
		}).then(imageData => {
			console.log(imageData);
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
			encodingType: this.camera.EncodingType.PNG,
		}).then(imageData => {
			console.log(imageData);
			this.uploadPhoto(imageData);
		}, error => {
			console.log(JSON.stringify(error));
		});
	}
	private uploadPhoto(imageFileUri: any): void {
		this.file.resolveLocalFilesystemUrl(imageFileUri)
			.then(entry => (<FileEntry>entry).file(file => this.readFile(file)))
			.catch(err => console.log(err));
	}

	private readFile(file: any) {
		const reader = new FileReader();
		reader.onloadend = () => {
			const formData = new FormData();
			const imgBlob = new Blob([reader.result], { type: file.type });
			console.log(imgBlob);
			formData.append('file', imgBlob, file.name);
			this.postData(formData);
		};
		reader.readAsArrayBuffer(file);
	}

	private postData(formData: FormData) {
		this.ws.uploadImage(formData, this.auth.user.id)
			.subscribe(ok => console.log('ya'));
	}
}
