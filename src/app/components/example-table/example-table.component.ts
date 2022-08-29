import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-example-table',
  templateUrl: './example-table.component.html',
  styleUrls: ['./example-table.component.css']
})
export class ExampleTableComponent implements OnInit {
  exrows = [
    { name: 'Austin', gender: 'Male', company: 'Swimlane' },
    { name: 'Dany', gender: 'Male', company: 'KFC' },
    { name: 'Molly', gender: 'Female', company: 'Burger King' }
  ];
  rows:any[] = []
  columns = [{ prop: 'name' }, { name: 'Gender' }, { name: 'Company' }];
  
  constructor() { }

  ngOnInit(): void {
    for(let i = 0; i < 10; i++){
      this.exrows.forEach(row=>{
        this.rows.push(row);
      })
    }
  }

}
