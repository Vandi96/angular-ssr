import { isPlatformBrowser } from '@angular/common';
import { afterNextRender, Component, DestroyRef, inject, PLATFORM_ID, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

const VISIT_COUNT_KEY = 'angular-ssr-poc-dashboard-visits';

@Component({
  selector: 'app-dashboard',
  imports: [MatButtonModule, MatCardModule, MatChipsModule, MatDividerModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly browserActive = signal(false);
  protected readonly storageAvailable = signal('Not checked on the server');
  protected readonly userAgent = signal('Not available during server rendering');
  protected readonly viewport = signal('Not available during server rendering');
  protected readonly visits = signal<number | null>(null);

  constructor() {
    afterNextRender(() => this.initializeBrowserState());
  }

  protected resetVisits(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      localStorage.setItem(VISIT_COUNT_KEY, '0');
      this.visits.set(0);
      this.storageAvailable.set('Available');
    } catch {
      this.storageAvailable.set('Blocked or unavailable');
    }
  }

  private initializeBrowserState(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.browserActive.set(true);
    this.userAgent.set(navigator.userAgent);
    this.updateViewport();
    this.recordVisit();

    const resizeListener = () => this.updateViewport();
    window.addEventListener('resize', resizeListener);
    this.destroyRef.onDestroy(() => window.removeEventListener('resize', resizeListener));
  }

  private updateViewport(): void {
    this.viewport.set(`${window.innerWidth} × ${window.innerHeight} px`);
  }

  private recordVisit(): void {
    try {
      const nextVisitCount = Number(localStorage.getItem(VISIT_COUNT_KEY) ?? 0) + 1;
      localStorage.setItem(VISIT_COUNT_KEY, String(nextVisitCount));
      this.visits.set(nextVisitCount);
      this.storageAvailable.set('Available');
    } catch {
      this.storageAvailable.set('Blocked or unavailable');
    }
  }
}
