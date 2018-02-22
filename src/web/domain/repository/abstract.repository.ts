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
  /**
   * Busca todos os ítens
   * @returns {Observable<any[]>}
   */
  public find(): Observable<any[]> {
    return this._items;
  }

  /**
   * Busca somente um ítem
   * @param {string} key
   * @returns {Observable<any>}
   */
  public findOne(key: string): Observable<any> {
    return this._angularFireDatabase.object(this._path + '/' + key).snapshotChanges()
      .map((changes => ({key: changes.payload.key, ...changes.payload.val()})));
  }

  /**
   *
   * @param item
   * @returns {PromiseLike<any>}
   */
  public save(item: any): PromiseLike<any> {

    this.removeNullProperties(item);

    /**
     * Se tem key atualiza
     */
    if (item && item.key)
      return this.update(item.key, item);

    return this._itemsRef.push(item)
      .then(result => AbstractRepository.getItemWithKey(item, result));
  }

  /**
   *
   * @param {string} key
   * @param item
   * @returns {Promise<any>}
   */
  private update(key: string, item: any): Promise<any> {
    return new Promise((resolve) => {
      this._itemsRef.update(key, item)
        .then(result => {
          /**
           * 'result' do angularfire não funciona
           */
          this.findOne(key).subscribe(result => {
            resolve(result);
          })
        });
    });
  }

  /**
   * Remove o ítem
   * @param {string} key
   * @returns {Promise<any>}
   */
  public remove(key: string): Promise<any> {
    return this._itemsRef.remove(key);
  }

  /**
   * Remove propriedades nulas ou undefined
   * @param test
   */
  private removeNullProperties(test) {
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
   * @param item
   * @param result
   * @returns {any}
   */
  private static getItemWithKey(item: any, result: any): any {
    item.key = result.key;
    return item;
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
}