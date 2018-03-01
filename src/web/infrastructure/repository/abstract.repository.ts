import {Observable} from 'rxjs/Observable';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {isUndefined} from 'util';
import {AngularFireStorage, AngularFireUploadTask} from 'angularfire2/storage';
import {AccountRepository} from './account/account.repository';

export abstract class AbstractRepository {

  /**
   * ---------------------------------------------------------------
   *                      Attributes
   * ---------------------------------------------------------------
   */

  /**
   * Instancia a partir do window o NProgress
   */
  private _progress = window['NProgress'];
  private _path: string = '';
  private _itemsRef: AngularFireList<any>;
  private _items: Observable<any[]>;
  private _angularFireDatabase: AngularFireDatabase;
  private _storage: AngularFireStorage;
  private _accountRepository: AccountRepository;

  /**
   * ---------------------------------------------------------------
   *                      Initializer
   * ---------------------------------------------------------------
   */

  /**
   * Inicializa o angularFireDataBase e aponta para a ALI na base
   * @param {string} path
   * @param {AngularFireDatabase} angularFireDatabase
   * @param {AngularFireStorage} angularFireStorage
   * @param {AccountRepository} accountRepository
   */
  public init(path: string, angularFireDatabase: AngularFireDatabase, angularFireStorage: AngularFireStorage, accountRepository: AccountRepository): void {
    this._path = path;
    this._angularFireDatabase = angularFireDatabase;
    this._storage = angularFireStorage;
    this._accountRepository = accountRepository;

    this._itemsRef = this._angularFireDatabase.list(this._path);

    this._progress.start();
    this._items = this._itemsRef.snapshotChanges().map(changes => {
      this._progress.done();
      return changes.map(c => ({key: c.payload.key, ...c.payload.val()}));
    });
  }

  /**
   * ---------------------------------------------------------------
   *                      DAO - DATABASE
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
   *
   * @param item
   * @returns {PromiseLike<any>}
   */
  public save(item: any): PromiseLike<any> {

    this._progress.start();

    /**
     * Trhead
     */
    return new Promise((resolve) => {

      /**
       *
       */
      this._accountRepository.handlerUser(item.uid, item.email, item.password).then(account => {

        /**
         *
         */
        if (account)
          item.uid = account.uid;

        /**
         *
         */
        this.recursiveHandler(item.key, item);

        /**
         * Se tem key atualiza o registro existente
         */
        if (item && item.key)
          this.update(item.key, item)
            .then(result => {
              resolve(result)
            });

        /**
         * Se não tem key cria um novo item
         */
        else
          this._itemsRef.push(item)
            .then(result => {
              resolve(AbstractRepository.getItemWithKey(item, result))
            });

      });

    }).then(this._progress.done());
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
   * Busca somente um ítem
   * @param {string} key
   * @returns {Observable<any>}
   */
  public findOne(key: string): Observable<any> {
    this._progress.start();
    return this._angularFireDatabase.object(this._path + '/' + key).snapshotChanges().map(changes => {
      this._progress.done();
      return {key: changes.payload.key, ...changes.payload.val()};
    });
  }

  /**
   * Remove o ítem
   * @param {string} key
   * @returns {Promise<any>}
   */
  public remove(key: string): Promise<any> {
    /**
     * Inicia o progress
     */
    this._progress.start();

    /**
     * Promisse para exclusão
     */
    return new Promise((resolve) => {
      /**
       * Executa exclusão assíncrona da conta
       */
      this.findOne(key).subscribe(result => {
        this._accountRepository.handlerUser(result.uid, null, null);
        this._itemsRef.remove(key)
          .then(this._progress.done())
          .catch(this._progress.done());
        resolve()
      });
    })
  }


  /**
   * ---------------------------------------------------------------
   *                      DAO - STORAGE
   * ---------------------------------------------------------------
   */

  /**
   *
   * @param {string} key
   * @returns {Observable<any>}
   */
  findFile(key: string): Observable<any> {
    return this._storage.ref(key).getDownloadURL();
  }

  /**
   *
   * @param {string} key
   * @param {File} file
   * @returns {Promise<any>}
   */
  saveFile(key: string, file: File): AngularFireUploadTask {
    return this._storage.upload(key, file);
  }

  /**
   *
   * @param {string} key
   * @returns {AngularFireUploadTask}
   */
  removeFile(key: string): Promise<void> {
    /**
     * Captura a exceção de not-found
     */
    return this._storage.ref(key).delete().toPromise().catch(exception => {
      console.log(exception)
    });
  }

  /**
   * ---------------------------------------------------------------
   *                      UTILS
   * ---------------------------------------------------------------
   */

  /**
   * Remove propriedades nulas ou undefined.
   * Salva arquivos (retornando a url).
   *
   * @param entryKey
   * @param entry
   */
  private recursiveHandler(entryKey, entry): void {
    let key = entryKey;
    for (const i in entry) {

      /**
       * Se a chave for igual a 'key', ou seja, igual a chave primária, armazena a mesma.
       * Para os demais handlers
       */
      if (i === 'key') {
        key = entry[i];
      }

      /**
       * Assíncrono
       * Se for null ou undefined remove o valor
       */
      if (entry[i] === null || isUndefined(entry[i])) {
        delete entry[i];
        if (key)
          this.remove(key + '/' + i);
      }

      // /**
      //  * Síncrono
      //  * Se não, e for uma instância de um arquivo, faz o upload do arquivo, retorna a url e a retorna no valor.
      //  */
      // else if (entry[i] instanceof File) {
      //
      //   console.log(this.saveFile(entry.key, entry[i]).downloadURL().subscribe(result => console.log(result)));
      //   // this.saveFile(entry.key, entry[i]).then(result => {
      //   //   entry[i] = result.downloadURL;
      //   //   console.log(entry[i]);
      //   // });
      // }
      //
      // /**
      //  * Síncrono
      //  * Se não, salva a conta do usuário caso o mesmo tenha password.
      //  */
      // else if (i === 'password') {
      // this._accountRepository.save(entry['uid'], entry['login'], entry[i])
      //   .then(result => {
      //     if (result.uid)
      //       entry['uid'] = result.uid;
      //     // resolve(entry)
      //   });
      // }

      /**
       * Se não, e for uma instância de um objeto, percorre novamente o mesmo.
       */
      else if (typeof entry[i] === 'object') {
        this.recursiveHandler(key, entry[i]);
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