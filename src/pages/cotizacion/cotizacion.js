var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
/**
 * Generated class for the CotizacionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
var CotizacionPage = (function () {
    function CotizacionPage(navCtrl, navParams, modalCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.modalCtrl = modalCtrl;
        this.tags = ['Ionic', 'Angular', 'TypeScript'];
        this.lista = [];
        this.empresa = this.navParams.get('empresa');
    }
    CotizacionPage.prototype.ionViewDidLoad = function () {
    };
    CotizacionPage.prototype.presentProfileModal = function () {
        var profileModal = this.modalCtrl.create('ListaCotizacionPage', { lista: this.lista });
        profileModal.present();
    };
    CotizacionPage.prototype.agregar = function () {
        var item = {
            cantidad: this.cantidad,
            producto: this.product
        };
        this.lista.push(item);
        this.product = '';
        this.cantidad = '';
    };
    return CotizacionPage;
}());
CotizacionPage = __decorate([
    IonicPage(),
    Component({
        selector: 'page-cotizacion',
        templateUrl: 'cotizacion.html',
    }),
    __metadata("design:paramtypes", [NavController, NavParams, ModalController])
], CotizacionPage);
export { CotizacionPage };
//# sourceMappingURL=cotizacion.js.map