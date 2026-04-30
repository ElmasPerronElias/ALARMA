import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Instituciones } from './instituciones';

describe('Instituciones', () => {
  let component: Instituciones;
  let fixture: ComponentFixture<Instituciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Instituciones],
    }).compileComponents();

    fixture = TestBed.createComponent(Instituciones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
