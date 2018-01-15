import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { OverviewPage } from '../pages/overview/overview';
import { SettingsPage } from '../pages/settings/settings';
import { SettingsStoreProvider } from '../providers/settings-store/settings-store';
import { NativeStorage } from "@ionic-native/native-storage";
import { HttpModule } from '@angular/http';
import { DataPipe } from '../pipes/data/data';
import { DataDetailsPage } from '../pages/data-details/data-details';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    OverviewPage,
    SettingsPage,
    DataDetailsPage,
    DataPipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    OverviewPage,
    SettingsPage,
    DataDetailsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    NativeStorage,
    SettingsStoreProvider
  ]
})
export class AppModule {}
