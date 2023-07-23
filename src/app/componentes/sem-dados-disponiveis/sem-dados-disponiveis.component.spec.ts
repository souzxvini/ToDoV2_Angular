import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemDadosDisponiveisComponent } from './sem-dados-disponiveis.component';

describe('SemDadosDisponiveisComponent', () => {
  let component: SemDadosDisponiveisComponent;
  let fixture: ComponentFixture<SemDadosDisponiveisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SemDadosDisponiveisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SemDadosDisponiveisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
