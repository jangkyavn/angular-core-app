import { AuthGuard } from './auth.guard';
import { AuthLoginGuard } from './auth-login.guard';

export const guards: any[] = [AuthGuard, AuthLoginGuard];

export * from './auth.guard';
export * from './auth-login.guard';