import { inject } from '@angular/core';
import {

  CanActivateFn,
  Router,

} from '@angular/router';

export const loginGuard: CanActivateFn = (

) => {
  const router = inject(Router);

  return true;
};
