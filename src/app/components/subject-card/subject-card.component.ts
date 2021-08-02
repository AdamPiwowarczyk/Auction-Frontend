import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuctionSubject } from 'src/app/model/auction-subject';
import { SubjectService } from 'src/app/services/subject.service';
import { BidComponent } from '../bid/bid.component';
import { SubjectDetailsComponent } from '../subject-details/subject-details.component';

@Component({
  selector: 'app-subject-card',
  templateUrl: './subject-card.component.html',
  styleUrls: ['./subject-card.component.css']
})
export class SubjectCardComponent implements OnInit {
  @Input() subjectInput: AuctionSubject;
  @Input() isAdmin: boolean;
  @Output() refreshEvent = new EventEmitter<void>();
  subject = new AuctionSubject();

  constructor(private subjectService: SubjectService,
              public dialog: MatDialog) {}
  ngOnInit(): void {
    Object.assign(this.subject, this.subjectInput);
  }

  deleteSubject(): void {
    this.subjectService.delete(this.subject.code).subscribe(
      response => {
        console.log(response)
        this.refreshEvent.emit();
      },
      error => console.log(error));
  }

  showImage(): boolean {
    return this.subject.picByte != null;
  }

  openEditDialog(): void {    
    const dialogRef = this.dialog.open(SubjectDetailsComponent, {
      width: '900px',
      data: this.subject 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.refreshEvent.emit();
    });
  }

  async openBidDialog(): Promise<void> {
    const updatedSubject = await this.getUpdatedSubject();
    const dialogRef = this.dialog.open(BidComponent, {
      width: '900px',
      data: updatedSubject
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.refreshEvent.emit();
    });
  }

  private async getUpdatedSubject(): Promise<AuctionSubject> {
    return new Promise<AuctionSubject> (resolve => {
      this.subjectService.getSubject(this.subject.code).subscribe(
        (response: AuctionSubject) => {
          resolve(response);
        }
      )
    })
  }

  // private async getBidData(): Promise<void> {
  //   return new Promise<void> (resolve => {
  //     this.subjectService.getSubject(this.subject.code).subscribe(
  //       (response: AuctionSubject) => {
  //         this.bidData = response;
  //         resolve();
  //       }
  //     )
  //   })
  // }

  allowEdition(): boolean {
    // return this.isAdmin && this.subject.publishDate == null;
    return true;
  }
}
