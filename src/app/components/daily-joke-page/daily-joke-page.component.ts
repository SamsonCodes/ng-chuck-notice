import { Component, OnInit } from '@angular/core';
import { ChuckNorrisApiService } from 'src/app/services/chuck-norris-api.service';

@Component({
  selector: 'app-daily-joke-page',
  templateUrl: './daily-joke-page.component.html',
  styleUrls: ['./daily-joke-page.component.css']
})
export class DailyJokePageComponent implements OnInit {
  fact = "";
  constructor(private chuckService: ChuckNorrisApiService) { }

  ngOnInit(): void {
    this.chuckService.getDaily().subscribe(joke => {      
      this.fact = joke;
    })
  }

}
