import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  [key: string]: any;
  exp?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'jwt';
  private roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && this.isTokenValid(token);
  }

logout(): void {
  this.clearAuthData();
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

    try {
      const decoded: JwtPayload = jwtDecode(token);
      const roles = decoded[this.roleClaim];
      return Array.isArray(roles) ? roles : roles ? [roles] : [];
    } catch {
      return [];
    }
  }

  getUserRoleIds(): number[] {
    const token = this.getToken();
    if (!token) return [];

    try {
      const decoded: JwtPayload = jwtDecode(token);
      const roles = decoded[this.roleClaim];
      if (!roles) return [];

      // Puede venir como string único o como array de strings
      if (Array.isArray(roles)) {
        return roles.map((r: string | number) => typeof r === 'string' ? Number(r) : r);
      }

      return [typeof roles === 'string' ? Number(roles) : roles];
    } catch {
      return [];
    }
  }


// Devuelve el DoctorId del token, si existe
getDoctorId(): number | null {
  const token = this.getToken();
  if (!token) return null;

  try {
    const decoded: JwtPayload = jwtDecode(token);

    // El claim puede venir como string o número
    const doctorId = decoded['DoctorId'];
    if (!doctorId) return null;

    return typeof doctorId === 'string' ? Number(doctorId) : doctorId;
  } catch {
    return null;
  }
}


// Elimina todos los datos relacionados con autenticación
clearAuthData(): void {
  localStorage.removeItem(this.tokenKey);        // accessToken
  localStorage.removeItem('jwt_expires');        // expiración
  localStorage.removeItem('jwt_refresh');        // refresh token
}



}
