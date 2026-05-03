import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import esLocale from '@angular/common/locales/es';
import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldDefaultOptions,
} from '@angular/material/form-field';
import {
  InMemoryScrollingOptions,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';
import routes from '@app/app.routes';
import TokenInterceptor from '@interceptors/token.interceptor';
import provideCore from '@modules/core';

const appearance: MatFormFieldDefaultOptions = {
  appearance: 'outline',
};
const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};

registerLocaleData(esLocale);

const appConfig: ApplicationConfig = {
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: appearance },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: LOCALE_ID, useValue: 'es-ES' },
    provideNativeDateAdapter(),
    provideRouter(
      routes,
      withViewTransitions(),
      withInMemoryScrolling(scrollConfig),
      withComponentInputBinding(),
    ),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([TokenInterceptor])),
    provideCore(),
  ],
};

export default appConfig;
