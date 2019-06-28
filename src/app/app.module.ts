import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { VisualEditorComponent } from './visual-editor/visual-editor.component';
import { ProductsComponent } from './products/products.component';
import { LabelsComponent } from './labels/labels.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { LabelDetailComponent } from './label-detail/label-detail.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import { LabelService } from './label.service';
// import { Konva } from './konva';

@NgModule({
  declarations: [
    AppComponent,
    VisualEditorComponent,
    ProductsComponent,
    LabelsComponent,
    ProductDetailComponent,
    LabelDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    MatRadioModule
  ],
  providers: [
    LabelService
  ],
  bootstrap: [AppComponent],
  entryComponents: [ProductDetailComponent, LabelDetailComponent]
})
export class AppModule { }
