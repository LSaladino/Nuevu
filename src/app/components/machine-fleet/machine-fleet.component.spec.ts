import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineFleetComponent } from './machine-fleet.component';

describe('MachineFleetComponent', () => {
  let component: MachineFleetComponent;
  let fixture: ComponentFixture<MachineFleetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MachineFleetComponent]
    });
    fixture = TestBed.createComponent(MachineFleetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
