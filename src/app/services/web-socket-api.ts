import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketApi {
  private webSocketEndPoint: string = 'http://localhost:8080/ws';
  private topic: string = "/auction/bid";
  private stompClient: any;

  constructor(private messageSubject: Subject<string>) {}

  connect(code: string) {
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    this.stompClient.connect({}, () => {
        this.stompClient.subscribe(this.topic + `/${code}`, sdkEvent => {
            this.onMessageReceived(sdkEvent);
        });
    }, this.errorCallBack);

  };

  disconnect() {
    if (this.stompClient !== null) {
        this.stompClient.disconnect();
    }
    console.log("Disconnected");
  }

  errorCallBack(error) {
    console.log("errorCallBack -> " + error)
  }

  onMessageReceived(message) {
    this.messageSubject.next(message.body);
  }

  send(stackDto: any, code: string) {
    this.stompClient.send("/app/message" + `/${code}`, {}, JSON.stringify(stackDto));
  }
}
