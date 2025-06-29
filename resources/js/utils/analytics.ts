interface AnalyticsData {
  page_url: string;
  page_title?: string;
  time_on_page?: number;
  screen_width?: number;
  screen_height?: number;
}

class AnalyticsTracker {
  private startTime: number;
  private currentPage: string;
  private isTracking: boolean = false;

  constructor() {
    this.startTime = Date.now();
    this.currentPage = window.location.href;
    this.init();
  }

  private init(): void {
    // Track initial page view
    this.trackPageView();

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.updateTimeOnPage();
      } else {
        this.startTime = Date.now();
      }
    });

    // Track before unload
    window.addEventListener('beforeunload', () => {
      this.updateTimeOnPage();
    });

    // Track navigation (for SPA)
    if (window.history && window.history.pushState) {
      const originalPushState = window.history.pushState;
      const originalReplaceState = window.history.replaceState;

      window.history.pushState = (...args) => {
        originalPushState.apply(window.history, args);
        this.handlePageChange();
      };

      window.history.replaceState = (...args) => {
        originalReplaceState.apply(window.history, args);
        this.handlePageChange();
      };

      window.addEventListener('popstate', () => {
        this.handlePageChange();
      });
    }
  }

  private handlePageChange(): void {
    // Update time on current page before tracking new page
    this.updateTimeOnPage();
    
    // Update current page
    this.currentPage = window.location.href;
    
    // Track new page view
    this.trackPageView();
  }

  private trackPageView(): void {
    if (this.isTracking) return;

    const data: AnalyticsData = {
      page_url: window.location.href,
      page_title: document.title,
      screen_width: window.screen.width,
      screen_height: window.screen.height,
    };

    this.sendAnalytics(data);
  }

  private updateTimeOnPage(): void {
    const timeOnPage = Math.floor((Date.now() - this.startTime) / 1000);
    
    if (timeOnPage > 0) {
      const data: AnalyticsData = {
        page_url: this.currentPage,
        page_title: document.title,
        time_on_page: timeOnPage,
        screen_width: window.screen.width,
        screen_height: window.screen.height,
      };

      this.sendAnalytics(data);
    }
  }

  private async sendAnalytics(data: AnalyticsData): Promise<void> {
    try {
      this.isTracking = true;
      
      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.warn('Analytics tracking failed:', response.status);
      }
    } catch (error) {
      console.warn('Analytics tracking error:', error);
    } finally {
      this.isTracking = false;
    }
  }

  // Public method to manually track events
  public trackEvent(eventName: string, eventData: Record<string, any> = {}): void {
    const data: AnalyticsData = {
      page_url: window.location.href,
      page_title: document.title,
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      ...eventData,
    };

    this.sendAnalytics(data);
  }
}

// Initialize analytics tracker
let analyticsTracker: AnalyticsTracker | null = null;

export const initAnalytics = (): void => {
  if (!analyticsTracker) {
    analyticsTracker = new AnalyticsTracker();
  }
};

export const trackEvent = (eventName: string, eventData: Record<string, any> = {}): void => {
  if (analyticsTracker) {
    analyticsTracker.trackEvent(eventName, eventData);
  }
};

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnalytics);
  } else {
    initAnalytics();
  }
} 