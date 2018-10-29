import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';

import { RecipeDataService } from '../../services/recipe-data.service';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import {MatDialog} from '@angular/material'
import { Observable } from 'rxjs';
import {concat} from 'rxjs/operators'
import { Recipe } from '@myapp-models/recipe.model';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-recipe-book',
  templateUrl: './recipe-book.component.html',
  styleUrls: ['./recipe-book.component.css'],
})
export class RecipeBookComponent implements OnInit {
  recipes: Recipe[] = [];
  addRecipeForm: FormGroup;
  closeResult: string;
  task: AngularFireUploadTask;
  downloadURL: Observable<string>;

  dataSource: any;
  columnsToDisplay = ['name', 'description'];
  expandedElement: Recipe;
  
  data: any;

  constructor(private recipeDataService: RecipeDataService, private storage: AngularFireStorage, public dialog: MatDialog) { }

  ngOnInit() {
      this.recipeDataService.getRecipes().subscribe((recipes: Recipe[]) => {
        this.recipes = recipes;
        this.recipes.forEach(recipe => {
          this.recipeDataService.getIngredients(recipe.id).subscribe(ingredients => recipe.ingredients = ingredients);
        });
      })

      this.addRecipeMethod();
  }
  
  openDialog(): void {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '750px',
      data: {recipeForm: this.addRecipeForm}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addRecipeForm = result;
        this.addRecipeForm.value.directions = Array.prototype.map.call(result.value.directions, s => s).toString();
        this.saveRecipe();
      }
      this.resetRecipeForm();
    });
  }

  // onFileChanged(event) {
  //   const file = event.target.files[0];
    
  //   if (file.type.split('/')[0] !== 'image') {
  //     console.log("Image upload error");
  //     return;
  //   }
    
  //   //The Storage Path
  //   const filePath = `photos/${file.name}_${new Date().getTime()}`;
  //   const fileRef = this.storage.ref(filePath);
  //   this.task = this.storage.upload(filePath, file);
    
  //   this.task.snapshotChanges().pipe(finalize(() => this.downloadURL = fileRef.getDownloadURL())).subscribe()
  // }


  private addRecipeMethod() {
    this.addRecipeForm = new FormGroup({
      'id': new FormControl(0),
      'name': new FormControl(null, Validators.required),
      'nickName': new FormControl(null, Validators.required),
      'directions': new FormArray([], Validators.required),
      'ingredients': new FormArray([], Validators.required),
      'userId': new FormControl(localStorage.getItem('userId'))
    });
  }

  private saveRecipe() {
    // this.downloadURL.subscribe(url => {
    //   this.addRecipeForm.value.imagePath = url;
    //   this.recipes.push(this.addRecipeForm.value);
    // });
    this.recipes.push(this.addRecipeForm.value);
    this.recipeDataService.saveRecipe(this.addRecipeForm.value);
    this.addRecipeForm.reset();
  }

  private resetRecipeForm() {
    this.addRecipeForm.reset();

    let directionsArray = (<FormArray>this.addRecipeForm.get('directions'));
    let ingredientsArray = (<FormArray>this.addRecipeForm.get('ingredients'));

    while(directionsArray.length) {
      directionsArray.removeAt(0);
    }

    while(ingredientsArray.length) {
      ingredientsArray.removeAt(0);
    }
  }
}
