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
import { Guid } from './shared/types/guid';

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
    TuiTooltip,
  ],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
  searchControl = new FormControl('');
  tasks$!: Observable<Task[]>;
  newTitle = '';

  editingId: Guid | null = null;
  editingTitle = '';

  controls: { [id: string]: FormControl } = {};

  maxTitleLength: number = 150;

  constructor(private svc: TaskService) {}

  ngOnInit() {
    this.tasks$ = combineLatest([
      this.svc.getAll(),                      // поток актуальных задач
      this.searchControl.valueChanges.pipe(
        startWith(''),
        debounceTime(150)
      )
    ]).pipe(
      map(([list, query]) => {
        if (!list) return [];
        list.forEach(task => {
          if (!this.controls[task.id]) {
            this.controls[task.id] = new FormControl(task.checked);
            this.controls[task.id].valueChanges.subscribe(val => {
              this.svc.toggle(task.id);
            });
          }
        });

        console.log(list.length);

        const q = (query || '').toLowerCase();
        return q ? list.filter(t => t.title.toLowerCase().includes(q)) : list;
      })
    );
  }

  toggle(id: string) {
    this.svc.toggle(id);
  }

  add() {
    const title = this.newTitle.trim();
    if (!title) return;

    this.svc.add(title);
    this.newTitle = '';
  }

  startEditing(task: Task) {
    this.editingId = task.id;
    this.editingTitle = task.title;
    setTimeout(() => {
      const el = document.getElementById(`edit-${task.id}`);
      el?.focus();
    });
  }

  cancelEditing() {
    this.editingId = null;
    this.editingTitle = '';
  }

  saveChanges() {
    if (this.editingId) {
      this.svc.update({ 
        id: this.editingId, 
        title: this.editingTitle, 
        checked: this.controls[this.editingId].value 
      });
      this.editingId = null;
      this.editingTitle = '';
    }
  }

  delete(id: string) {
    if(confirm('Вы уверены, что хотите удалить задачу?')) {
      this.svc.delete(id);
    }
  }

  /*
  highlightMatch(text: string, query: string): string {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }
  */
}