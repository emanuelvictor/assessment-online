import {Observable} from 'rxjs/Observable';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {isUndefined} from 'util';
import {AngularFireStorage} from 'angularfire2/storage';
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
  public saveWithAccount(item: any): PromiseLike<any> {

    /**
     *
     */
    this._progress.start();

    /**
     * Trhead
     */
    return new Promise((resolve) => {

      /**
       *
       */
      if (item.email)
        this._accountRepository.handlerUser(item.uid, item.email, item.password, item.urlFile, item.nome)
          .then(account => {

            /**
             *
             */
            if (account && account.uid)
              item.uid = account.uid;

            /**
             *
             */
            this.save(item)
              .then(result => resolve(result))

          });

      /**
       *
       */
      else
        this.save(item)
          .then(result => resolve(result))

    }).then(this._progress.done());
  }

  /**
   *
   * @param item
   * @returns {PromiseLike<any>}
   */
  public save(item): PromiseLike<any> {
    /**
     *
     */
    this.recursiveHandler(item.key, item);

    /**
     * Se tem key atualiza o registro existente
     */
    if (item && item.key)
      return this.update(item.key, item);

    /**
     * Se não tem key cria um novo item
     */
    else
      return this._itemsRef.push(item)
        .then(result =>
          AbstractRepository.getItemWithKey(item, result)
        );
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
          // resolve(item);
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
   *
   * @param item
   * @returns {Promise<any>}
   */
  public remove(item: any): Promise<any> {
    /**
     * Inicia o progress
     */
    this._progress.start();

    /**
     * Executa exclusão assíncrona da foto
     */
    this._storage.ref(item.key).delete().toPromise()
      .catch(exception => {
        console.log(exception)
      });

    /**
     * Executa exclusão assíncrona da conta
     */
    if (item.uid)
      this._accountRepository.handlerUser(item.uid, null, null, null, null);

    /**
     * Remove o item em si
     */
    return this._itemsRef.remove(item.key)
      .then(this._progress.done())
      .catch(this._progress.done());
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
      if (entry[i] === null || isUndefined(entry[i]) || (typeof entry[i] === "string" && entry[i].length === 0)) {
        delete entry[i];
        if (key) {
          this._itemsRef.remove(key + '/' + i)
            .then(this._progress.done())
            .catch(this._progress.done());

          /**
           * Está atualizando usuário e removendo o email
           * ou Seja revogando o acesso
           */
          if (i === 'email' /*&& entry['uid']*/) {
            this._accountRepository.handlerUser(entry['uid'], null, null, null, null);
            delete entry['uid'];
            delete entry['password'];
            this._itemsRef.remove(key + '/uid')
              .then(this._progress.done())
              .catch(this._progress.done());
            this._itemsRef.remove(key + '/password')
              .then(this._progress.done())
              .catch(this._progress.done());
          }
        }
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