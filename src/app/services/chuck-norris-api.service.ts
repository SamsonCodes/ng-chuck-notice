import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChuckNorrisApiService {
  url = "https://api.chucknorris.io/jokes/"

  constructor(private http: HttpClient) { }

  getOne(){
    return this.http.get(this.url + "random");
  }
}
