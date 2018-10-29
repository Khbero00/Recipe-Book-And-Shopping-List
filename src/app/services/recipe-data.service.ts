import { Injectable } from '@angular/core';
import { Recipe } from '@myapp-models/recipe.model';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Ingredient } from '@myapp-models/ingredient.model';
import {forkJoin} from 'rxjs';
import {take} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class RecipeDataService {
  recipeItemDoc: AngularFirestoreDocument<Recipe>;
  ingredientItemDoc: AngularFirestoreCollection<DocumentData>;

  recipesCollection: AngularFirestoreCollection<any>;
  ingredientsCollection: AngularFirestoreCollection<Ingredient>;

  recipes: Observable<Recipe[]>;
  ingredients: Observable<Ingredient[]>;

  constructor(private afs: AngularFirestore, private authService: AuthService, private http: HttpClient) { }

  getRecipes(): Observable<Recipe[]> {
    this.recipesCollection = this.afs.collection('recipes', ref => {
      return ref
      .where("userId", "==", localStorage.getItem("userId"))
      .orderBy("name");
    });
    
    return this.recipes = this.recipesCollection.valueChanges();
  }

  getIngredients(recipeId): Observable<any> {
    this.ingredientsCollection = this.afs.collection('Ingredients', ref => {
      return ref
      .where("recipeId", "==", recipeId)
      .orderBy("name");
    });
   return this.ingredients = this.ingredientsCollection.valueChanges();
  }

  // getCompleteRecipes(): Observable<any> {
  //   return forkJoin<Recipe[], Ingredient[]>([this.getRecipes().pipe(take(1)), this.getIngredients().pipe(take(1))]);
  // }

  getRecipe(id: string) {
    this.recipeItemDoc = this.afs.doc<Recipe>(`recipes/${id}`);
    return this.recipeItemDoc.valueChanges();
  }

  saveRecipe(recipe: Recipe) {
    this.recipesCollection.add
    this.recipesCollection.add({name: recipe.name, directions: recipe.directions, nickName: recipe.nickName}).then(documentRef => {
      documentRef.update({id: documentRef.id, userId: localStorage.getItem('userId')});
      recipe.id = documentRef.id;
      this.saveIngredients(recipe);
    });
  }

  saveIngredients(recipe: Recipe) {
    recipe.ingredients.forEach(ingredient => {
      this.ingredientsCollection.add(ingredient).then(documentRef => {
        documentRef.update({recipeId: recipe.id});
        });
    })
    }
  }
