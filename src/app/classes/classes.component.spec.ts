import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassesComponent } from './classes.component';
import { DndApiService } from '../api_services/dndapi.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs';
import { ApiSelectorService } from '../api_services/api-selector.service';

describe('ClassesComponent', () => {
  let component: ClassesComponent;
  let dndapiService: DndApiService;
  let apiSelectorService: ApiSelectorService;
  let spy: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassesComponent ],
      imports: [ HttpClientTestingModule ],
      providers: [
        ClassesComponent,
        { provide: DndApiService, useClass: MockDndApiService }
      ]
    });

    component = TestBed.inject(ClassesComponent);
    dndapiService = TestBed.inject(DndApiService);
    apiSelectorService = TestBed.inject(ApiSelectorService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not have a value for the tableTopClasses variable after construction', () => {
    expect(component.tableTopClasses).toBeUndefined();
  });

  it('should get values for the tableTopClasses variable after Angular calls ngOnInit', () => {
    spy = spyOn(apiSelectorService, 'getApi').and.returnValue(dndapiService);
    component.ngOnInit();
    let temp;
    dndapiService.getClasses()
      .subscribe(
        res => {
          temp = res['results'];
          expect(component.tableTopClasses).toEqual(temp);
        }
      );
  });

  it('should be able to add a tableTopClass to the tableTopClasses variable', () => {
    spy = spyOn(apiSelectorService, 'getApi').and.returnValue(dndapiService);
    component.ngOnInit();
    const newClassObj = {
      index: 'test',
      name: 'test',
      url: 'test'
    };
    const expectedOutput: JSON[] = [
      JSON.parse(JSON.stringify({
        index: 'barbarian',
        name: 'Barbarian',
        url: '/api/classes/barbarian'
      })),
      JSON.parse(JSON.stringify({
        index: 'test',
        name: 'test',
        url: 'test'
      })),
    ];
    const newClass: JSON = JSON.parse(JSON.stringify(newClassObj));
    component.addClass(newClass);
    expect(component.tableTopClasses).toEqual(expectedOutput);
  });
});

class MockDndApiService {
  test = {
    count: 1,
    results: [
      {
        index: 'barbarian',
        name: 'Barbarian',
        url: '/api/classes/barbarian'
      }
    ]
  };
  // classes is test in string form for JSON.parse()
  races = '{"count": 1,"results": [{"index": "barbarian", "name": "Barbarian", "url": "/api/classes/barbarian"}]}';

  testArray: JSON[] = JSON.parse(this.races);

  observable = new Observable<JSON[]>((observer => {
    observer.next(this.testArray);
    observer.complete();
  }));

  getClasses(): Observable<JSON[]> {
    return this.observable;
  }
}
