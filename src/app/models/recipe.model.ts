import { Ingredient } from "./ingredient.model";

export class Recipe {
    public id: string;
    public name: string;
    public nickName: string;
    public directions: string;
    public userId: string;
    public ingredients: Ingredient[];
}