import { Injectable } from '@angular/core';
import { TokenUser } from '../models/tokens';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly ACCESS_TOKEN = 'accessToken';
  private readonly REFRESH_TOKEN = 'refreshToken';
  private readonly USER = 'user';

  setAccessToken(accessToken: string): void {
    localStorage.setItem(this.ACCESS_TOKEN, accessToken);
  }

  getAccessToken(): string  {
    return localStorage.getItem(this.ACCESS_TOKEN) as string;
  }

  setRefreshToken(refreshToken: string): void {
    localStorage.setItem(this.REFRESH_TOKEN, refreshToken);
  }

  getRefreshToken(): string  {
    return localStorage.getItem(this.REFRESH_TOKEN) as string;
  }

  removeTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }

  storeUserData(user: TokenUser): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  removeUserData(): void {
    localStorage.removeItem(this.USER);
  }
}
