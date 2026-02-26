import * as fs from 'fs';

export interface HttpResponse {
  status: number;
  headers: Record<string, string>;
  body: string;
  url: string;
  redirected: boolean;
}

export class HttpClient {
  private cookies: Map<string, string> = new Map();
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  private buildCookieHeader(): string {
    return Array.from(this.cookies.entries())
      .map(([k, v]) => `${k}=${v}`)
      .join('; ');
  }

  private extractCookies(response: Response): void {
    const setCookies = response.headers.getSetCookie?.() || [];
    for (const sc of setCookies) {
      const [kv] = sc.split(';');
      const [k, ...v] = kv.split('=');
      this.cookies.set(k.trim(), v.join('=').trim());
    }
  }

  private resolveUrl(pathOrUrl: string): string {
    if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
      return pathOrUrl;
    }
    return this.baseUrl + pathOrUrl;
  }

  async get(pathOrUrl: string): Promise<HttpResponse> {
    const url = this.resolveUrl(pathOrUrl);
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'manual',
      headers: {
        Cookie: this.buildCookieHeader(),
      },
    });

    this.extractCookies(response);

    // Follow redirects manually (up to 10)
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (location) {
        return this.followRedirects(response, url);
      }
    }

    return {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: await response.text(),
      url,
      redirected: false,
    };
  }

  async post(pathOrUrl: string, formData: Record<string, string>): Promise<HttpResponse> {
    const url = this.resolveUrl(pathOrUrl);
    const body = Object.entries(formData)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');

    const response = await fetch(url, {
      method: 'POST',
      redirect: 'manual',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: this.buildCookieHeader(),
      },
      body,
    });

    this.extractCookies(response);

    return {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: await response.text(),
      url,
      redirected: false,
    };
  }

  async followRedirects(initialResponse: Response, initialUrl: string, maxRedirects: number = 10): Promise<HttpResponse> {
    let response = initialResponse;
    let currentUrl = initialUrl;
    let redirectCount = 0;

    while (response.status >= 300 && response.status < 400 && redirectCount < maxRedirects) {
      const location = response.headers.get('location');
      if (!location) break;

      // Resolve relative URLs
      if (location.startsWith('http://') || location.startsWith('https://')) {
        currentUrl = location;
      } else if (location.startsWith('/')) {
        const urlObj = new URL(currentUrl);
        currentUrl = `${urlObj.origin}${location}`;
      } else {
        const base = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1);
        currentUrl = base + location;
      }

      response = await fetch(currentUrl, {
        method: 'GET',
        redirect: 'manual',
        headers: {
          Cookie: this.buildCookieHeader(),
        },
      });

      this.extractCookies(response);
      redirectCount++;
    }

    return {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: await response.text(),
      url: currentUrl,
      redirected: redirectCount > 0,
    };
  }

  // Cookie management
  getSessionCookie(): string | undefined {
    return this.cookies.get('JSESSIONID');
  }

  getCookies(): Record<string, string> {
    return Object.fromEntries(this.cookies);
  }

  setCookies(cookies: Record<string, string>): void {
    this.cookies.clear();
    for (const [k, v] of Object.entries(cookies)) {
      this.cookies.set(k, v);
    }
  }

  clearCookies(): void {
    this.cookies.clear();
  }

  // Session persistence
  saveSession(filePath: string, sessionInfo: Record<string, any>): void {
    const data = {
      cookies: this.getCookies(),
      sessionInfo,
    };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  loadSession(filePath: string): { cookies: Record<string, string>; sessionInfo: Record<string, any> } | null {
    try {
      if (!fs.existsSync(filePath)) return null;
      const raw = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw);
      if (data.cookies) {
        this.setCookies(data.cookies);
      }
      return data;
    } catch {
      return null;
    }
  }
}
