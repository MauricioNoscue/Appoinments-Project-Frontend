import { Injectable } from '@angular/core';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  private tokenKey = 'jwt';

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    console.log(token)
    return token !== null && this.isTokenValid(token);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  private isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      return Date.now() < exp * 1000;
    } catch {
      return false;
    }
  }
  getUserRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];
  
    const decoded: any = jwtDecode(token);
    console.log(decoded);
    console.log(token);
  
    const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
  
    const roles = decoded[roleClaim];
    return Array.isArray(roles) ? roles : roles ? [roles] : [];
  }




  getUserRoleIds(): number[] {
    const token = this.getToken();
    if (!token) return [];

    const decoded: any = jwtDecode(token);
    const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

    const roles = decoded[roleClaim];
    if (!roles) return [];

    // Puede venir como string único o como array de strings
    if (Array.isArray(roles)) {
      return roles.map((r: string) => Number(r));
    }

    return [Number(roles)];
  }

}
