import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

interface BlogPost {
  category: string;
  date: string;
  excerpt: string;
  number: string;
  readTime: string;
  title: string;
}

@Component({
  selector: 'app-blog',
  imports: [MatCardModule, MatChipsModule],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class Blog {
  protected readonly posts: BlogPost[] = [
    {
      number: '01',
      category: 'Field notes',
      title: 'The quiet pleasure of pages that arrive finished',
      excerpt: 'A short meditation on fast HTML, slow coffee and removing unnecessary suspense.',
      date: 'June 28, 2026',
      readTime: '4 min read',
    },
    {
      number: '02',
      category: 'Objects',
      title: 'We tested four mugs. One was already prerendered.',
      excerpt: 'The methodology was questionable. The resulting coffee was surprisingly robust.',
      date: 'June 19, 2026',
      readTime: '6 min read',
    },
    {
      number: '03',
      category: 'Dispatch',
      title: 'Postcards from the edge of the hydration boundary',
      excerpt: 'What the server knows, what the browser discovers and why both can remain friends.',
      date: 'June 7, 2026',
      readTime: '5 min read',
    },
  ];
}
