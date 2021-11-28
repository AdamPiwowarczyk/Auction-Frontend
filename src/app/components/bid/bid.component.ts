import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { WebSocketApi } from '../../services/web-socket-api';
import { SubjectService } from '../../services/subject.service';
import { AuctionSubject } from '../../model/auction-subject';
import { StackDto } from '../../model/stack-dto';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UserInfo } from 'src/app/model/user-info';
import { PurchaseService } from '../../services/purchase.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-bid',
  templateUrl: './bid.component.html',
  styleUrls: ['./bid.component.css']
})
export class BidComponent implements OnInit, OnDestroy {
  stackDto = new StackDto();
  bidDisabled: boolean;
  showImage: boolean;
  currentPrice: number;
  subject = new AuctionSubject();
  private messageSubject = new Subject<string>();
  private isNew = false;
  private userInfo = new UserInfo();
  private lastPrice: number;
  private webSocketApi: WebSocketApi;
  

  constructor(private subjectService: SubjectService,
              private authService: AuthService,
              private purchaseService: PurchaseService,
              public dialogRef: MatDialogRef<BidComponent>,
              @Inject(MAT_DIALOG_DATA) public data: AuctionSubject) {
                Object.assign(this.subject, data);
  }

  async ngOnInit(): Promise<void> {
    this.webSocketApi = new WebSocketApi(this.messageSubject);
    this.userInfo = await this.getUserInfo();
    this.prepareData();
    this.webSocketApi.connect(this.subject.code);
    this.messageSubject.subscribe(message => this.handleMessage(message));
    this.getLastPrice();
  }

  ngOnDestroy(): void {
    this.webSocketApi.disconnect();
  }

  sendMessage(): void {
    if (this.currentPrice < this.stackDto.minPrice) {
      return
    }
    this.bid();
    this.stackDto.currentPrice = this.currentPrice;
    this.webSocketApi.send(this.stackDto, this.subject.code);
  }

  validPrice(): boolean {
    return this.currentPrice >= this.stackDto.minPrice;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private async getUserInfo(): Promise<UserInfo> {
    return new Promise<UserInfo>(resolve => {
      this.authService.getUserInfo().subscribe(
        (response: UserInfo) => {
          resolve(response);
        },
        error => console.log(error));     
    })
  }

  private prepareData(): void {
    this.stackDto.username = this.userInfo.username;
    this.stackDto.currentPrice = this.subject.soldPrice ? this.subject.soldPrice : this.subject.basicPrice;
    this.bidDisabled = new Date(this.subject.endDateAccessor) <= new Date();
    this.showImage = this.subject.picByte?.length > 'data:image/jpeg;base64,null'.length;
    this.stackDto.minPrice = this.getMinPrice();
    this.currentPrice = this.stackDto.minPrice;
  }

  private handleMessage(message): void {
    let messageValue = JSON.parse(message);
    this.stackDto.minPrice = messageValue.minPrice;
    this.stackDto.currentPrice = messageValue.currentPrice;
    this.currentPrice = messageValue.minPrice;
    this.stackDto.username = messageValue.username;
  }

  private getLastPrice(): void {
    this.purchaseService.getLastPrice(this.userInfo.username, this.subject.code).subscribe(
      (response: number) => {
        this.lastPrice = response;
        this.isNew = this.lastPrice == 0;
      },
      error => console.log(error));
  }

  private bid(): void {
    this.subjectService.bid(this.subject, this.currentPrice, this.userInfo.username).subscribe(
      (response: number) => {
        console.log(response);
      },
      error => console.log(error));
    if (this.isNew) {
      this.subjectService.newSubjectEvent.next(this.subject);
      this.isNew = false;
    }
  }

  private getMinPrice(): number {
    const price = this.stackDto.currentPrice;
    if (price == null || price < 100) {
      return price + 1.0;
    } else if (price < 1000) {
      return price + 5.0;
    } else {
      return price + Math.trunc(price / 1000) * 10;
    }
  }
}
