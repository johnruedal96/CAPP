var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Searchbar, LoadingController } from 'ionic-angular';
import { WebServiceProvider } from '../../providers/web-service/web-service';
import { Keyboard } from '@ionic-native/keyboard';
/**
 * Generated class for the ElectricoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
var ElectricoPage = (function () {
    function ElectricoPage(navCtrl, navParams, ws, keyboard, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.ws = ws;
        this.keyboard = keyboard;
        this.loadingCtrl = loadingCtrl;
        // indica cuando se realizo una busqueda
        this.loadListSearch = false;
        this.electricos = [];
        this.electricoLoad = [];
        this.imagen = "http://www.contactoarquitectonico.com.co/capp_admin/archivos/";
        this.busqueda = false;
    }
    ElectricoPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.loadEmpresa(false);
        // ejecuta la funcion closeSearch() cuando el teclado es cerrado
        this.onHideSubscription = this.keyboard.onKeyboardHide().subscribe(function () { return _this.closeKeyboard(); });
    };
    ElectricoPage.prototype.loadEmpresa = function (refresh) {
        var _this = this;
        // muestra el 'Cargando' en la vista
        // se la pagina se refresca con el efecto de estirar no se muestra el 'cargando'
        if (!refresh) {
            this.presentLoading();
        }
        // carga la informacion del web service
        this.ws.getEmpresas(2)
            .subscribe(function (electrico) {
            _this.electricos = electrico.data;
            _this.electricoLoad = [];
            _this.cargarVista(20, refresh);
        });
    };
    // Cargar los elementos en la lista
    // numElemtos = numero de elementos a mostrar
    ElectricoPage.prototype.cargarVista = function (numElemetos, refresh) {
        var num = numElemetos;
        if (this.electricos.length <= num) {
            num = this.electricos.length;
        }
        for (var i = 0; i < num; ++i) {
            this.electricoLoad.push(this.electricos[i]);
        }
        if (refresh) {
            this.refresher.complete();
            this.txtSearch = '';
            this.busqueda = false;
            this.loadListSearch = false;
        }
        else {
            // oculta el 'cargando' de la vista
            this.loader.dismiss();
        }
    };
    // ejecuta el scroll infinito
    ElectricoPage.prototype.presentLoading = function () {
        this.loader = this.loadingCtrl.create({
            content: "Cargango",
        });
        this.loader.present();
    };
    // navega a las diferentes empresas
    ElectricoPage.prototype.goToEmpresa = function (empresa) {
        this.navCtrl.push('EmpresaPage', { empresa: empresa });
    };
    // muestra el input de busqueda y le pone el foco
    ElectricoPage.prototype.inputSearch = function () {
        var _this = this;
        this.busqueda = true;
        setTimeout(function () {
            _this.searchInput.setFocus();
        }, 300);
    };
    ElectricoPage.prototype.closeSearch = function () {
        // si ya se realizo una busqueda, pone el texto del input en blanco
        // oculta la barra de busqueda
        // y carga todas las empresas
        if (this.loadListSearch) {
            this.txtSearch = '';
            this.busqueda = false;
            this.loadEmpresa(false);
            this.loadListSearch = false;
        }
    };
    ElectricoPage.prototype.closeKeyboard = function () {
        if (!this.loadListSearch) {
            this.busqueda = false;
        }
    };
    ElectricoPage.prototype.loadSearch = function () {
        var _this = this;
        if (this.txtSearch != '' && this.txtSearch != undefined) {
            // mustra el 'cargando' en la vista
            this.presentLoading();
            // realiza la busqueda y la muestra en pantalla
            this.loadListSearch = true;
            this.ws.search(2, this.txtSearch)
                .subscribe(function (search) {
                _this.electricos = search.data;
                _this.electricoLoad = [];
                _this.keyboard.close();
                _this.cargarVista(20, false);
            }, function (err) {
                _this.electricos = [];
                _this.electricoLoad = [];
                _this.keyboard.close();
                _this.cargarVista(20, false);
            });
        }
    };
    ElectricoPage.prototype.search = function (event) {
        // si se presiona el boton de buscar (teclado) se ejecuta la funciona
        if (event == 13) {
            this.loadSearch();
        }
    };
    ElectricoPage.prototype.doInfinite = function (infiniteScroll) {
        var _this = this;
        setTimeout(function () {
            // numero de elementos cargados en la vista
            var position = _this.electricoLoad.length;
            // numero de elementos a agregar en la vista (20)
            var tamano = position + 20;
            // si tamaño es mañor que el array de elementos, tamaño es igual al tamaño del array
            if (tamano > _this.electricos.length) {
                tamano = _this.electricos.length;
            }
            // agregar elementos al array que muestra la informacion el pantalla
            for (var i = position; i < tamano; i++) {
                _this.electricoLoad.push(_this.electricos[i]);
            }
            infiniteScroll.complete();
        }, 500);
    };
    ElectricoPage.prototype.doRefresh = function (refresher) {
        this.loadEmpresa(true);
        this.refresher = refresher;
    };
    return ElectricoPage;
}());
__decorate([
    ViewChild('searchbar'),
    __metadata("design:type", Searchbar)
], ElectricoPage.prototype, "searchInput", void 0);
ElectricoPage = __decorate([
    IonicPage(),
    Component({
        selector: 'page-electrico',
        templateUrl: 'electrico.html',
    }),
    __metadata("design:paramtypes", [NavController, NavParams, WebServiceProvider, Keyboard, LoadingController])
], ElectricoPage);
export { ElectricoPage };
//# sourceMappingURL=electrico.js.map