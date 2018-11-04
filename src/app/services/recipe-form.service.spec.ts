import { TestBed } from '@angular/core/testing';

import { RecipeFormService } from './recipe-form.service';

describe('RecipeFormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecipeFormService = TestBed.get(RecipeFormService);
    expect(service).toBeTruthy();
  });
});
