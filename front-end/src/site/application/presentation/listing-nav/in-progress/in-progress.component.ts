import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'in-progress',
  templateUrl: './in-progress.component.html',
  styleUrls: ['./in-progress.component.scss']
})
export class InProgressComponent implements OnInit {
  panelOpenState: boolean = false;
  
  displayedColumns: string[] = ['etapa', 'descricao', 'action'];
  dataSource = [
    {
      "nome": "Amanda Morais",
      "convocacao": ""
    },
    {
      "nome": "Jose da Silva",
      "convocacao": "1ª Convocação"
    },
    {
      "nome": "João Oliveira",
      "convocacao": ""
    }
  ]

  pessoas = [
    {
      "nome": "Amanda Morais",
      "convocacao": ""
    },
    {
      "nome": "Jose da Silva",
      "convocacao": "1ª Convocação"
    },
    {
      "nome": "João Oliveira",
      "convocacao": ""
    }
  ]

  displayedColumnsPessoas: string[] = ['nome', 'convocacao'];

  items: any[];

  constructor() { }

  ngOnInit() {
    this.items = [1, 2, 3, 4];
  }

}
