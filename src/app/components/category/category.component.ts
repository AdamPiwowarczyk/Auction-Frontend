import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/model/category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  category: Category;
  categories: Category[];

  constructor(private categoryService: CategoryService, private router: Router) {
    this.category = {
      name: "category 1"
    };
   }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.categoryService.getAll().subscribe(
      (response: Category[]) => this.categories = response,
      error => console.log(error));
  }
  
  addNewCategory() {
    this.categoryService.addNew(this.category).subscribe(
      response => {
        console.log(response),
        this.getCategories();
      },
      error => console.log(error));
  }
  
  deleteCategory() {
    this.categoryService.delete(this.category.name).subscribe(
      response => {
        console.log(response);
        this.getCategories();
      },
      error => console.log(error));
  }

  returnToList() {
    this.router.navigate(['/subjects']);
  }

}
