import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Category } from 'src/app/model/category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category-new',
  templateUrl: './category-new.component.html',
  styleUrls: ['./category-new.component.css']
})
export class CategoryNewComponent {
  category = new Category();

  constructor(private categoryService: CategoryService,
              public dialogRef: MatDialogRef<CategoryNewComponent>) { }

  save(): void {
    this.categoryService.addNew(this.category).subscribe(
    response => {
      console.log(response)
      this.dialogRef.close(this.category);
    },
    error => console.log(error));
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
