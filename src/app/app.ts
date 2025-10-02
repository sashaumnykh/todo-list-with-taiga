import { Component } from '@angular/core';
import { TodoListComponent } from './todo-list.component';
import { TuiRoot } from '@taiga-ui/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ TodoListComponent, TuiRoot ],
  template: `
    <div class="app-shell">
        <app-todo-list></app-todo-list>
    </div>
  `,
  styles: [`.app-shell { max-width: 720px; margin: 32px auto; padding: 16px; }`]
})
export class App {
  // <app-todo-list></app-todo-list>
}