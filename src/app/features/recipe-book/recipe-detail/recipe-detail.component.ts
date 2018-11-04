import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import { RecipeDataService } from '../../../services/recipe-data.service';
import { Recipe } from '@myapp-models/recipe.model';
import { finalize, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  recipe: Recipe;
  downloadURL: Observable<string>;
  task: AngularFireUploadTask;
  closeResult: string;




  constructor(private recipeDataService: RecipeDataService, 
              private route: ActivatedRoute, 
              private storage: AngularFireStorage) { }


  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params && params['id']) {
        this.recipeDataService.getRecipe(params['id']).subscribe(recipe => {
          this.recipe = recipe;
        });
      }
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

     // this.downloadURL.subscribe(url => {
    //   this.addRecipeForm.value.imagePath = url;
    //   this.recipes.push(this.addRecipeForm.value);
    // });
}
