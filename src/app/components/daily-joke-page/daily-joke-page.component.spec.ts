import { ComponentFixture, TestBed } from '@angular/core/testing';

import {  DailyJokePageComponent } from './daily-joke-page.component';

describe('DailyJokePageComponent', () => {
  let component: DailyJokePageComponent;
  let fixture: ComponentFixture<DailyJokePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyJokePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyJokePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
