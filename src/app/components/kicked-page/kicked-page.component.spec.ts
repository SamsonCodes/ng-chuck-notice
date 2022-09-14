import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KickedPageComponent } from './kicked-page.component';

describe('KickedPageComponent', () => {
  let component: KickedPageComponent;
  let fixture: ComponentFixture<KickedPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KickedPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KickedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
