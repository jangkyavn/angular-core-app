import { NgModule, ModuleWithProviders } from '@angular/core';

import { LoadingSpinnerComponent } from './loading-spinner.component';

@NgModule({
  declarations: [LoadingSpinnerComponent],
  exports: [LoadingSpinnerComponent]
})
export class LoadingSpinnerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LoadingSpinnerModule
    }
  }
}
