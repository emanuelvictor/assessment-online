import {Observable} from 'rxjs/Observable';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {isUndefined} from 'util';

export abstract class AbstractRepository {

  /**
   * ---------------------------------------------------------------
   *                      Attributes
   * ---------------------------------------------------------------
   */

  private _path: string = '';
  private _itemsRef: AngularFireList<any>;
  private _items: Observable<any[]>;
  private _angularFireDatabase: AngularFireDatabase;

  /**
   * ---------------------------------------------------------------
   *                      Initializer
   * ---------------------------------------------------------------
   */
  /**
   * Inicializa o angularFireDataBase e aponta para a ALI na base
   * @param {string} path
   * @param {AngularFireDatabase} angularFireDatabase
   */
  public init(path: string, angularFireDatabase: AngularFireDatabase): void {
    this._path = path;
    this._angularFireDatabase = angularFireDatabase;

    this._itemsRef = this._angularFireDatabase.list(this._path);
    this._items = this._itemsRef.snapshotChanges().map(changes => {
      return changes.map(c => ({key: c.payload.key, ...c.payload.val()}));
    });
  }

  /**
   * ---------------------------------------------------------------
   *                      CRUD
   * ---------------------------------------------------------------
   */

  public find(): Observable<any[]> {
    return this._items;
  }

  public findOne(key: string): Observable<any> {
    return this._angularFireDatabase.object(this._path + '/' + key).snapshotChanges()
      .map((changes => ({key: changes.payload.key, ...changes.payload.val()})));
  }

  public save(item: any): PromiseLike<any> {

    this.removeNullProperties(item);

    /**
     * Se tem key atualiza
     */
    if (item && item.key)
      return this.update(item.key, item);

    return this._itemsRef.push(item)
      .then(result =>
        result = this.getItemWithKey(item , result)
      );
  }

  /**
   * Todo FALCATRUA
   * @param item
   * @param result
   * @returns {any}
   */
  private getItemWithKey(item: any, result: any): any {
    item.key = result.key;
    return item;
  }

  public update(key: string, item: any): Promise<any> {
    this.removeNullProperties(item);

    return this._itemsRef.update(key, item);
  }

  public remove(key: string): Promise<any> {
    return this._itemsRef.remove(key);
  }

  /**
   *
   * @param test
   */
  public removeNullProperties(test) {
    for (const i in test) {
      if (test[i] === null || isUndefined(test[i])) {
        delete test[i];
        this.remove(test.key + '/' + i);
      } else if (typeof test[i] === 'object') {
        this.removeNullProperties(test[i]);
      }
    }
  }

  /**
   * ---------------------------------------------------------------
   *                      Setters and Getters
   * ---------------------------------------------------------------
   */

  get path(): string {
    return this._path;
  }

  set path(value: string) {
    this._path = value;
  }

  get itemsRef(): AngularFireList<any> {
    return this._itemsRef;
  }

  get items(): Observable<any[]> {
    return this._items;
  }

  get angularFireDatabase(): AngularFireDatabase {
    return this._angularFireDatabase;
  }

  set angularFireDatabase(value: AngularFireDatabase) {
    this._angularFireDatabase = value;
  }
}