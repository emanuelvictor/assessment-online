import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {Configuracao} from '../entity/configuracao/configuracao.model';
import {ConfiguracaoRepository} from "../repositories/configuracao.repository";
import {FileRepository} from "../../infrastructure/repository/file/file.repository";

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
   * @param {Configuracao} configuracao
   * @returns {Promise<Configuracao>}
   */
  public save(configuracao: Configuracao): Promise<Configuracao> {

    const backgroundImageFile = configuracao.backgroundImageFile;
    const backgroundImagePath = configuracao.backgroundImagePath;

    const logoFile = configuracao.logoFile;
    const logoPath = configuracao.logoPath;

    let toSave: Configuracao = configuracao;
    delete toSave.backgroundImageFile;
    delete toSave.backgroundImagePath;
    delete toSave.logoFile;
    delete toSave.logoPath;

    return new Promise((resolve, reject) => {

      this.configuracaoRepository.save(toSave)
        .then(result => {

          toSave = result;

          if (backgroundImageFile && logoFile) {
            this.fileRepository.save('configuracoes/' + String(result.id) + '/logomarca', logoFile)
              .then(uploaded => {
                toSave.logoPath = uploaded;
                this.fileRepository.save('configuracoes/' + String(result.id) + '/background', backgroundImageFile)
                  .then(uploaded => {
                    toSave.backgroundImagePath = uploaded;
                    resolve(toSave);
                  })
              })
          } else if (backgroundImageFile) {
            this.fileRepository.save('configuracoes/' + String(result.id) + '/background', backgroundImageFile)
              .then(uploaded => {
                toSave.backgroundImagePath = uploaded;
                resolve(toSave);
              })
              .catch(error => {
                reject(error);
              });
          } else if (logoFile) {
            this.fileRepository.save('configuracoes/' + String(result.id) + '/logomarca', backgroundImageFile)
              .then(uploaded => {
                toSave.logoPath = uploaded;
                resolve(toSave);
              })
          }

          if (!backgroundImagePath && !logoPath) {
            this.fileRepository.remove('configuracoes/' + String(result.id) + '/logomarca')
              .then(() => {
                toSave.logoPath = null;
                this.fileRepository.remove('configuracoes/' + String(result.id) + '/background')
                  .then(() => {
                    toSave.backgroundImagePath = null;
                    resolve(toSave);
                  })
              })
          } else if (!backgroundImagePath) {
            this.fileRepository.remove('configuracoes/' + String(result.id) + '/background')
              .then(() => {
                toSave.backgroundImageFile = null;
                resolve(toSave);
              })
          } else if (!logoPath) {
            this.fileRepository.remove('configuracoes/' + String(result.id) + '/logomarca')
              .then(() => {
                toSave.logoPath = null;
                resolve(toSave);
              })
          }

          else resolve(result);

        })

        .catch(error => {
          reject(error);
        });

    });
  }

}
