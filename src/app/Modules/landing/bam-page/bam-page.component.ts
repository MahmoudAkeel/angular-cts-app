import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bam-page',
  templateUrl: './bam-page.component.html',
  styleUrl: './bam-page.component.scss'
})
export class BamPageComponent {
  constructor(private router: Router) { }

  BAMCards = [
    {
      backgroundColor: '#DEF5FF',
      imgSrc: 'assets/images/icons/BAM.png',
      title: 'Dashboard',
      link: '/bam/dashboard',
    },
    {
      backgroundColor: '#FEEAF3',
      imgSrc: 'assets/images/icons/BAM.png',
      title: 'System Dashboard',
      link: '/bam/system-dashboard',
    }

  ];
}
