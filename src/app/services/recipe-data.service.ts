import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, from } from 'rxjs';
import {map} from 'rxjs/operators';

import { Recipe } from '@myapp-models/recipe.model';
import { Ingredient } from '@myapp-models/ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeDataService {
  recipeItemDoc: AngularFirestoreDocument<Recipe>;
  ingredientItemDoc: AngularFirestoreDocument<Ingredient>;

  recipesCollection: AngularFirestoreCollection<any>;
  ingredientsCollection: AngularFirestoreCollection<any>;


  constructor(private afs: AngularFirestore) {
    this.recipesCollection = afs.collection('recipes');
    this.ingredientsCollection = afs.collection('Ingredients');
   }

  getRecipes(): Observable<Recipe[]> {
    return this.afs.collection<Recipe>('recipes', ref => {
      return ref.where("userId", "==", localStorage.getItem("userId"))
                .orderBy("name");
    }).valueChanges();
  }

  getRecipe(id: string): Observable<Recipe> {
    this.recipeItemDoc = this.afs.doc<Recipe>(`recipes/${id}`);
    return this.recipeItemDoc.valueChanges();
  }

  saveRecipe(recipe: Recipe): Observable<any> {
    const userId = localStorage.getItem('userId');
    this.recipesCollection.doc(recipe.id).set({
      id: recipe.id, 
      name: recipe.name, 
      directions: recipe.directions, 
      nickName: recipe.nickName,
      userId: userId
    });

    this.saveOrUpdateIngredients(recipe);
    return this.recipesCollection.snapshotChanges();
  }

  updateRecipe(recipe: Recipe) {
    const userId = localStorage.getItem('userId');
    this.recipeItemDoc = this.afs.doc<Recipe>(`recipes/${recipe.id}`);
    this.recipeItemDoc.update({
      id: recipe.id,
      name: recipe.name,
      nickName: recipe.nickName,
      directions: recipe.directions,
      userId: userId
    });

    this.saveOrUpdateIngredients(recipe);
    
    return this.recipeItemDoc.snapshotChanges();
  }

  deleteRecipe(recipe: Recipe): Observable<any> {
    return from(this.afs.doc(`recipes/${recipe.id}`).delete()).pipe(
      map(() => {
       this.deleteIngredients(recipe.ingredients);
      }, error => console.log(error))
    )
  }

  getIngredientsByRecipeId(recipeId): Observable<Ingredient[]> {
    return this.afs.collection<Ingredient>('Ingredients', ref => {
      return ref
      .where("recipeId", "==", recipeId)
      .orderBy("name");
    }).valueChanges();
  }

  saveOrUpdateIngredients(recipe: Recipe) {
    recipe.ingredients.forEach(ingredient => {
      this.afs.doc<Ingredient>(`Ingredients/${ingredient.id}`).get()
        .subscribe(docSnapshot => {
          if (docSnapshot.exists) {
            this.afs.doc<Ingredient>(`Ingredients/${ingredient.id}`).update({
              id: ingredient.id,
              name: ingredient.name,
              quantity: ingredient.quantity,
              recipeId: recipe.id
          })
          } else {
            const ingredientId = this.afs.createId();
            this.ingredientsCollection.doc(ingredientId).set({
              id: ingredientId,
              name: ingredient.name,
              quantity: ingredient.quantity,
              recipeId: recipe.id
            });
          }
        })
    })
  }
  deleteIngredient(ingredientId: string) {
    this.afs.doc(`Ingredients/${ingredientId}`).delete();
  }

  deleteIngredients(ingredients: Ingredient[]) {
    ingredients.forEach(ingredient => {
      this.afs.doc(`Ingredients/${ingredient.id}`).delete();
    });
  }
}
