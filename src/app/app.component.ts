import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AddTaskDialogComponent } from './components/add-task-dialog/add-task-dialog.component';
import { Task } from './models/task.model';
import { ModifyTaskDialogComponent } from './components/modify-task-dialog/modify-task-dialog.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, AddTaskDialogComponent, ModifyTaskDialogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Control de Tareas - Hogla Sanchez';  // Cambio del titulo del control de tareas para reconocer al postulante
  tasks: Task[] = [];
  showDialog = false;
  showDialogModify = false;
  selectedTask: Task | null = null;

  addTask() {
    this.showDialog = true;
  }

  onTaskAdded(newTask: Task) {
    this.tasks.push(newTask);
    this.showDialog = false;
    this.showDialogModify = false;
  }

  onUpdateTaskAdded(newTask: Task) { // Metodo creado para modificar la tarea identificando el ID enviado desde el componente dialogo modificacion, reconoce la data que posee newTask, si es null significa que debe eliminarse, caso contrario se modifica con los nuevos valores
    if (this.selectedTask && newTask) {
      this.tasks = this.tasks.filter(task => task.id !== this.selectedTask!.id);
      this.selectedTask = null;
      this.tasks.push(newTask);
    }else if(this.selectedTask && newTask==null){
      this.tasks = this.tasks.filter(task => task.id !== this.selectedTask!.id);
      this.selectedTask = null;
    }
    this.showDialog = false;
    this.showDialogModify = false;
  }

  onDialogClosed() {
    this.showDialog = false;
    this.showDialogModify = false;
  }

  selectTask(task: Task) {
    this.selectedTask = task;
    this.showDialogModify = true;
  }

  deleteTask() {
    if (this.selectedTask) {
      this.tasks = this.tasks.filter(task => task.id !== this.selectedTask!.id);
      this.selectedTask = null;
    }
  }

  isTaskSelected(task: Task): boolean {
    return this.selectedTask?.id === task.id;
  }
}
