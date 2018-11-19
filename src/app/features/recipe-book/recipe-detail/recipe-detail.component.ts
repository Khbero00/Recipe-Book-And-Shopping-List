import { Component, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { RecipeDataService } from '@myapp-services/recipe-data.service';
import { ShoppingListFormService } from '@myapp-services/shopping-list-form.service';
import { ShoppingListService } from '@myapp-services/shopping-list.service';
import { ShoppingListDialogComponent } from '@myapp-shared-components/shopping-list-dialog/shopping-list-dialog.component';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  recipe: any;
  downloadURL: Observable<string>;
  closeResult: string;

  constructor(private router: Router,
              private afs: AngularFirestore,
              private recipeDataService: RecipeDataService, 
              private shoppingListFormService: ShoppingListFormService,
              public shoppingListService: ShoppingListService,
              private route: ActivatedRoute,
              public dialog: MatDialog,
              public snackBar: MatSnackBar) { }


  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params && params['id']) {
        this.recipeDataService.getRecipe(params['id']).subscribe(recipe => {
          this.recipe = recipe;
          this.recipe.directions = recipe.directions.split(',');
          this.recipeDataService.getIngredientsByRecipeId(recipe.id)
          .subscribe(ingredients => recipe.ingredients = ingredients);
        });
      }
    });
  }

  addToShoppingList(items) {
    let shoppingListFormGroup: FormGroup = this.shoppingListFormService.addShoppingListForm();

    items.selected.map(item => {
      (<FormArray>shoppingListFormGroup.get('items')).push(new FormGroup({
            'id': new FormControl(0),
            'name': new FormControl(item.value[0]),
            'quantity': new FormControl(item.value[1]),
            'userId': new FormControl(null)
      }));
    });

    const dialogRef = this.dialog.open(ShoppingListDialogComponent, {
      width: '750px',
      data: {addShoppingList: shoppingListFormGroup}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        shoppingListFormGroup = result;
        
        shoppingListFormGroup.value.id = this.afs.createId();
        this.shoppingListService.saveShoppingList(shoppingListFormGroup.value)
        .subscribe(response => {
        if (response[0].payload.doc.exists) {
          this.openSnackBar("Shopping list was saved successfully!", "Close");
        }
      }, () => {
        this.openSnackBar("Shopping list was not saved.", "Close");
      });
      let itemsArray = (<FormArray>shoppingListFormGroup.get('items'));
      while(itemsArray.length) 
        itemsArray.removeAt(0);
        
      shoppingListFormGroup.reset();
      shoppingListFormGroup.reset();
      this.router.navigate(['/shopping-list']);
      }
    });
  }
  openSnackBar(status: string, action: string) {
    this.snackBar.open(status, action, {
      duration: 2000
    });
  }

}
