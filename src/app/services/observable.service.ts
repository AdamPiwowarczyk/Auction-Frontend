import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObservableService { //do usunięcia
  ws: WebSocket;

  createObservableService(): Observable<Date> {
    return new Observable(
      observer => {
        setInterval(() => {
          observer.next(new Date()), 1000;
        })
      }
    );
  }

  createObservableSocket(url: string): Observable<any> {
    this.ws = new WebSocket(url);
    return new Observable(
      observer => {
        this.ws.onmessage = (event) => observer.next(event.data);
        this.ws.onerror = (event) => observer.error(event);
        this.ws.onclose = (event) => observer.complete();
        return () => this.ws.close(1000, "Użytkownik został odłączony");
      }
    )
    
  }
}
