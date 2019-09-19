import {Injectable} from '@angular/core';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';
import {HttpClient} from '@angular/common/http';
import {Dispositivo} from "../entity/avaliacao/dispositivo.model";
import {UnidadeTipoAvaliacaoDispositivo} from "../entity/avaliacao/unidade-tipo-avaliacao-dispositivo.model";

@Injectable()
export class DispositivoRepository extends BaseRepository<Dispositivo> {

  /**
   *
   * @param httpClient
   */
  constructor(httpClient: HttpClient) {
    super(httpClient, 'dispositivos');
  }

  /**
   *
   * @param id
   * @param unidadesTiposAvaliacoesDispositivo
   */
  saveUnidadesTiposAvaliacoesDispositivo(id: number, unidadesTiposAvaliacoesDispositivo: UnidadeTipoAvaliacaoDispositivo[]): Promise<any> {
    return this.httpClient.put<any>(this.collectionName + '/' + id + '/unidadesTiposAvaliacoesDispositivo', unidadesTiposAvaliacoesDispositivo).toPromise();
  }

  /**
   *
   * @param numeroSerie
   * @param senha
   */
  authenticate(numeroSerie: string, senha: string): Promise<Dispositivo> {

    return new Promise((resolve, reject) => {

      const dispositivo: Dispositivo = new Dispositivo();
      dispositivo.senha = senha;
      dispositivo.numeroSerie = numeroSerie;

      this.httpClient.post<Dispositivo>(this.collectionName + '/authenticate', dispositivo)
        .toPromise()
        .then(result => {
          resolve(result)
        })
        .catch(error => reject(error))
    })
  }

  /**
   *
   * @param numeroLiceca
   * @param numeroSerie
   */
  getDispositivo(numeroLiceca: number, numeroSerie: string): Promise<Dispositivo> {
    return this.httpClient.get<Dispositivo>(this.collectionName + '/' + numeroLiceca + '?numeroSerie=' + numeroSerie).toPromise();
  }
}
