import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiyPageComponent } from './diy-page.component';

describe('DiyPageComponent', () => {
  let component: DiyPageComponent;
  let fixture: ComponentFixture<DiyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiyPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
