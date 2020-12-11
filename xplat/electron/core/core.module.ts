import { NgModule, Optional, SkipSelf } from "@angular/core";

import { throwIfAlreadyLoaded } from "@shadowbox/utils";
import { ELECTRON_PROVIDERS, ElectronService } from "./services";

@NgModule({
  providers: [...ELECTRON_PROVIDERS],
})
export class ShadowboxElectronCoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: ShadowboxElectronCoreModule,
    private _electronService: ElectronService
  ) {
    throwIfAlreadyLoaded(parentModule, "ShadowboxElectronCoreModule");
  }
}
