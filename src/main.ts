import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import {provideEventPlugins} from '@taiga-ui/event-plugins';

bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideEventPlugins(),
    // importProvidersFrom(TuiRoot),
  ],
}).catch(err => console.error(err));
