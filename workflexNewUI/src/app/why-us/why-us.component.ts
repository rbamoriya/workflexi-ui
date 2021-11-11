import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-why-us',
  templateUrl: './why-us.component.html',
  styleUrls: ['./why-us.component.scss']
})
export class WhyUsComponent implements OnInit {
  faqs: any = [{
    'que': 'What is a gig?',
    'ans': ` A Gig is a short-term job that gives you quick money. The gig duration could vary from 1day to 1year`
  },
  {
    'que': 'Who is a gig worker?',
    'ans': `A skilled professional who chooses to work on short-term assignments`
  },
  {
    'que': 'What kind of skills?',
    'ans': ` IT skills, Accounting, Taxation, Digital marketing, Interior designing, Baking, Creative skills such
    as photography, dancing, singing, sketching, cinematography etc.`
  },
  {
    'que': 'What is the duration of a gig?',
    'ans': ` Gig could be for a few months or a few days or a few hours.`
  },
  {
    'que': 'How do I register?',
    'ans': `Just click on “Get started” and register!`
  },
  {
    'que': 'Can I work as a gig worker while holding a day job?',
    'ans': `Yes, you can.`
  },
  {
    'que': 'Can I be both a gig-worker and a hirer?',
    'ans': ` Yes. You can toggle between your role, on the dashboard.`
  },
  {
    'que': 'What is the process of taking up a gig?',
    'ans': `Post your skill on Workflexi.in. Wait for an employer to shortlist you. Or actively apply for a gig.
    Chat with employers. Showcase your work. Receive and approve milestones from the employer. Once the
    employer funds his wallet, start work!`
  },
  {
    'que': 'Why should I come to Workflexi.in?',
    'ans': `  <ul>
    <li>The biggest advantage for a gig worker is on-time-payment and payment assurance without
      follow-ups.</li>
    <li>The biggest advantage for a hirer is the assurance of on time and quality work</li>
  </ul>`
  },
  {
    'que': 'Who can give me gigs?',
    'ans': `A company or an individual`
  },
  {
    'que': 'Can I give gigs to someone?',
    'ans': ` Yes. If you want a particular task to be executed, you can hire a gig worker yourself.`
  },
  {
    'que': 'Nature of different gigs?',
    'ans': `Gigs could be contractual (bound by a contract for a few months) or freelancing in nature`
  },
  {
    'que': 'How much do I have to pay?',
    'ans': ` <ul>
    <li>Nothing, if you are a gig worker</li>
    <li>Pay-as-you-go, for the hirer. 15% mark up fee on every gig.</li>
  </ul>`
  },
  {
    'que': 'What kind of gigs can I find on Workflexi.in?',
    'ans': ` Technical, non-technical and creative gigs`
  },
  {
    'que': 'Examples for technical gigs?',
    'ans': ` Mobile app development, web development, UI/UX, graphic designer`
  },
  {
    'que': 'Examples for non-technical gigs?',
    'ans': `Digital marketing expert, taxation work, accounting work, online sales, trainer`
  },
  {
    'que': 'Examples for creative gigs?',
    'ans': `Cinematographer, photographer, art director, costume designer`
  },
  {
    'que': 'Examples for passion related gigs?',
    'ans': `Trek co-ordinator, Pottery trainer, cycling expedition co-ordinator`
  },
  {
    'que': 'What remuneration can I expect?',
    'ans': `Varies from INR 500 to INR50,000 per gig`
  },

  ];
  panelOpenState = true;
  constructor() { }

  ngOnInit() {
  }

}
