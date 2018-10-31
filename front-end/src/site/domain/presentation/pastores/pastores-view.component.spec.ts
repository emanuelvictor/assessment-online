import { TestBed, async } from '@angular/core/testing';

import { PastoresViewComponent } from './pastores-view.component';

describe('PastoresViewComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PastoresViewComponent
      ],
    }).compileComponents();
  }));

  it('should create the web', async(() => {
    const fixture = TestBed.createComponent(PastoresViewComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(PastoresViewComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app');
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(PastoresViewComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to web!');
  }));
});
