import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarPastorComponent } from './visualizar-pastor.component';

describe('VisualizarPastorComponent', () => {
  let component: VisualizarPastorComponent;
  let fixture: ComponentFixture<VisualizarPastorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizarPastorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizarPastorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
