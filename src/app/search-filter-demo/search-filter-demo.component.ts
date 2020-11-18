import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-filter-demo',
  templateUrl: './search-filter-demo.component.html',
  styleUrls: ['./search-filter-demo.component.styl']
})
export class SearchFilterDemoComponent implements OnInit {

  term: string;

  filterData = [
    {
      firstName: 'Celestine',
      lastName: 'Schimmel',
      address: '7687 Jadon Port'
    },
    {
      firstName: 'Johan',
      lastName: 'Ziemann PhD',
      address: '156 Streich Ports'
    },
    {
      firstName: 'Lizzie',
      lastName: 'Schumm',
      address: '5203 Jordon Center'
    },
    {
      firstName: 'Gavin',
      lastName: 'Leannon',
      address: '91057 Davion Club'
    },
    {
      firstName: 'Lucious',
      lastName: 'Leuschke',
      address: '16288 Reichel Harbor'
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
