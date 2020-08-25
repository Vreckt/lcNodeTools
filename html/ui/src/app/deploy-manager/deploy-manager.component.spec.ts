import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeployManagerComponent } from './deploy-manager.component';

describe('DeployManagerComponent', () => {
  let component: DeployManagerComponent;
  let fixture: ComponentFixture<DeployManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeployManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeployManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
