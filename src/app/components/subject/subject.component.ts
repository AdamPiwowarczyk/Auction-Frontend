import { Component, OnInit, resolveForwardRef, ViewChild } from '@angular/core';
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
import { CategoryNewComponent } from '../category-new/category-new.component';
import { SubjectsFilter } from '../../model/SubjectsFilter';
import { PurchaseService } from 'src/app/services/purchase.service';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent implements OnInit {
  searchSubjectName: string = '';
  subjects: AuctionSubject[];
  category: Category;
  categories: Category[];
  selectedCategories: Category[];
  price = 10;
  selectedFile: File;
  userInfo: UserInfo;
  isAdmin: boolean;
  filteredSubjects: AuctionSubject[];
  subjectsFilter = SubjectsFilter.Active
  keys = Object.keys;
  subjectFiltersEnum = SubjectsFilter;
  biddedSubjects: AuctionSubject[];
  timeouts = [];
  
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  constructor(private authService: AuthService,
              private subjectService: SubjectService,
              private purchaseService: PurchaseService,
              private categoryService: CategoryService, 
              private router: Router,
              public dialog: MatDialog,
              public categoryDialog: MatDialog,
              private _snackBar: MatSnackBar) {
    }

  async ngOnInit(): Promise<void> {
    // this.getUserInfo();
    await this.getUserInfo();
    this.getCategories();
    // this.getSubjects();
    this.getActiveSubjects();
    this.biddedSubjects = await this.getBiddedSubjects()
    this.getPurchases();

    this.subjectService.newSubjectEvent.subscribe((subject: AuctionSubject) => {
      this.biddedSubjects.push(subject);
      this.getPurchases();
    })

    // setTimeout(() => this.openSnackBar(), 5 * 1000);
    // setInterval(() => this.openSnackBar(), 10 * 1000);
  }

  private getPurchases(): void {
    for (let i = 0; i < this.timeouts.length; i++) {
      clearTimeout(this.timeouts[i]);
    }
    this.timeouts = [];

    this.biddedSubjects.forEach((subject: AuctionSubject) => {
      const tempSubject = new AuctionSubject();
      Object.assign(tempSubject, subject);
      const timeout = new Date(tempSubject.endDateAccessor).valueOf() - new Date(Date.now()).valueOf() + 9000;
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

  async getUserInfo(): Promise<void> {
    return new Promise<void>(resolve => {
      this.authService.getUserInfo().subscribe(
        (response: UserInfo) => {
          console.log(response)
          this.userInfo = response;
          this.isAdmin = response.roles.includes('ROLE_USER');
          resolve();
        },
        error => console.log(error));     
    })
  }

  // getUserInfo(): void {
  //   this.userInfo = this.authService.getUserInfo();
  //   this.isAdmin = this.userInfo.roles.includes('ROLE_USER');
  // }
  
  // getUserInfo2(): void {
  //   this.authService.getUserInfo().subscribe(
  //     (response: UserInfo) => {
  //       console.log(response)
  //       this.userInfo = response;
  //       this.isAdmin = response.roles.includes('ROLE_USER');
  //     },
  //     error => console.log(error));
  // }

  searchSubject(): void {
    console.log("search");
    this.filteredSubjects = this.subjects.filter(subject => {
      return subject.caption.includes(this.searchSubjectName);
    })
  }

  test(): void {
    this.authService.test().subscribe((response) => console.log(response), err => console.log(err));
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
        // this.getBiddedSubjects();
        this.subjects = await this.getBiddedSubjects();//te 3 linijki są nowe
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
    console.log(SubjectsFilter.Bought);
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

  openSnackBar(caption: string) {
    this._snackBar.openFromComponent(SnackBarComponent, {
      duration: 10 * 1000,
      data: caption
    });
  }

  // checkIfAdmin(): void {
  //   this.isAdmin = this.userInfo.roles?.includes('ROLE_USER');
  // }

  logout(): void {
    // this.credentials.password = "";
    localStorage.removeItem('token');
    this.router.navigate(['/'])
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

  refresh() {
    this.onFilterChange();
    this.getCategories();
  }

  // delete() {//do usunięcia
  //   this.subjectService.delete(this.subject.code).subscribe(
  //     response => {
  //       console.log(response),
  //       this.getSubjects();
  //     },
  //     error => console.log(error));
  // }

  getActiveSubjects(): void {
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
      },
      error => console.log(error));
  }

  getNewSubjects(): void {
    this.subjectService.getNew().subscribe(
      (response: AuctionSubject[]) => {
      this.subjects = response.map(subject => {
        if (subject.picByte) {
          subject.picByte = 'data:image/jpeg;base64,' + subject.picByte;
        }
        return subject;
        })
        this.filteredSubjects = this.subjects;
        // this.selectedCategories = [];
          this.filterSubjects();
      },
      error => console.log(error));
  }

  async getBiddedSubjects(): Promise<AuctionSubject[]> {
    let subjects: AuctionSubject[];
    if (this.isAdmin) {
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
            // this.filterSubjects();
            resolve(subjects);
          },
          error => console.log(error));
      })
    } else {
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
          },
          error => console.log(error));
      })
    }
  }

  // getBiddedSubjects(): void {
  //   if (this.isAdmin) {
  //     this.subjectService.getBidded().subscribe(
  //       (response: AuctionSubject[]) => {
  //         this.subjects = response.map(subject => {
  //         if (subject.picByte) {
  //           subject.picByte = 'data:image/jpeg;base64,' + subject.picByte;
  //         }
  //         return subject;
  //         })
  //         this.filteredSubjects = this.subjects;
  //         this.filterSubjects();
  //       },
  //       error => console.log(error));
  //   } else {
  //     this.purchaseService.getBidded(this.userInfo.username).subscribe(
  //       (response: AuctionSubject[]) => {
  //         this.subjects = response.map(subject => {
  //         if (subject.picByte) {
  //           subject.picByte = 'data:image/jpeg;base64,' + subject.picByte;
  //         }
  //         return subject;
  //         })
  //         this.filteredSubjects = this.subjects;
  //         this.filterSubjects();
  //       },
  //       error => console.log(error));
  //   }
  // }

  getBoughtSubjects(): void {
    if (!this.isAdmin) {
      this.subjectService.getBought().subscribe(
        (response: AuctionSubject[]) => {
        this.subjects = response.map(subject => {
          if (subject.picByte) {
            subject.picByte = 'data:image/jpeg;base64,' + subject.picByte;
          }
          return subject;
          })
          this.filteredSubjects = this.subjects;
          // this.selectedCategories = [];
            this.filterSubjects();
        },
        error => console.log(error));
    } else {
      this.purchaseService.getBought(this.userInfo.username).subscribe(
        (response: AuctionSubject[]) => {
        this.subjects = response.map(subject => {
          if (subject.picByte) {
            subject.picByte = 'data:image/jpeg;base64,' + subject.picByte;
          }
          return subject;
          })
          this.filteredSubjects = this.subjects;
          // this.selectedCategories = [];
            this.filterSubjects();
        },
        error => console.log(error));
    }
  }

  getArchiveSubjects(): void {
    this.subjectService.getArchive().subscribe(
      (response: AuctionSubject[]) => {
      this.subjects = response.map(subject => {
        if (subject.picByte) {
          subject.picByte = 'data:image/jpeg;base64,' + subject.picByte;
        }
        return subject;
        })
        this.filteredSubjects = this.subjects;
        // this.selectedCategories = [];
          this.filterSubjects();
      },
      error => console.log(error));
  }

  // getSubjects(archive = false): void {
  //   this.subjectService.getAll(archive).subscribe(
  //     (response: AuctionSubject[]) => {
  //     this.subjects = response.map(subject => {
  //       if (subject.picByte) {
  //         subject.picByte = 'data:image/jpeg;base64,' + subject.picByte;
  //       }
  //       return subject;
  //       })
  //       this.filteredSubjects = this.subjects;
  //       // this.selectedCategories = [];
  //         this.filterSubjects();
  //     },
  //     error => console.log(error));
  // }

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

  getCategories() {
    this.categoryService.getAll().subscribe(
      (response: Category[]) => {
        this.categories = response;
      },
      error => console.log(error));
  }

  comparer(cat1: Category, cat2: Category): boolean {
    return cat1 && cat2 ? cat1.name === cat2.name : cat1 === cat2;
  }

  deleteCategory(categoryName: string): void {
    this.categoryService.delete(categoryName).subscribe(
      () => {
        this.refresh();
      },
      error => console.log(error)
    );
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
  }

}
