import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse,HttpHeaders  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Player } from './player';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
  
  refreshPlayers() {
    throw new Error('Method not implemented.');
  }
  private baseUrl = 'http://localhost:5000/api/players';

  constructor(private http: HttpClient) { }

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.baseUrl);
  }

  getPlayer(id: string): Observable<Player> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Player>(url);
  }

  addPlayer(player: Player): Observable<Player> {
    return this.http.post<Player>(this.baseUrl, player);
  }

  editPlayer(player: Player): Observable<Player> {
    const url = `${this.baseUrl}/${player._id}`;
    return this.http.put<Player>(url, player);
  }

  updatePlayer(player: Player): Observable<Player> {
    if (!player || !player._id) {
      throw new Error('Player object or player._id is undefined');
    }
    const url = `${this.baseUrl}/${player._id}`;
    return this.http.put<Player>(url, player, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deletePlayer(id: string): Observable<Player> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<Player>(url);
  }
}
