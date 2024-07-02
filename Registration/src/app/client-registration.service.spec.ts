import { TestBed } from '@angular/core/testing';

import { ClientRegistrationService } from './client-registration.service';

describe('ClientRegistrationService', () => {
  let service: ClientRegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientRegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
