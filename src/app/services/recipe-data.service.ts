import { Injectable } from '@angular/core';
import { Recipe } from '@myapp-models/recipe.model';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RecipeDataService {
  itemDoc: AngularFirestoreDocument<Recipe>;
  recipesCollection: AngularFirestoreCollection<Recipe>;
  recipes: Observable<Recipe[]>;

  constructor(private afs: AngularFirestore) { }

  getRecipes(): Observable<Recipe[]> {
    this.recipesCollection = this.afs.collection('recipes', ref => {
      return ref.orderBy('name');
    });
    
    return this.recipes = this.recipesCollection.valueChanges();
  }

  getRecipe(id: string) {
    this.itemDoc = this.afs.doc<Recipe>(`recipes/${id}`);
    return this.itemDoc.valueChanges();
  }

  saveRecipe(recipe: Recipe) {
    this.recipesCollection.add(recipe).then(documentRef => {
      documentRef.update({id: documentRef.id});
    });
  }
}
