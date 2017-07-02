var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ElementRef, Renderer } from '@angular/core';
import { MenuController } from 'ionic-angular';
var TabsPage = (function () {
    function TabsPage(element, renderer, menuController) {
        this.element = element;
        this.renderer = renderer;
        this.menuController = menuController;
        this.tab1Root = 'FerreteriaPage';
        this.tab2Root = 'ElectricoPage';
        this.tab3Root = 'ServicioPage';
        this.tab4Root = 'CotizacionPage';
        menuController.enable(true);
    }
    TabsPage.prototype.ionViewDidLoad = function () {
        var content = this.setIcon('ferreteria');
        this.loadIcon(content, 'assets/icon/icon_ferreterias.png');
        content = this.setIcon('servicio');
        this.loadIcon(content, 'assets/icon/icon_servicios.png');
        content = this.setIcon('electrico');
        this.loadIcon(content, 'assets/icon/icon_ferreelectricos.png');
    };
    TabsPage.prototype.setIcon = function (icon) {
        // icono android
        var content = this.element.nativeElement.getElementsByClassName('ion-md-' + icon)[0];
        if (content == undefined) {
            // icono ios
            content = this.element.nativeElement.getElementsByClassName('ion-ios-' + icon)[0];
            if (content == undefined) {
                // icono ios-outline
                content = this.element.nativeElement.getElementsByClassName('ion-ios-' + icon + '-outline')[0];
            }
        }
        return content;
    };
    TabsPage.prototype.loadIcon = function (content, url) {
        this.renderer.setElementStyle(content, 'background-image', 'url(' + url + ')');
        this.renderer.setElementStyle(content, 'width', '24px');
        this.renderer.setElementStyle(content, 'height', '24px');
        this.renderer.setElementStyle(content, 'background-size', 'contain');
        this.renderer.setElementStyle(content, 'background-repeat', 'no-repeat');
    };
    return TabsPage;
}());
TabsPage = __decorate([
    Component({
        templateUrl: 'tabs.html'
    }),
    __metadata("design:paramtypes", [ElementRef, Renderer, MenuController])
], TabsPage);
export { TabsPage };
//# sourceMappingURL=tabs.js.map