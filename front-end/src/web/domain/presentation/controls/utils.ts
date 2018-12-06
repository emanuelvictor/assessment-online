import {Configuracao} from "../../entity/configuracao/configuracao.model";

export const single = [
  {
    "name": new Configuracao().um,
    "value": 0,
  },
  {
    "name": new Configuracao().dois,
    "value": 0,
  },
  {
    "name": new Configuracao().tres,
    "value": 0,
  },
  {
    "name": new Configuracao().quatro,
    "value": 0,
  },
  {
    "name": new Configuracao().cinco,
    "value": 0,
  }
];


export function getIdentifier(): string {
  return Math.floor(Math.random() * 2000).toString();
}

export const TOKEN_NAME = 'assessment-token';