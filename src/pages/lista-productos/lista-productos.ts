import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Searchbar, LoadingController } from 'ionic-angular';
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
  public tamaño: number = 20;
  public busqueda: boolean = false;
  // indica cuando se realizo una busqueda
  public loadListSearch: boolean = false;
  // suscripcion a los metodos del teclado
  private onHideSubscription: Subscription;
  // guarda lo escrito en el input de busqueda
  public txtSearch: string;

  @ViewChild('searchbar') searchInput: Searchbar;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public ws: WebServiceProvider, public keyboard: Keyboard, public loadingCtrl: LoadingController) {
    this.id = this.navParams.get('id');
    this.productos = [];
    this.cargarLista(this.tamaño - 20, this.tamaño, null);
    this.tamaño += 20;
  }

  ionViewDidLoad() {
    this.onHideSubscription = this.keyboard.onKeyboardHide().subscribe(() => this.closeKeyboard());
  }

  cargarLista(offset, limit, scroll) {
    this.ws.getProductos(this.id + '/' + offset + '/' + limit)
      .subscribe(res => {
        let datos = res.json().data;
        for (var i = 0; i < 20; i++) {
          this.productos.push(datos[i]);
        }
        if (scroll != null) {
          scroll.complete();
        }
      });
  }

  dismiss() {
    // let data = {
    //   'seleccion': this.seleccion,
    //   'id': this.id
    // };
    this.viewCtrl.dismiss('asdasdasd');
  }

  doInfinite(event) {
    if (!this.busqueda) {
      this.cargarLista(this.tamaño - 20, this.tamaño, event);
      this.tamaño += 20;
    }
  }

  inputSearch() {
    this.busqueda = true;
    setTimeout(() => {
      this.searchInput.setFocus();
    }, 300);

  }

  closeKeyboard() {
    if (!this.loadListSearch) {
      this.busqueda = false;
    }
  }

  closeSearch() {
    // si ya se realizo una busqueda, pone el texto del input en blanco
    // oculta la barra de busqueda
    // y carga todas las empresas
    if (this.loadListSearch) {
      this.txtSearch = '';
      this.busqueda = false;
      this.loadListSearch = false;
    }
  }

  search(event) {
    if (event == 13) {
      let loader = this.loadingCtrl.create({
        content: "Cargando",
      });
      loader.present();

      if (this.txtSearch != '') {
        this.busqueda = true;
      } else {
        this.busqueda = false;
      }
      this.ws.searchProducto(this.id, this.txtSearch)
        .subscribe(
        (res) => {
          this.productos = res.data;
          loader.dismiss();
        },
        (err) => {
          this.productos = [];
          loader.dismiss();
        }
        )
    }
  }

}
