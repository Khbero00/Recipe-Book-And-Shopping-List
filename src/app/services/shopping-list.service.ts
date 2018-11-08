import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ShoppingList } from '@myapp-models/shopping-list.model';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Items } from '@myapp-models/items.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  shoppingListItemDoc: AngularFirestoreDocument<ShoppingList>;
  shoppingListCollection: AngularFirestoreCollection<any>;

  itemsCollection: AngularFirestoreCollection<any>;

  public shoppingList: ShoppingList[];

  constructor(private afs: AngularFirestore) {
    this.shoppingListCollection = afs.collection('shopping-list');
    this.itemsCollection = afs.collection('items');
  }

  getShoppingLists(): Observable<ShoppingList[]> {
    return this.afs.collection<ShoppingList>('shopping-list').valueChanges();
  }

  getShoppingListItemsByShoppingListId(shoppingListId): Observable<Items[]> {
    return this.afs.collection<Items>('items', ref => {
      return ref
      .where("shoppingListId", "==", shoppingListId)
      .orderBy("name");
    }).valueChanges();
  }

  saveShoppingList(shoppingList: ShoppingList): Observable<any> {
    const userId = localStorage.getItem('userId');
    this.shoppingListCollection.doc(shoppingList.id).set({
      id: shoppingList.id, 
      name: shoppingList.name, 
      userId: userId
    });

    this.saveOrUpdateItems(shoppingList);
    return this.shoppingListCollection.snapshotChanges();
  }

  updateShoppingList(shoppingList: ShoppingList) {
    const userId = localStorage.getItem('userId');
    this.shoppingListItemDoc = this.afs.doc<ShoppingList>(`items/${shoppingList.id}`);
    this.shoppingListItemDoc.update({
      id: shoppingList.id,
      name: shoppingList.name,
      userId: userId
    });

    this.saveOrUpdateItems(shoppingList);
    return this.shoppingListItemDoc.snapshotChanges();
  }

  saveOrUpdateItems(shoppingList: ShoppingList) {
    shoppingList.items.forEach(item => {
      this.afs.doc<Items>(`items/${item.id}`).get()
        .subscribe(docSnapshot => {
          if (docSnapshot.exists) {
            this.afs.doc<Items>(`items/${item.id}`).update({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              shoppingListId: shoppingList.id
          })
          } else {
            const itemId = this.afs.createId();
            this.itemsCollection.doc(itemId).set({
              id: itemId,
              name: item.name,
              quantity: item.quantity,
              shoppingListId: shoppingList.id
            });
          }
        })
    })
  }

  deleteShoppingList(shoppingList: ShoppingList): Observable<any> {
    return from(this.afs.doc(`items/${shoppingList.id}`).delete()).pipe(
      map(r => {
       this.deleteShoppingListItems(shoppingList.items);
      }, error => console.log(error))
    )
  }

  deleteShoppingListItems(shoppingListItems: Items[]) {
    shoppingListItems.forEach(item => {
      this.afs.doc(`items/${item.id}`).delete();
    });
  }
}
