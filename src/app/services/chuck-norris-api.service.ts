import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { capitalizeFirstLetter } from '../helpers/stringHelper';

@Injectable({
  providedIn: 'root'
})
export class ChuckNorrisApiService {
  url = "https://api.chucknorris.io/jokes/"
  dailyUrl = "http://localhost:3000/api/daily-joke"

  constructor(private http: HttpClient) { }

  getOne(): Observable<string>{
    let observable = new Observable<string>(subscriber => {
      this.http.get(this.url + "random").subscribe(response => {
        let resAny = response as any;
        let joke = capitalizeFirstLetter(resAny.value);
        subscriber.next(joke);
        subscriber.complete();
      })
    })
    return observable;
  }

  getDaily(): Observable<string>{
    let observable = new Observable<string>(subscriber => {
      this.http.get(this.dailyUrl).subscribe(response => {
        let resAny = response as any;
        let joke = capitalizeFirstLetter(resAny.joke);
        subscriber.next(joke);
        subscriber.complete();
      })
    })
    return observable;
  }
}
