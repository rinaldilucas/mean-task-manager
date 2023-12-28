import { Injectable } from '@angular/core';

import Cookies, { CookieAttributes } from 'js-cookie';

@Injectable({ providedIn: 'root' })
export class CookieService {
  setItem(key: string, value: string): void {
    const options: CookieAttributes = {
      secure: true,
      sameSite: 'strict',
    };

    Cookies.set(key, value, options);
  }

  getItem(key: string): string | undefined {
    return Cookies.get(key);
  }

  removeItem(key: string): void {
    Cookies.remove(key);
  }
}
