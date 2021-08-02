import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketApi {
  currentTime: Date;
  webSocketEndPoint: string = 'http://localhost:8080/ws';
  topic: string = "/topic/greetings";
  stompClient: any;
  message: any;

  constructor(private messageSubject: Subject<string>) {}

  connect(code: string) {
    console.log("Initialize WebSocket Connection");
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
    // setTimeout(() => {
    //     this.connect();
    // }, 5000);
  }

  onMessageReceived(message) {
    this.messageSubject.next(message.body);
  }

  send(stackDto: any, code: string) {
    this.stompClient.send("/app/hello" + `/${code}`, {}, JSON.stringify(stackDto));
  }
}
