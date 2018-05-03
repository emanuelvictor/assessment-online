import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-conclusao',
  templateUrl: './conclusao.component.html',
  styleUrls: ['./conclusao.component.scss']
})
export class ConclusaoComponent implements OnInit {
  /**
   *
   */
  constructor(private router: Router) {
  }

  /**
   *
   */
  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['/avaliar']);
    }, 5000);
  }
}
