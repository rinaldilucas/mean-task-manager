import { Injectable } from '@angular/core';

import Cookies from 'js-cookie';

@Injectable({ providedIn: 'root' })
export class CookiesService {
  setItem(key: string, value: string) {
    const options = {
      secure: true,
      sameSite: 'strict',
    };

    Cookies.set(key, value, options);
  }

  getItem(key: string): string | null {
    return Cookies.get(key);
  }

  removeItem(key: string): void {
    Cookies.remove(key);
  }

  clearLocalStorage(): void {
    Cookies.remove();
  }
}
