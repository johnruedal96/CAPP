import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Searchbar, LoadingController, Content } from 'ionic-angular';
import { WebServiceProvider } from '../../providers/web-service/web-service';
import { Keyboard } from '@ionic-native/keyboard';
import { Subscription } from 'rxjs/Subscription';

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

  @ViewChild('searchbar') searchInput: Searchbar;
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public ws: WebServiceProvider, public keyboard: Keyboard, public loadingCtrl: LoadingController) {
    this.id = this.navParams.get('id');
    this.productos = [];
    this.cargarLista(this.tamaño - this.rango, this.tamaño, null);
    this.tamaño += this.rango;
  }

  ionViewDidLoad() {
    this.onHideSubscription = this.keyboard.onKeyboardHide().subscribe(() => this.closeKeyboard());
  }

  cargarLista(offset, limit, scroll) {
    this.loadListSearch = false;
    if (scroll == null) {
      this.productos = [];
    }
    this.ws.getProductos(this.id + '/' + offset + '/' + limit)
      .subscribe(res => {
        let datos = res.json().data;
        this.llenarArray(datos);
        if (scroll != null) {
          scroll.complete();
        }
      });
  }

  llenarArray(datos) {
    let tamano = this.rango;
    if (datos.length < this.rango) {
      tamano = datos.length;
    }
    for (var i = 0; i < tamano; i++) {
      this.productos.push(datos[i]);
    }
  }

  dismiss() {
    // let data = {
    //   'seleccion': this.seleccion,
    //   'id': this.id
    // };
    this.viewCtrl.dismiss({ producto: null });
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
    let loader;
    if (event == 13) {

      if (this.txtSearch == '' || this.txtSearch == undefined) {
        this.loadListSearch = false;
        this.tamaño = 50;
        this.cargarLista(this.tamaño - this.rango, this.tamaño, null);
      }

      if (this.txtSearch != '' && this.txtSearch != undefined) {
        this.loadListSearch = true;
        if (scroll == null) {
          this.content.scrollToTop();
          this.tamañoBusqueda = this.rango;
          loader = this.loadingCtrl.create({
            content: "Cargando",
          });
          loader.present();
        }
        this.ws.searchProducto(this.id, this.txtSearch, this.tamañoBusqueda - this.rango, this.tamañoBusqueda)
          .subscribe(
          (res) => {
            if (scroll == null) {
              this.productos = [];
            }
            this.llenarArray(res.data);
            if (scroll == null) {
              loader.dismiss();
            } else {
              scroll.complete();
            }
          },
          (err) => {
            if (scroll == null) {
              this.productos = [];
              loader.dismiss();
            } else {
              scroll.complete();
            }
          }
          )
      }
    }
  }

  seleccionar(event, producto) {
    this.viewCtrl.dismiss({ producto: producto });
  }

   inputSearch() {
    this.busqueda = true;
    setTimeout(() => {
      this.searchInput.setFocus();
    }, 300);

  }

}