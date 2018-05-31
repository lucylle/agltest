import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// pages
import { AppComponent } from '@app/components/layout/app.component';
import { CatsComponent } from '@app/components/pages/cats.component';

// services
import { DataService } from '@app/core/services/data.service';
import { PetService } from '@app/core/services/pet.service';

// other
import { KeysPipe } from '@app/core/pipes/keys.pipe';


const appRoutes: Routes = [
  { path: "index", component: CatsComponent },
  { path: "**", component: CatsComponent } 
];

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes
    )
  ],
  declarations: [
    AppComponent,
    CatsComponent,
    KeysPipe
  ],
  providers: [
    DataService,
    PetService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
