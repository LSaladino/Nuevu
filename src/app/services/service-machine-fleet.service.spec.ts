import { TestBed } from '@angular/core/testing';

import { ServiceMachineFleetService } from './service-machine-fleet.service';

describe('ServiceMachineFleetService', () => {
  let service: ServiceMachineFleetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceMachineFleetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
