import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. ¿Está logueado?
  if (!authService.isLoggedIn()) {
    console.warn('⛔ Acceso denegado: No hay sesión activa.');
    router.navigate(['/login']);
    return false;
  }

  const userRole = authService.getUserRole(); // Ej: 'CASHIER'
  
  // Obtenemos los roles permitidos para esta ruta desde app.routes.ts
  const allowedRoles = route.data?.['roles'] as Array<string>;

  // Debugging: Ver en consola qué está pasando
  console.log(`👮 AuthGuard: Usuario=${userRole} intenta entrar a ${state.url}. Roles permitidos:`, allowedRoles);

  // 2. Si la ruta no define roles, asumimos que cualquiera logueado puede entrar (Ej: Perfil)
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  // 3. Verificamos si el rol del usuario está en la lista permitida
  if (allowedRoles.includes(userRole)) {
    return true; // ¡Pase!
  }

  // 4. Si llegamos aquí, es un ACCESO PROHIBIDO
  console.error(`⛔ ALERTA DE SEGURIDAD: ${userRole} intentó entrar a zona restringida.`);
  
  // Lo mandamos a su zona segura según su rol
  if (userRole === 'CASHIER') {
    router.navigate(['/pos']);
  } else if (userRole === 'COOK') {
    router.navigate(['/kitchen']);
  } else {
    router.navigate(['/login']);
  }
  
  return false;
};