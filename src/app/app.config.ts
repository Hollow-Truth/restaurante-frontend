import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient,withInterceptors } from '@angular/common/http'; // <--- IMPORTANTE
import { provideAnimations } from '@angular/platform-browser/animations'; // <--- IMPORTANTE
import { authInterceptor } from './auth.interceptor';



export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])), // Habilita conexión a Django
    provideAnimations(),  // Habilita animaciones de PrimeNG
    // AQUÍ REGISTRAMOS EL INTERCEPTOR:
    provideAnimations()
  ]
};