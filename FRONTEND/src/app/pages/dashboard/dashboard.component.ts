import { Component, OnInit, ViewChild } from '@angular/core';
//import { TaskService } from 'src/app/services/task.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortable, Sort } from '@angular/material/sort';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import Swal from 'sweetalert2';
import { Route, Router } from '@angular/router';
import { Task } from '../../models/Task';
import { TaskService } from '../../services/task.service';
//import { Task } from 'src/app/models/Task';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  totalRows!: number;
  currentPage!: number;
  pageSize!: number;
  pageSizeOptions!: number[];
  tasks: Task[] = [];
  displayedColumns: string[] = ['taskName', 'description', 'dueDate', 'completed', 'assignedTo', 'priority', 'createdAt', 'updatedAt', 'action'];
  dataSource: MatTableDataSource<Task> = new MatTableDataSource<Task>([]);
  filterValue: string = '';
  completedFilterValue: boolean = false;
  dueDateFilterValue: Date | null = null;

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {
    this.totalRows = 0;
    this.currentPage = 0;
    this.pageSize = 10;
    this.pageSizeOptions = [5, 10, 25, 50];
  }

  ngOnInit(): void {
    this.getAllTasks();
  }

  pageChanged(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilters();
  }

  getAllTasks(): void {
    this.taskService.getAllTasks().subscribe((data: Object) => {
      this.tasks = data as Task[];
      this.applyFilters();
    });
  }

  applyFilters(): void {
    let filteredTasks = this.tasks.slice(); // Create a copy of the tasks array

    // Filter by title, description, or assigned user
    if (this.filterValue.trim() !== '') {
      const searchTerm = this.filterValue.toLowerCase().trim();
      filteredTasks = filteredTasks.filter(
        (task) =>
          (task.taskName && task.taskName.toLowerCase().includes(searchTerm)) ||
          (task.description && task.description.toLowerCase().includes(searchTerm))
      );
    }

    // Filter by completion status
    if (this.completedFilterValue) {
      filteredTasks = filteredTasks.filter((task) => task.status === 'Completed');
    }

 // Filter by due date
if (this.dueDateFilterValue !== null && this.dueDateFilterValue !== undefined) {
  filteredTasks = filteredTasks.filter((task) => {
    const taskDueDate = new Date(task.dueDate);
    const filterDueDate = new Date(this.dueDateFilterValue as unknown as string | number);

    if (!isNaN(filterDueDate.getTime())) {
      // Extract year, month, and day components for comparison
      const taskYear = taskDueDate.getFullYear();
      const taskMonth = taskDueDate.getMonth();
      const taskDay = taskDueDate.getDate();

      const filterYear = filterDueDate.getFullYear();
      const filterMonth = filterDueDate.getMonth();
      const filterDay = filterDueDate.getDate();

      // Compare only year, month, and day components
      return (
        taskYear === filterYear &&
        taskMonth === filterMonth &&
        taskDay === filterDay
      );
    }
    // Handle invalid date input if needed
    return false;
  });
}


    // Sort tasks by due date
    filteredTasks.sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      // console.log(dateA)
      // console.log('dateA')
      // console.log(dateB)
      // console.log('dateB')
      // const result1 = dateA.getTime() - dateB.getTime();
      // console.log(dateA.getTime() - dateB.getTime())
      return dateA.getTime() - dateB.getTime();
    });
    this.totalRows = filteredTasks.length;

    // Apply pagination
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = (this.currentPage + 1) * this.pageSize;
    this.dataSource.data = filteredTasks.slice(startIndex, endIndex);

  }

  editTask(taskId: number): void {
    this.router.navigate(['/update-task', taskId]);
  }

  deleteTask(taskId: number): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to delete this Task?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.taskService.removeTask(taskId).subscribe(
          () => {
            Swal.fire('Deleted!', 'Task has been deleted.', 'success');
            this.getAllTasks();
          },
          (error) => {
            console.log(error);
            Swal.fire('Error!', 'Failed to delete task.', 'error');
          }
        );
      }
    });
  }

  applyFilter(): void {
    this.currentPage = 0;
    this.applyFilters();
  }

  onCompletedFilterChange(event: MatCheckboxChange): void {
    this.completedFilterValue = event.checked;
    this.applyFilter();
  }

  onDueDateFilterChange(event: MatDatepickerInputEvent<Date>): void {
    this.dueDateFilterValue = event.value;
    this.applyFilter();
  }
}