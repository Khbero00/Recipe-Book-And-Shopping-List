import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '@myapp-models/recipe.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RecipeDataService } from '@myapp-services/recipe-data.service';
import { RecipeDialogComponent } from 'src/app/shared/components/recipe-dialog/recipe-dialog.component';
import { DeletionDialogComponent } from 'src/app/shared/components/deletion-dialog/deletion-dialog.component';


@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css'],
})
export class RecipeItemComponent implements OnInit {

  @Input() recipe: Recipe;

  constructor(public dialog: MatDialog, public snackBar: MatSnackBar, 
              private recipeDataService: RecipeDataService) { }

  ngOnInit() {
  }

  editRecipe(recipe: Recipe) {
    const dialogRef = this.dialog.open(RecipeDialogComponent, {
      width: '750px',
      data: {editRecipe : recipe}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.value) {
        result.value.directions = Array.prototype.map.call(result.value.directions, s => s).toString();
        this.recipeDataService.updateRecipe(result.value).subscribe(recipe => {
          if (recipe.payload.exists) {
            this.openSnackBar('Recipe was updated Successfully', 'Close');
          }
        })
      }
    });
  }

  openSnackBar(status: string, action: string) {
    this.snackBar.open(status, action, {
      duration: 2000
    });
  }

  deleteRecipe(recipe: Recipe) {
    const dialogRef = this.dialog.open(DeletionDialogComponent, {
      width: '750px',
      data: {deletionConfirmation : "Are you sure you want to delete this recipe?"}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.recipeDataService.deleteRecipe(recipe).subscribe(response => {
          this.openSnackBar('Recipe was deleted Successfully', 'Close');
        }, error => {
          this.openSnackBar('Recipe could not be deleted at this time', 'Close');
        });
      }
    });
  }
}
