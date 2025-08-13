import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-carga-masiva-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="dialog-overlay" (click)="close()">
      <div class="dialog-content" (click)="$event.stopPropagation()">
        <h2>Carga masiva</h2>
        <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
          <div class="form-group row">
            <label for="title">Ingreso de tareas</label>
            <textarea 
               class="form-control"
               id="mensaje"
               rows="6"
               cols="12"
            ></textarea>
          </div>
          
          
          <div class="dialog-actions">
            <button type="button" class="btn btn-secondary" (click)="close()">Cancelar</button>
            <button type="button" class="btn btn-secondary" (click)="obtenerValor()">Agregar</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    
    .dialog-content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      min-width: 400px;
    }
    
    h2 {
      margin-top: 0;
      margin-bottom: 1.5rem;
      color: #333;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #555;
    }
    
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      box-sizing: border-box;
    }
    
    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
    
    .error {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1.5rem;
    }
    
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .btn-primary {
      background-color: #007bff;
      color: white;
    }
    
    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }
    
    .btn-primary:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }
    
    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }
    
    .btn-secondary:hover {
      background-color: #545b62;
    }
  `]
})
export class CargaMasivaDialogComponent {
  @Output() taskAdded = new EventEmitter<Task>();
  @Output() dialogClosed = new EventEmitter<void>();
  
  taskForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      data: ['', [Validators.required,]]
    });
  }
  
  onSubmit() {
    if (this.taskForm.valid) {
      const newTask: Task = {
        id: Date.now(), // Generar ID único
        title: this.taskForm.value.title,
        duration: this.taskForm.value.duration
      };
      
      this.taskAdded.emit(newTask);
      this.close();
    } 
  }
  obtenerValor() { // este es el metodo que verifica el texto entrante y los separa para formar una tarea por linea
  const textarea = document.getElementById("mensaje") as HTMLTextAreaElement; // Se obtiene el valor del text area
  const valor = textarea.value.trim(); // se asigna el valor del text area 

  // Dividir por líneas
  const lineas = valor.split("\n").map(linea => linea.trim()).filter(l => l);

  // Convertir cada línea en una tarea
  const tareas: Task[] = lineas.map(linea => {
    const partes = linea.split("|").map(p => p.trim());

    const title = partes[0] || '';
    const duration = partes.length > 1 && partes[1] !== '' 
      ? Number(partes[1]) || 10   // Si no es número válido, usa 10
      : 10;                       // Si no hay segunda parte, usa 10

    return {
      id: Math.floor(Date.now() + Math.random() * 10000),
      title,
      duration
    };
  });

  // Emitir cada tarea
  tareas.forEach(tarea => this.taskAdded.emit(tarea));

  // Limpiar y cerrar
  textarea.value = '';
  this.close();
}
  
  close() {
    this.dialogClosed.emit();
  }
} 