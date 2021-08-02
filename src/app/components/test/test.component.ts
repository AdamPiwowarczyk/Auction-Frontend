import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ObservableService } from '../../services/observable.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {
  currentTime: Date;
  webSocketEndPoint: string = 'http://localhost:8080/ws';
  topic: string = "/topic/greetings";
  stompClient: any;
  message: any;
  constructor() {
    this.connect();
  }

  connect() {
    console.log("Initialize WebSocket Connection");
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;
    _this.stompClient.connect({}, () => {
        _this.stompClient.subscribe(_this.topic, sdkEvent => {
            _this.onMessageReceived(sdkEvent);
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
    setTimeout(() => {
        this.connect();
    }, 5000);
  }

  onMessageReceived(message) {
    this.message = message.body;
  }

  send() {
    this.stompClient.send("/app/hello", {});
  }
}
