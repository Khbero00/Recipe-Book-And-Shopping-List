import { Injectable } from '@angular/core';
import { Recipe } from '@myapp-models/recipe.model';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RecipeDataService {

  recipesCollection: AngularFirestoreCollection<Recipe>;
  recipes: Observable<Recipe[]>;

  constructor(private afs: AngularFirestore) { }

  getRecipes() {
    this.recipesCollection = this.afs.collection('recipes', ref => {
      return ref.orderBy('name');
    });
    
    return this.recipes = this.recipesCollection.valueChanges();
  }

  saveRecipe(recipe: Recipe) {
    this.recipesCollection.add(recipe);
  }
}
