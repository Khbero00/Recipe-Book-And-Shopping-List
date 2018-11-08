import { Ingredient } from "./ingredient.model";
import { Items } from "./items.model";

export class ShoppingList {
    public id: string;
    public name: string;
    public userId: string;
    public items: Items[];
}