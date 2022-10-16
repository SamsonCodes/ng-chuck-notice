import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChuckNorrisApiService {
  url = "https://api.chucknorris.io/jokes/"
  dailyUrl = "http://localhost:3000/api/daily-joke"

  constructor(private http: HttpClient) { }

  getOne(){
    return this.http.get(this.url + "random");
  }

  getDaily(){
    return this.http.get(this.dailyUrl);
  }
}
