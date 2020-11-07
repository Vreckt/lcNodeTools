import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }
  // testUpload
  addHero(hero: FormData): Observable<any> {
    // return this.http.post<Hero>(this.heroesUrl, hero, httpOptions)
    //   .pipe(
    //     catchError(this.handleError('addHero', hero))
    //   );
    const httpOptions = {
      headers: new HttpHeaders({})
    };
    return this.http.post('http://localhost:3000/testUpload', hero, httpOptions)
      .pipe(
        // catchError('error')
      );
  }
}
