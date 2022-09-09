import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';

import { UserService } from '../../services/user.service';
import { User } from '../../classes/user';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [UserService]
})
export class UsersComponent implements OnInit, AfterViewInit {
  users: User[] = [];

  newUser = {
    _id: '',
    name: '',
    password: '1234',
    userGroup: '',
    penalties: 0
  } as User;

  defaultFormValues = {
    name: '',
    userGroup: '',
    password: '1234'
  };
  userForm = this.formBuilder.group(this.defaultFormValues);  

  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;

  displayedColumns: string[] = ['name', 'userGroup', 'penalties', 'actions'];
  dataSource = new MatTableDataSource<User>([]);

  filterInput: string = "";
  
  constructor(
    private userService: UserService, 
    private formBuilder: FormBuilder,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  ngOnInit(): void {
    this.refreshUserList();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onSubmit(){    
    this.userService.postUser(this.newUser).subscribe((res) => {
      this.refreshUserList();
      this.resetForm();
    });      
  }

  onDelete(userId: string){
    this.userService.deleteUser(userId).subscribe(() => {
      this.refreshUserList();
    });
  }

  refreshUserList(){
    this.userService.getUsers().subscribe((res) => {
      this.users = res as User[];
      this.dataSource.data = this.users;
    });
  }

  resetForm(){
    this.userForm.setValue(this.defaultFormValues);
    this.userForm.reset(this.userForm.value);
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
