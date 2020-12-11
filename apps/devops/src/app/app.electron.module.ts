import { NgModule } from "@angular/core";
import { ShadowboxElectronCoreModule } from "@shadowbox/electron";
import { AppModule } from "./app.module";
import { AppComponent } from "./app.component";

@NgModule({
  imports: [AppModule, ShadowboxElectronCoreModule],
  bootstrap: [AppComponent],
})
export class AppElectronModule {}
