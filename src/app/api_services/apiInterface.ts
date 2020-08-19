import { Observable, of } from 'rxjs';

export interface ApiService{
    setting : string;
    getRaces(): Observable<JSON[]>;
    getAbilities(): Observable <JSON[]>;
    getClasses(): Observable<JSON[]>;
}