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
  webSocketApi: WebSocketApi
  stackDto = new StackDto();
  userInfo = new UserInfo();
  lastPrice: number;  
  bidDisabled: boolean;
  showImage: boolean;
  messageSubject = new Subject<string>();
  minPrice: number;
  currentPrice: number;
  isNew = false;
  

  constructor(private subjectService: SubjectService,
              private authService: AuthService,
              private purchaseService: PurchaseService,
              public dialogRef: MatDialogRef<BidComponent>,
              @Inject(MAT_DIALOG_DATA) public subject: AuctionSubject) {}

  async ngOnInit(): Promise<void> {
    this.webSocketApi = new WebSocketApi(this.messageSubject);
    // this.getSubject();
    this.userInfo = await this.getUserInfo();
    // this.userInfo = this.getUserInfo();//stare z subscribe
    this.prepareData();
    this.webSocketApi.connect(this.subject.code);
    this.messageSubject.subscribe(message => this.handleMessage(message));
    this.getLastPrice();
    // this.buySubject();
  }

  // getSubject(): void {
  //   this.subjectService.getSubject(this.data).subscribe(
  //     (response: AuctionSubject) => {
  //       this.subject = response;
  //     })
  // }

  // async getSubject(): Promise<void> {
  //   return new Promise<void>(resolve => {
  //     this.subjectService.getSubject(this.data).subscribe(
  //       (response: AuctionSubject) => {
  //         this.subject = response;
  //         resolve();
  //       })
  //   })
  // }

  getLastPrice(): void {
    this.purchaseService.getLastPrice(this.userInfo.username, this.subject.code).subscribe(
      (response: number) => {
        this.lastPrice = response;
        this.isNew = this.lastPrice == 0;
      },
      error => console.log(error));
  }

  validPrice(): boolean {
    return this.currentPrice >= this.stackDto.minPrice;
  }

  // getUserInfo(): UserInfo {
  //   return this.authService.getUserInfo();
  // }
  // getUserInfo(): Promise<UserInfo> {//stare z subscribe
  //   return new Promise<UserInfo>(resolve => {
  //     resolve(this.authService.getUserInfo().toPromise());      
  //   })
  // }
  async getUserInfo(): Promise<UserInfo> {
    return new Promise<UserInfo>(resolve => {
      this.authService.getUserInfo().subscribe(
        (response: UserInfo) => {
          resolve(response);
        },
        error => console.log(error));     
    })
  }

  buySubject(): void {
    const timeout = new Date(this.subject.endDateAccessor).valueOf() - new Date(Date.now()).valueOf();
    setTimeout(() => {
      if (this.stackDto.username == this.userInfo.username) {
        // this.subjectService.buy(...);
		//jeśli się uda kupić to może być jakiś snackbar na zielono, że zakupiono ${subject.caption}
		//jest opcja, że ta funkcja będzie tylko wyświetlać, że udało się kupić
      }
    }, timeout);
  }

  sendMessage(): void {
    if (this.currentPrice < this.stackDto.minPrice) {
      return
    }
    this.bid();
    this.stackDto.currentPrice = this.currentPrice;
    this.webSocketApi.send(this.stackDto, this.subject.code);
  }

  bid(): void {
    this.subjectService.bid(this.subject, this.currentPrice, this.userInfo.username).subscribe(
      (response: number) => {
        console.log(response);
      },
      error => console.log(error));
    if (this.isNew) {
      // this.data.subjectEvent.next(this.subject);
      this.subjectService.newSubjectEvent.next(this.subject);
      this.isNew = false;
    }
  }

  handleMessage(message): void {
    let messageValue = JSON.parse(message);
    this.stackDto.minPrice = messageValue.minPrice;
    this.stackDto.currentPrice = messageValue.currentPrice;
    this.currentPrice = messageValue.minPrice;
    this.stackDto.username = messageValue.username;
  }

  ngOnDestroy(): void {
    this.webSocketApi.disconnect();
  }

  disconnect(): void {
    this.webSocketApi.disconnect();
  }  

  private prepareData(): void {
    this.stackDto.username = this.userInfo.username;
    this.stackDto.currentPrice = this.subject.soldPrice ? this.subject.soldPrice : this.subject.basicPrice;
    this.bidDisabled = new Date(this.subject.endDateAccessor) <= new Date();
    this.showImage = this.subject.picByte?.length != null;
    this.stackDto.minPrice = this.getMinPrice();
    this.currentPrice = this.stackDto.minPrice;
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

  cancel(): void {
    this.dialogRef.close();
  }
}
