import { BrowserModule } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Route, RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BookComponent } from './book/book.component';
import { MagazineComponent } from './magazine/magazine.component';
import { JournalComponent } from './journal/journal.component';
import { UserComponent } from './user/user.component';
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
import { UserListComponent } from './user-list/user-list.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { BookeditComponent } from './bookedit/bookedit.component';
import { AuthoreditComponent } from './authoredit/authoredit.component';
import { PublishereditComponent } from './publisheredit/publisheredit.component';
import { CategoryeditComponent } from './categoryedit/categoryedit.component';
import { SubcategoryeditComponent } from './subcategoryedit/subcategoryedit.component';
import { BooksupervisorpanelComponent } from './booksupervisorpanel/booksupervisorpanel.component';
import { SetupComponent } from './setup/setup.component';
import { UserUploadComponent } from './user-upload/user-upload.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserChangepwdComponent } from './user-changepwd/user-changepwd.component';
import { NgApexchartsModule} from "ng-apexcharts";
import { UserStatusChangeComponent } from './user-status-change/user-status-change.component';
import { UserForgotPasswordComponent } from './user-forgot-password/user-forgot-password.component';
import { UserForgotPassword2Component } from './user-forgot-password2/user-forgot-password2.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { UserChangepwd2Component } from './user-changepwd2/user-changepwd2.component';
import { AdvertiseComponent } from './advertise/advertise.component';
import {NgModule} from '@angular/core';
import {A11yModule} from '@angular/cdk/a11y';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';
import {OverlayModule} from '@angular/cdk/overlay';
import { FeedbackComponent } from './feedback/feedback.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from './confirmation-dialog/confirmation-dialog.service';

export const ISO_FORMAT = {
  parse: {
    dateInput: ['DD-MM-YYYY']
},
display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
},
};

@NgModule({
 
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    DashboardComponent,
    BookComponent,
    MagazineComponent,
    JournalComponent,
    UserComponent,
    DepartmentComponent,
    PositionComponent,
    LibrarianComponent,
    ExportComponent,
    ImportComponent,
    AccountsettingComponent,
    SearchFilterDemoComponent,
    BookaddcategoryComponent,
    BookaddauthorComponent,
    BookaddsubcategoryComponent,
    BookaddpublisherComponent,
    BookaddComponent,
    UserListComponent,
    BookeditComponent,
    AuthoreditComponent,
    PublishereditComponent,
    CategoryeditComponent,
    SubcategoryeditComponent,
    BooksupervisorpanelComponent,
    SetupComponent,
    UserUploadComponent,
    UserLoginComponent,
    UserChangepwdComponent,
    UserStatusChangeComponent,
    UserForgotPasswordComponent,
    UserForgotPassword2Component,
    UserChangepwd2Component,
    AdvertiseComponent,
    FeedbackComponent,
    ConfirmationDialogComponent

  ],

  imports: [    
    MatNativeDateModule,
    MatDatepickerModule,
    A11yModule,
    ClipboardModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,    
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    OverlayModule,
    PortalModule,
    ScrollingModule,
    NgxPaginationModule,
    NgApexchartsModule,
    MatFormFieldModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatSliderModule,
    //RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatInputModule,
    A11yModule,
    ClipboardModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    OverlayModule,
    PortalModule,
    ScrollingModule,
    Ng2SearchPipeModule,
    NgbModule,
    NgApexchartsModule,
    
  ],
  providers: [
    ConfirmationDialogService
  ],
  bootstrap: [AppComponent, DashboardComponent],
  entryComponents: [DashboardComponent,ConfirmationDialogComponent]
})
export class AppModule { }

