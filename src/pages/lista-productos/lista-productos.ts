import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Searchbar, LoadingController, Content, ToastController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { WebServiceProvider } from '../../providers/web-service/web-service';
import { AuthProvider } from '../../providers/auth/auth';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { Keyboard } from '@ionic-native/keyboard';
import { Subscription } from 'rxjs/Subscription';
import { Platform } from 'ionic-angular';
/**
 * Generated class for the ListaProductosPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-lista-productos',
  templateUrl: 'lista-productos.html',
})
export class ListaProductosPage {
  public id: number;
  public productos: any;
  public tamaño: number = 50;
  public tamañoBusqueda: number = 50;
  public rango: number = 50;
  public busqueda: boolean = false;
  // indica cuando se realizo una busqueda
  public loadListSearch: boolean = false;
  // suscripcion a los metodos del teclado
  private onHideSubscription: Subscription;
  // guarda lo escrito en el input de busqueda
  public txtSearch: string;
  public showSpinner: boolean = true;
  public app: any;

  @ViewChild('searchbar') searchInput: Searchbar;
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public ws: WebServiceProvider, public keyboard: Keyboard, public loadingCtrl: LoadingController, public platform: Platform, public auth: AuthProvider, public modalCtrl: ModalController, public storage: LocalStorageProvider, public toastCtrl: ToastController) {
    this.id = this.navParams.get('id');
    this.app = this.navParams.get('app');
    this.productos = [];
    this.cargarLista(this.tamaño - this.rango, this.tamaño, null);
    this.tamaño += this.rango;
  }

  ionViewDidLoad() {
    this.onHideSubscription = this.keyboard.onKeyboardHide().subscribe(() => this.closeKeyboard());
    this.platform.registerBackButtonAction(() => {
      this.dismiss();
      this.app.buttomBack();
    });
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

  cargarLista(offset, limit, scroll) {
    this.loadListSearch = false;
    if (scroll == null) {
      this.showSpinner = true;
      this.productos = [];
    }
    this.ws.getProductos(this.id + '/' + offset + '/' + limit)
      .subscribe(
      (res) => {
        let datos = res.json().data;
        this.llenarArray(datos);
        if (scroll != null) {
          scroll.complete();
        }
      },
      (err) => {
        this.showSpinner = false;
      }
      );
  }

  llenarArray(datos) {
    let tamano = this.rango;
    if (datos.length < this.rango) {
      tamano = datos.length;
    }
    for (var i = 0; i < tamano; i++) {
      this.productos.push(datos[i]);
    }
    this.showSpinner = false;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  doInfinite(event) {
    if (!this.loadListSearch) {
      this.cargarLista(this.tamaño - this.rango, this.tamaño, event);
      this.tamaño += this.rango;
    } else {
      this.tamañoBusqueda += this.rango;
      this.search(13, event);
    }
  }

  closeKeyboard() {
    if (!this.loadListSearch) {
      this.busqueda = false;
    }
  }

  search(event, scroll) {
    // if (event == 13) {
    // if (this.txtSearch == '' || this.txtSearch == undefined) {
    //   this.closeSearch(null);
    // }

    if (this.txtSearch != '' && this.txtSearch != undefined) {
      this.loadListSearch = true;
      if (scroll == null) {
        this.content.scrollToTop();
        this.tamañoBusqueda = this.rango;
        this.productos = [];
        this.showSpinner = true;
      }
      this.ws.searchProducto(this.id, this.txtSearch, this.tamañoBusqueda - this.rango, this.tamañoBusqueda)
        .subscribe(
        (res) => {
          if (scroll == null) {
            this.productos = [];
          }
          this.llenarArray(res.data);
          if (scroll == null) {
            this.showSpinner = false;
          } else {
            scroll.complete();
          }
        },
        (err) => {
          if (scroll == null) {
            this.productos = [];
            this.showSpinner = false;
          } else {
            scroll.complete();
          }
        }
        )
    }
    // }
  }

  seleccionar(event, producto) {
    let lista = JSON.parse(window.localStorage.getItem('CotizacionLista'));
    let next = true;
    if (lista != null) {
      lista.find((element, index) => {
        if (producto.id == element.producto.id) {
          next = false;
          this.toastCtrl.create({
            message: 'El producto ya fue agregado a la lista',
            duration: 3000
          }).present();
        }
      });
    }
    if (next) {
      let param = {
        producto: producto,
        app: this.app
      }
      let productoModal = this.modalCtrl.create('FormCotizacionPage', param);
      productoModal.onDidDismiss(data => {
        this.viewCtrl.dismiss(data);
      });
      productoModal.present();
    }
  }

  inputSearch() {
    this.busqueda = true;
    setTimeout(() => {
      this.searchInput.setFocus();
    }, 300);

  }

  closeSearch(event) {
    this.busqueda = false;
    this.loadListSearch = false;
    this.tamaño = 50;
    this.cargarLista(this.tamaño - this.rango, this.tamaño, null);
  }

}