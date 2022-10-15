import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';

import { Observable, combineLatest } from 'rxjs';
import { defaultIfEmpty, switchMap } from 'rxjs/operators';

import { TaskService } from '../../services/task.service';
import { Task } from '../../classes/task';
import { convertToDateString } from '../../helpers/dateHelper';
import { User } from 'src/app/classes/user';
import { UserService } from 'src/app/services/user.service';
import { Assignment } from 'src/app/classes/assignment';
import { AssignmentService } from 'src/app/services/assignment.service';
import { Dependency } from 'src/app/classes/dependency';
import { DependencyService } from 'src/app/services/dependency.service';
import { AuthService } from 'src/app/services/auth.service';



@Component({
  selector: 'tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  providers: [TaskService]
})
export class TasksComponent implements OnInit, AfterViewInit {
  tasks: Task[] = [];

  defaultValues = {
    _id: '',
    title: 'Title',
    description: '',
    deadline: '',
    status: 'open',    
    created_by: '62e3e215e4c239fe3041682c',
    created_on: ''
  }

  selectConfig = {
    valueField: "value",
    labelField: "label",
    highlight: false,
    create: false,
    persist: true,
    plugins: ['dropdown_direction', 'remove_button'],
    dropdownDirection: 'down',
    searchField: ['label']
  };
  data = [
    {
      label: 'Option 1',
      value: '1'
    },
      {
      label: 'Option 2',
      value: '2'
    },
      {
      label: 'Option 3',
      value: '3'
    }
  ]

  newTask = Object.assign({}, this.defaultValues) as Task;

  taskForm = this.fb.group({
    title: this.newTask.title,
    description: this.newTask.description,
    deadline: this.newTask.deadline,
    status: this.newTask.status,
    assignments: this.fb.array([]),
    dependencies: this.fb.array([])
  });

  allUsers: User[] = [];

  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;

  displayedColumns: string[] = ['title', 'description', 'deadline', 'status', 'created_on', 'actions'];
  dataSource = new MatTableDataSource<Task>([]);

  filterInput: string = "";
  
  constructor(
    private taskService: TaskService,
    private userService: UserService, 
    private assignmentService: AssignmentService,
    private dependencyService: DependencyService,
    private fb: FormBuilder,
    private authService: AuthService,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {    
    this.refreshTaskList();
    this.getAllUsers();
  }

  getAllUsers(): void {
    this.userService.getUsers().subscribe((res)=>{
      this.allUsers = res as User[];  
    });
  }
  
  refreshTaskList(){
    if(!this.authService.hasManagerRights()){ // If no manager rights then only get USER tasks
      let userId = this.authService.getUser()!._id;
      this.taskService.getUserTasks(userId).subscribe((res) => {
        this.tasks = res as Task[];
        this.dataSource.data = this.tasks;
        this.createSelectOptions();
      });
    }
    else{
      this.taskService.getTasks().subscribe((res) => { // Otherwise get ALL the tasks
        this.tasks = res as Task[];      
        this.dataSource.data = this.tasks;  
        this.createSelectOptions();
      });
    }  
  }

  createSelectOptions(){
    let options = []
    for(let i = 0; i < this.tasks.length; i++){
      let dataObject = {
        'label': this.tasks[i].title,
        'value': this.tasks[i]._id
      }
      options.push(dataObject);
    }
    this.data = options;
  }

  onSubmit(){        
    this.newTask.created_on = this.getCreatedOn();
    this.taskService.postTask(this.newTask).pipe(
      //Using a switchMap here to make sure all the database updates are finished before refreshing the task list.      
      switchMap((taskData) => {
        let task = taskData as Task;
        
        let assignments: string[] = [];
        if(this.hasManagerRights()){          
          assignments = this.taskForm.value.assignments;
        }
        else{
          let id = this.authService.getUser()!._id;
          assignments = [id!]; // Only add assignment to current user         
        }

        let observableList = [];
        observableList.push(this.submitAssignments(assignments, task._id));
        observableList.push(this.submitDependencies(this.taskForm.value.dependencies, task._id));
        return combineLatest(observableList);
      }),
      defaultIfEmpty()
    ).subscribe(()=>{        
      this.refreshTaskList();
      this.resetForm();
    });
  }

  submitAssignments(formAssignmentValues: Array<string>, taskId: string): Observable<Object[]>{  
    let formAmount = formAssignmentValues.length;
    let databaseCalls = [];
    for(let i = 0; i < formAmount; i++){
      let newAssignment: Assignment = 
      {
        _id: '',
        user_id: formAssignmentValues[i],
        task_id: taskId
      };
      databaseCalls.push(this.assignmentService.postAssignment(newAssignment));
    }
    return combineLatest(databaseCalls);
  }

  submitDependencies(formDependencyValues: Array<string>, taskId: string): Observable<Object[]> {
    let formAmount = formDependencyValues.length;
    
    let databaseCalls = [];
    for(let i = 0; i < formAmount; i++){
      let newDependency: Dependency = 
      {
        _id: '',
        dependency_id: formDependencyValues[i],
        task_id: taskId
      };
      databaseCalls.push(this.dependencyService.postDependency(newDependency));
    } 
    return combineLatest(databaseCalls);
  }


  getCreatedOn(){
    var today = new Date();
    var todayString = convertToDateString(today);
    return todayString
  }

  resetForm(){
    this.newTask = Object.assign({}, this.defaultValues) as Task;
  
    this.taskForm = this.fb.group({
      title: this.newTask.title,
      description: this.newTask.description,
      deadline: this.newTask.deadline,
      status: this.newTask.status,
      assignments: this.fb.array([]),
      dependencies: this.fb.array([])
    });
  }

  onDelete(taskId: string){
    this.taskService.deleteTask(taskId).subscribe(() => {
      this.refreshTaskList();
    });
  }  

  get formAssignments(){
    //Allows us to easily access the assignment form array in the functions below.
    return this.taskForm.get('assignments') as FormArray;
  }

  addFormAssignment(): void {    
    this.formAssignments.push(this.fb.control(''));
  }

  removeFormAssignment(i: number): void {    
    this.formAssignments.removeAt(i);
  }

  get formDependencies(){
    //Allows us to easily access the dependency form array in the functions below.
    return this.taskForm.get('dependencies') as FormArray;
  }

  addFormDependency(): void {
    this.formDependencies.push(this.fb.control(''));
    this.taskForm.patchValue({status: 'waiting'});
  }

  removeFormDependency(i: number): void {
    this.formDependencies.removeAt(i);
    if(this.formDependencies.length == 0){
      this.taskForm.patchValue({status: 'open'});
    }
  }

  hasManagerRights(): boolean {
    return this.authService.hasManagerRights();
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  onFilterChange() {
    console.log(this.filterInput);
    let filterValue = this.filterInput.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
