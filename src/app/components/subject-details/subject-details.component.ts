import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuctionSubject } from 'src/app/model/auction-subject';
import { Category } from 'src/app/model/category';
import { CategoryService } from 'src/app/services/category.service';
import { SubjectService } from 'src/app/services/subject.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-subject-details',
  templateUrl: './subject-details.component.html',
  styleUrls: ['./subject-details.component.css']
})
export class SubjectDetailsComponent implements OnInit {
  subject = new AuctionSubject();
  categories: Category[];
  imageUrl: string | ArrayBuffer;
  isEdit: boolean;
  private selectedFile: File;
  private deleteFile = false;
  private entrySubject = new AuctionSubject();
  
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  constructor(@Inject(MAT_DIALOG_DATA) public data: AuctionSubject,
              public dialogRef: MatDialogRef<SubjectDetailsComponent>,
              public categoryDialog: MatDialog,
              private subjectService: SubjectService, 
              private categoryService: CategoryService,
              private _ngZone: NgZone,) {
    Object.assign(this.subject, data);
    Object.assign(this.entrySubject, data);
  }

  ngOnInit(): void {
    this.getCategories();
    this.isEdit = this.subject.caption != null;
  }

  isSubjectModifiedAndValid(): boolean {
    return (!this.subject.equals(this.entrySubject) 
      || this.selectedFile == null && this.entrySubject.picByte != null && this.deleteFile == true
      || this.selectedFile != null && this.entrySubject.picByte == null
      || this.imageUrl != null && this.imageUrl != this.entrySubject.picByte)
      && this.subject.basicPrice >= 0;
  }

  comparer(cat1: Category, cat2: Category): boolean {
    return cat1 && cat2 ? cat1.name === cat2.name : cat1 === cat2;
  }

  triggerResize() {
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  modifySaveButton(): string {
    if (this.subject.endDateAccessor != null) {
      return 'Zapisz i opublikuj';
    } else {
      return 'Zapisz';
    }
  }

  save(): void {
    const subjectData = new FormData();
    if (this.selectedFile != null) {
      subjectData.append('imageFile', this.selectedFile, this.selectedFile.name);
    }

    const subjectPayload = Object.assign({}, this.subject);
    subjectPayload.picByte = null;
    subjectData.append('subject', JSON.stringify(subjectPayload));
    subjectData.append('deleteFile', this.deleteFile.toString());

    if (this.data == null) {
      this.subjectService.addNew(subjectData).subscribe(
        response => {
          console.log(response)
          this.dialogRef.close();
        },
        error => console.log(error));
    } else {
      this.subjectService.put(subjectData).subscribe(
        response => {
          this.dialogRef.close();
          console.log(response)
        },
        error => console.log(error));
    }
  }

  onFileChanged(event): void {
    this.selectedFile = event.target.files[0];
    this.getImageUrl();
  }

  deleteImage(): void {
    this.selectedFile = null;
    this.imageUrl = null;
    this.subject.picByte = null;
    this.deleteFile = true;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  getMinDate(): Date {
    let date = new Date();
    date.setHours(date.getHours() + 1);
    return date;
  }

  private getCategories(): void {
    this.categoryService.getAll().subscribe(
      (response: Category[]) => this.categories = response,
      error => console.log(error));
  }

  private getImageUrl(): void {
    if (this.selectedFile == null) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = (event) => {
      this.imageUrl = event.target.result;
    }
  }
}
