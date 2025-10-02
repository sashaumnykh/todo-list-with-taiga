import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { TaskService } from './services/task.service';
import { Task } from './models/task';
import { Observable, combineLatest, debounceTime, map, startWith, switchMap } from 'rxjs';

import { TuiIcon, TuiRoot, TuiTitle } from '@taiga-ui/core';
import { TuiDialog } from '@taiga-ui/core';
import { TuiBlock, TuiCheckbox, TuiTooltip } from '@taiga-ui/kit';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    TuiRoot,
    TuiDialog,
    TuiCheckbox,
    TuiButton,
    TuiBlock,
    TuiIcon,
    TuiTitle,
    TuiTooltip,
  ],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
  searchControl = new FormControl('');
  tasks$!: Observable<Task[]>;
  newTitle = '';

  editingId: string | null = null;
  editingTitle = '';

  constructor(private svc: TaskService) {}

  ngOnInit() {
    this.tasks$ = combineLatest([
      this.svc.getAll(),                      // поток актуальных задач
      this.searchControl.valueChanges.pipe(
        startWith(this.searchControl.value ?? ''),
        debounceTime(150)
      )
    ]).pipe(
      map(([list, query]) => {
        const q = (query || '').toLowerCase();
        return q ? list.filter(t => t.title.toLowerCase().includes(q)) : list;
      })
    );
  }

  toggle(id: string) {
    debugger;
    this.svc.toggle(id);
  }
}