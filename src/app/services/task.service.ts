import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task';
import { createGuid } from "../shared/types/guid";
import todosJson from '../todos.json';

const LS_KEY = 'taiga_todos_v2';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private todos$ = new BehaviorSubject<Task[] | null>(null);

  constructor(private http: HttpClient) {
    this.loadInitial();
  }

  private loadInitial() {
    const fromLs = localStorage.getItem(LS_KEY);
    const parsed = fromLs ? JSON.parse(fromLs) : null;

    if (Array.isArray(parsed) && parsed.length > 0) {
      console.log('Loaded from localStorage:', parsed);
      this.todos$.next(parsed);
    } else {
      console.log('Loading from JSON...');
      const tasks = todosJson as Task[];
      this.todos$.next(tasks);
      this.save(tasks);
    }
  }

  getAll(): Observable<Task[]> {
    return this.todos$.pipe(
      filter((list): list is Task[] => list !== null)
    );
  }

  toggle(id: string) {
    const next = this.todos$.value!.map(t =>
      t.id === id ? { ...t, checked: !t.checked } : t
    );
    this.todos$.next(next);
    this.save(next);
  }

  private save(list: Task[]) {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  }
}