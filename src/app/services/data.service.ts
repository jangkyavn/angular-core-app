import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators';

import { MessageService } from './message.service';
import { AuthService } from './auth.service';
import { SystemConstants } from '../common/system.constants';

@Injectable()
export class DataService {
  private baseUrl = SystemConstants.BASE_API;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private authService: AuthService) { }

  private httpOptions() {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers.delete('Authorization');
    headers.append('Authorization', 'Bearer' + this.authService.getLoggedInUser().access_token);

    return headers;
  }

  /** GET data from the server */
  get(url: string): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + url, { headers: this.httpOptions() })
      .pipe(catchError(this.handleError(`getData`, [])));
  }

  /** POST data to server */
  post(url: string, data?: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + url, data, { headers: this.httpOptions() })
      .pipe(catchError(this.handleError<any>('postData')));
  }

  /** PUT data to server */
  put(url: string, data?: any): Observable<any> {
    return this.http.put<any>(this.baseUrl + url, data, { headers: this.httpOptions() })
      .pipe(catchError(this.handleError<any>('putData')));
  }

  /** DELETE data to server */
  delete(url: string): Observable<any> {
    return this.http.delete<any>(this.baseUrl + url, { headers: this.httpOptions() })
      .pipe(catchError(this.handleError<any>('delete')));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log Services message with the MessageService */
  private log(message: string) {
    this.messageService.add('Service: ' + message);
  }
}
