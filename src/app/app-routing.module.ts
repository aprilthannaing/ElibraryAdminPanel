import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserLoginComponent } from './user-login/user-login.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BookComponent } from './book/book.component';
import { MagazineComponent } from './magazine/magazine.component';
import { JournalComponent } from './journal/journal.component';
import { UserComponent } from './user/user.component';
import { UserListComponent } from './user-list/user-list.component';
import { DepartmentComponent } from './department/department.component';
import { PositionComponent } from './position/position.component';
import { LibrarianComponent } from './librarian/librarian.component';
import { ExportComponent } from './export/export.component';
import { ImportComponent } from './import/import.component';
import { AccountsettingComponent } from './accountsetting/accountsetting.component';
import { SearchFilterDemoComponent } from './search-filter-demo/search-filter-demo.component';
import { BookaddcategoryComponent } from './bookaddcategory/bookaddcategory.component';
import { BookaddauthorComponent } from './bookaddauthor/bookaddauthor.component';
import { BookaddsubcategoryComponent } from './bookaddsubcategory/bookaddsubcategory.component';
import { BookaddpublisherComponent } from './bookaddpublisher/bookaddpublisher.component';
import { BookaddComponent } from './bookadd/bookadd.component';
import { BookeditComponent } from './bookedit/bookedit.component';
import { AuthoreditComponent } from './authoredit/authoredit.component';
import { PublishereditComponent } from './publisheredit/publisheredit.component';
import { CategoryeditComponent } from './categoryedit/categoryedit.component';
import { SubcategoryeditComponent } from './subcategoryedit/subcategoryedit.component';
import { BooksupervisorpanelComponent } from './booksupervisorpanel/booksupervisorpanel.component';
import { SetupComponent } from './setup/setup.component';
import { UserUploadComponent } from './user-upload/user-upload.component';
import { UserChangepwdComponent } from './user-changepwd/user-changepwd.component';
import { UserChangepwd2Component } from './user-changepwd2/user-changepwd2.component';
import { UserStatusChangeComponent } from './user-status-change/user-status-change.component';
import { UserForgotPasswordComponent } from './user-forgot-password/user-forgot-password.component';
import { UserForgotPassword2Component } from './user-forgot-password2/user-forgot-password2.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: UserLoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'header', component: HeaderComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'book', component: BookComponent },
  { path: 'magazine', component: MagazineComponent },
  { path: 'journal', component: JournalComponent },
  { path: 'user', component: UserComponent },
  { path: 'user/:cmd/:id', component: UserComponent },
  { path: 'userList', component: UserListComponent },
  { path: 'department', component: DepartmentComponent },
  { path: 'position', component: PositionComponent },
  { path: 'librarian', component: LibrarianComponent },
  { path: 'export', component: ExportComponent },
  { path: 'import', component: ImportComponent },
  { path: 'accountsetting', component: AccountsettingComponent },
  { path: 'search', component: SearchFilterDemoComponent },
  { path: 'addcategory', component: BookaddcategoryComponent },
  { path: 'addauthor', component: BookaddauthorComponent },
  { path: 'addsubcategory', component: BookaddsubcategoryComponent },
  { path: 'addpublisher', component: BookaddpublisherComponent },
  { path: 'addbook', component: BookaddComponent },
  { path: 'editbook/:boId', component: BookeditComponent },

  { path: 'editauthor/:boId', component: AuthoreditComponent },
  { path: 'editpublisher/:boId', component: PublishereditComponent },
  { path: 'editcategory/:boId', component: CategoryeditComponent },
  { path: 'editsubcategory/:boId', component: SubcategoryeditComponent },
  { path: 'booksupervisor', component: BooksupervisorpanelComponent },
  { path: 'setup', component: SetupComponent },
  { path: 'setup/:cmd/:id', component: SetupComponent },
  { path: 'user-upload', component: UserUploadComponent },
  { path: 'changePwd', component: UserChangepwdComponent },
  { path: 'changePwd2', component: UserChangepwd2Component },
  { path: 'changeStatus', component: UserStatusChangeComponent },
  { path: 'userforgotPwd', component: UserForgotPasswordComponent },
  { path: 'userforgotPwd2', component: UserForgotPassword2Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
