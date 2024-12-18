import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import * as jwt_decode from 'jwt-decode';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private LOGIN_URL = `${environment.serverURL}/clients/login`
  private REGISTER_URL = `${environment.serverURL}/clients/register`
  private tokenKey = `authToken`;

  constructor(private httpClient: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<any> {
    return this.httpClient.post<any>(this.LOGIN_URL, {email, password}).pipe(
      tap(response => {
        if (response.token) {
          console.log(response.token);
          this.setToken(response.token);
        }
      })
    )
  }

  register(
    username: string, 
    email: string, 
    password: string, 
    clientType: string, 
    place: {
      name: string, 
      address: string, 
      location: { lat: number; lng: number }, 
      rating?: number, 
      photos: Array<{ photoReference: string }>, 
      types: string[], 
      place_id: string
    }
  ): Observable<any> {
    return this.httpClient.post<any>(this.REGISTER_URL, {
      username,
      email,
      password,
      clientType,
      place
    });
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    } else {
      return null;
    }
  }
  
  getCliendIdFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decodedToken: any = jwt_decode.jwtDecode(token);
      return decodedToken.clientId || null;
    } catch (error) {
      console.error(`Invalid token format ${error}`);
      return null;
    }
  }

  getClientNameEmailFromToken(): { name: string | null, email: string | null } | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decodedToken: any = jwt_decode.jwtDecode(token);
      const name = decodedToken?.name || null;
      const email = decodedToken?.email || null;
      return { name, email };
    } catch (error) {
      console.error(`Invalid token format ${error}`);
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if(!token) return false;
    
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() < exp;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }
}