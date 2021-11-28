import { Component, OnInit, ViewChild } from '@angular/core';
import { AuctionSubject } from '../../model/auction-subject';
import { SubjectService } from '../../services/subject.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../model/category';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserInfo } from '../../model/user-info';
import { MatDialog } from '@angular/material/dialog';
import { SubjectDetailsComponent } from '../subject-details/subject-details.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../snack-bar/snack-bar.component';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { SubjectsFilter } from '../../model/SubjectsFilter';
import { PurchaseService } from 'src/app/services/purchase.service';
import { CategoryNewComponent } from '../category-new/category-new.component';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent implements OnInit {
  searchSubjectName: string = '';
  categories: Category[];
  selectedCategories: Category[];
  userInfo: UserInfo;
  isAdmin: boolean;
  filteredSubjects: AuctionSubject[];
  subjectsFilter = SubjectsFilter.Active
  keys = Object.keys;
  subjectFiltersEnum = SubjectsFilter;
  private subjects: AuctionSubject[];
  private biddedSubjects: AuctionSubject[];
  private timeouts = [];
  
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  constructor(public dialog: MatDialog,
              public categoryDialog: MatDialog,
              private authService: AuthService,
              private subjectService: SubjectService,
              private purchaseService: PurchaseService,
              private categoryService: CategoryService, 
              private router: Router,
              private _snackBar: MatSnackBar) {
    }

  async ngOnInit(): Promise<void> {
    await this.getUserInfo();
    this.getCategories();
    this.getActiveSubjects();
    this.biddedSubjects = await this.getBiddedSubjects()
    this.getPurchases();

    this.subjectService.newSubjectEvent.subscribe((subject: AuctionSubject) => {
      this.biddedSubjects.push(subject);
      this.getPurchases();
    })
  }
  test() {
    this.openSnackBar("Obraz 1");
  }

  addNewSubject() {
    const dialogRef = this.dialog.open(SubjectDetailsComponent, {
      width: '900px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.refresh();
      console.log(result);
    });
  }

  async onFilterChange() {
    switch (this.subjectsFilter[0]) {
      case SubjectsFilter.Active:
        this.getActiveSubjects();
        this.searchSubjectName = '';
        break;
      case SubjectsFilter.New:
        this.getNewSubjects();
        this.searchSubjectName = '';
        break;
      case SubjectsFilter.Bidded:
        this.subjects = await this.getBiddedSubjects();
        this.filteredSubjects = this.subjects;
        this.filterSubjects();
        this.searchSubjectName = '';
        break;
      case SubjectsFilter.Bought:
        this.getBoughtSubjects();
        this.searchSubjectName = '';
        break;
      case SubjectsFilter.Archive:
        this.getArchiveSubjects();
        this.searchSubjectName = '';
        break;
      default:
        break;
    }
  }

  filterSubjects(): void {
    if (!this.selectedCategories) {
      return;
    }

    this.filteredSubjects = this.subjects.filter(subject => {
      const subjectCategoryNames = subject.categories.map(category => category.name)
      const selectedCategoryNames = this.selectedCategories.map(category => category.name)
      let contains = true;
      selectedCategoryNames.forEach(categoryName => {
        if (!subjectCategoryNames.includes(categoryName)) {
          contains = false;
        }
      })
      return contains;
    })
  }

  searchSubject(): void {
    this.filteredSubjects = this.subjects.filter(subject => {
      return subject.caption.includes(this.searchSubjectName);
    })
  }

  comparer(cat1: Category, cat2: Category): boolean {
    return cat1 && cat2 ? cat1.name === cat2.name : cat1 === cat2;
  }

  addNewCategory(): void {
    const dialogRef = this.categoryDialog.open(CategoryNewComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe((result: Category) => {
      if (result != null) {
        this.categories.push(result);
        console.log(result);
      }
    });
  }

  deleteCategory(categoryName: string): void {
    this.categoryService.delete(categoryName).subscribe(
      () => {
        this.refresh();
      },
      error => console.log(error)
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/'])
  }

  private async getUserInfo(): Promise<void> {
    return new Promise<void>(resolve => {
      this.authService.getUserInfo().subscribe(
        (response: UserInfo) => {
          console.log(response)
          this.userInfo = response;
          this.isAdmin = response.roles.includes('ROLE_ADMIN');
          resolve();
        },
        error => console.log(error));     
    })
  }

  private getCategories() {
    this.categoryService.getAll().subscribe(
      (response: Category[]) => {
        this.categories = response;
      },
      error => console.log(error));
  }

  private getPurchases(): void {
    for (let i = 0; i < this.timeouts.length; i++) {
      clearTimeout(this.timeouts[i]);
    }
    this.timeouts = [];

    this.biddedSubjects.forEach((subject: AuctionSubject) => {
      const tempSubject = new AuctionSubject();
      Object.assign(tempSubject, subject);
      const timeout = new Date(tempSubject.endDateAccessor).valueOf() - new Date(Date.now()).valueOf() + 3000;
      this.timeouts.push(setTimeout(() => {
        console.log(timeout);
        this.purchaseService.getNewBought(tempSubject.code, this.userInfo.username)
        .subscribe((response: boolean) => {
          if (response) {
            this.openSnackBar(tempSubject.caption);
          }
        })
      }, timeout));
    })
  }

  private openSnackBar(caption: string) {
    this._snackBar.openFromComponent(SnackBarComponent, {
      duration: 10 * 1000,
      data: caption
    });
  }

  private refresh() {
    this.onFilterChange();
    this.getCategories();
  }

  private getActiveSubjects(): void {
    this.subjectService.getActive().subscribe(
      (response: AuctionSubject[]) => {
      this.subjects = response.map(subject => {
        if (subject.picByte) {
          subject.picByte = 'data:image/jpeg;base64,' + subject.picByte;
        }
        return subject;
        })
        this.filteredSubjects = this.subjects;
        this.filterSubjects();
      });
  }

  private getNewSubjects(): void {
    this.subjectService.getNew().subscribe(
      (response: AuctionSubject[]) => {
      this.subjects = response.map(subject => {
        if (subject.picByte) {
          subject.picByte = 'data:image/jpeg;base64,' + subject.picByte;
        }
        return subject;
        })
        this.filteredSubjects = this.subjects;
        this.filterSubjects();
      });
  }

  private async getBiddedSubjects(): Promise<AuctionSubject[]> {
    if (!this.isAdmin) {
      return await this.getBiddedSubjectsForAdmin();
    } else {
      return await this.getBiddedSubjectsForUser();
    }
  }

  private getBoughtSubjects(): void {
    if (!this.isAdmin) {
      this.getBoughtSubjectsForAdmin();
    } else {
      this.getBoughtSubjectsForUser();
    }
  }

  private getArchiveSubjects(): void {
    this.subjectService.getArchive().subscribe(
      (response: AuctionSubject[]) => {
      this.subjects = response.map(subject => {
        if (subject.picByte) {
          subject.picByte = 'data:image/jpeg;base64,' + subject.picByte;
        }
        return subject;
        })
        this.filteredSubjects = this.subjects;
        this.filterSubjects();
      });
  }

  private getBiddedSubjectsForAdmin(): Promise<AuctionSubject[]> {
    let subjects: AuctionSubject[];
    return new Promise<AuctionSubject[]>(resolve => {
      this.subjectService.getBidded().subscribe(
        (response: AuctionSubject[]) => {
          subjects = response.map(subject => {
          if (subject.picByte) {
            subject.picByte = 'data:image/jpeg;base64,' + subject.picByte;
          }
          return subject;
          })
          this.filteredSubjects = this.subjects;
          resolve(subjects);
        })
      })
  }

  private getBiddedSubjectsForUser(): Promise<AuctionSubject[]> {
    let subjects: AuctionSubject[];
    return new Promise<AuctionSubject[]>(resolve => {
      this.purchaseService.getBidded(this.userInfo.username).subscribe(
        (response: AuctionSubject[]) => {
          subjects = response.map(subject => {
          if (subject.picByte) {
            subject.picByte = 'data:image/jpeg;base64,' + subject.picByte;
          }
          return subject;
          })
          this.filteredSubjects = this.subjects;
          this.filterSubjects();
          resolve(subjects);
        })
      })
  }

  private getBoughtSubjectsForAdmin(): void {
    this.subjectService.getBought().subscribe(
      (response: AuctionSubject[]) => {
      this.subjects = response.map(subject => {
        if (subject.picByte) {
          subject.picByte = 'data:image/jpeg;base64,' + subject.picByte;
        }
        return subject;
        })
        this.filteredSubjects = this.subjects;
        this.filterSubjects();
      });
  }

  private getBoughtSubjectsForUser(): void {
    this.purchaseService.getBought(this.userInfo.username).subscribe(
      (response: AuctionSubject[]) => {
      this.subjects = response.map(subject => {
        if (subject.picByte) {
          subject.picByte = 'data:image/jpeg;base64,' + subject.picByte;
        }
        return subject;
        })
        this.filteredSubjects = this.subjects;
        this.filterSubjects();
      });
  }
}
