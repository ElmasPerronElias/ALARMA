import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sedes } from './sedes';

describe('Sedes', () => {
  let component: Sedes;
  let fixture: ComponentFixture<Sedes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Sedes],
    }).compileComponents();

    fixture = TestBed.createComponent(Sedes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
