import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HttpModule } from '@angular/http';
import { Keyboard } from '@ionic-native/keyboard';
import { HeaderColor } from '@ionic-native/header-color';

import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';

import { LocalNotifications } from '@ionic-native/local-notifications';

// providers
import { WebServiceProvider } from '../providers/web-service/web-service';
import { AuthProvider } from '../providers/auth/auth';

import { SuperTabsModule } from 'ionic2-super-tabs';
import { SuperTabsController } from 'ionic2-super-tabs';
import { LocalStorageProvider } from '../providers/local-storage/local-storage';

import { Facebook } from '@ionic-native/facebook';

@NgModule({
  declarations: [
    MyApp,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    SuperTabsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    WebServiceProvider,
    AuthProvider,
    Keyboard,
    HeaderColor,
    Camera,
    File,
    SuperTabsController,
    LocalStorageProvider,
    LocalNotifications,
    Facebook
  ]
})
export class AppModule {}
