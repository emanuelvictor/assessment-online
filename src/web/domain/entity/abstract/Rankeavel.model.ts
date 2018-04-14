import {Abstract} from './Abstract.model';

export abstract class Rankeavel extends Abstract {

  public nome: string;

  public posicao: number;

  public avaliacoes1 = 0;

  public avaliacoes2 = 0;

  public avaliacoes3 = 0;

  public avaliacoes4 = 0;

  public avaliacoes5 = 0;

  public media = 0;
}


/**
 *
 * @returns {number}
 */
export function calcularMedia(avaliavel): number {

  if (!avaliavel) return 0;

  let avaliacoes1 = 0;

  let avaliacoes2 = 0;

  let avaliacoes3 = 0;

  let avaliacoes4 = 0;

  let avaliacoes5 = 0;
  let soma = 0;
  if (avaliavel.avaliacoes1) {
    soma = soma + avaliavel.avaliacoes1;
    avaliacoes1 = avaliavel.avaliacoes1 * 2;
  }
  if (avaliavel.avaliacoes2) {
    avaliacoes2 = avaliavel.avaliacoes2 * 2;
    soma = soma + avaliavel.avaliacoes2;
  }
  if (avaliavel.avaliacoes3) {
    avaliacoes3 = avaliavel.avaliacoes3 * 3;
    soma = soma + avaliavel.avaliacoes3;
  }
  if (avaliavel.avaliacoes4) {
    avaliacoes4 = avaliavel.avaliacoes4 * 4;
    soma = soma + avaliavel.avaliacoes4;
  }
  if (avaliavel.avaliacoes5) {
    avaliacoes5 = avaliavel.avaliacoes5 * 5;
    soma = soma + avaliavel.avaliacoes5;
  }

  const somaMedia = avaliacoes1 + avaliacoes2 + avaliacoes3 + avaliacoes4 + avaliacoes5;
  return (somaMedia / soma);
}
