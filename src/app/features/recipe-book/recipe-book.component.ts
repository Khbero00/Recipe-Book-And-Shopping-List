import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Recipe } from '@myapp-models/recipe.model';
import { RecipeDataService } from '../../services/recipe-data.service';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-recipe-book',
  templateUrl: './recipe-book.component.html',
  styleUrls: ['./recipe-book.component.css']
})
export class RecipeBookComponent implements OnInit {
  recipes: Recipe[] = [];
  addRecipeForm: FormGroup;
  closeResult: string;
  task: AngularFireUploadTask;
  downloadURL: Observable<string>;

  constructor(private recipeDataService: RecipeDataService, private modalService: NgbModal, private storage: AngularFireStorage) { }

  ngOnInit() {
      this.recipeDataService.getRecipes().subscribe(recipeData => {
          this.recipes = recipeData;
          console.log(this.recipes);
      });
      this.addRecipeForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required),
      'imagePath': new FormControl(null, Validators.required)
    });
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  onFileChanged(event) {
    const file = event.target.files[0];
    
    if (file.type.split('/')[0] !== 'image') {
      console.log("Image upload error");
      return;
    }
    
    //The Storage Path
    const filePath = `photos/${file.name}_${new Date().getTime()}`;
    const fileRef = this.storage.ref(filePath);
    this.task = this.storage.upload(filePath, file);
    
    this.task.snapshotChanges().pipe(
      finalize(() => this.downloadURL = fileRef.getDownloadURL())
    ).subscribe()
  }

  onAddRecipe() {
    this.downloadURL.subscribe(url => {
      this.addRecipeForm.value.imagePath = url;
      this.recipes.push(this.addRecipeForm.value);
      this.recipeDataService.saveRecipe(this.addRecipeForm.value);
      this.addRecipeForm.reset();
    });
  }

}
