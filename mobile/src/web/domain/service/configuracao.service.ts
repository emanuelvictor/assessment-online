import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {FileRepository} from '@src/web/infrastructure/repository/file/file.repository';
import {ConfiguracaoRepository} from '@src/web/domain/repository/configuracao.repository';
import {Configuracao} from '@src/web/domain/entity/configuracao/configuracao.model';
import {environment} from '@src/environments/environment';

/**
 *
 */
@Injectable()
export class ConfiguracaoService {

  /**
   *
   * @param {FileRepository} fileRepository
   * @param {ConfiguracaoRepository} configuracaoRepository
   */
  constructor(private fileRepository: FileRepository,
              private configuracaoRepository: ConfiguracaoRepository) {
  }

  /**
   *
   * @returns {Observable<Configuracao>}
   */
  public get configuracao(): Observable<Configuracao> {
    return this.configuracaoRepository.configuracao;
  }

  /**
   *
   * @returns {Observable<Configuracao>}
   */
  public get requestConfiguracao(): Observable<Configuracao> {
    return this.configuracaoRepository.configuracao;
  }

  /**
   *
   * @param {Configuracao} configuracao
   * @returns {Promise<Configuracao>}
   */
  public save(configuracao: Configuracao): Promise<Configuracao> {

    const backgroundImageFile = configuracao.backgroundImageFile;
    const backgroundImagePath = configuracao.backgroundImagePath;

    const logoFile = configuracao.logoFile;
    const logoPath = configuracao.logoPath;

    let toSave: Configuracao = configuracao;
    toSave.backgroundImageFile = null;
    toSave.backgroundImagePath = null;
    toSave.logoFile = null;
    toSave.logoPath = null;

    return new Promise((resolve, reject) => {

      this.configuracaoRepository.save(toSave)
        .then(result => {

          toSave = result;

          if (logoFile && backgroundImageFile) {
            this.fileRepository.save(environment.endpoint + 'configuracoes/logomarca', logoFile)
              .then(uploaded => {
                toSave.logoPath = uploaded;
                this.fileRepository.save(environment.endpoint + 'configuracoes/background', backgroundImageFile)
                // tslint:disable-next-line:no-shadowed-variable
                  .then(uploaded => {
                    toSave.backgroundImagePath = uploaded;
                    resolve(toSave);
                  })
              })
          } else if (backgroundImageFile) {
            this.fileRepository.save(environment.endpoint + 'configuracoes/background', backgroundImageFile)
              .then(uploaded => {
                toSave.backgroundImagePath = uploaded;
                resolve(toSave);
              })
          } else if (logoFile) {
            this.fileRepository.save(environment.endpoint + 'configuracoes/logomarca', logoFile)
              .then(uploaded => {
                toSave.logoPath = uploaded;
                resolve(toSave);
              })
          } else if (!backgroundImagePath && !logoPath) {
            this.fileRepository.remove(environment.endpoint + 'configuracoes/logomarca')
              .then(() => {
                toSave.logoPath = null;
                this.fileRepository.remove(environment.endpoint + 'configuracoes/background')
                  .then(() => {
                    toSave.backgroundImagePath = null;
                    resolve(toSave);
                  })
              })
          } else if (!backgroundImagePath) {
            this.fileRepository.remove(environment.endpoint + 'configuracoes/background')
              .then(() => {
                toSave.backgroundImageFile = null;
                resolve(toSave);
              })
          } else if (!logoPath) {
            this.fileRepository.remove(environment.endpoint + 'configuracoes/logomarca')
              .then(() => {
                toSave.logoPath = null;
                resolve(toSave);
              })
          } else {
            resolve(result);
          }

        })

        .catch(error => {
          reject(error);
        });

    });
  }

}
