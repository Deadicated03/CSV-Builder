import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { CsvUpload } from './app/csv-upload/csv-upload';
import { CsvDetailsComponent } from './app/csv-details/csv-details';
import { TemplateComponent } from './app/create-template/template/template';
import { HomeComponent } from './app/pages/home/home';
import { allUpload } from './app/all-upload/all-upload';
import { MappingResult } from './app/mapping-result/mapping-result';
import { CsvJsonMapping } from './app/csv-json-mapping/csv-json-mapping';
import { NoCodeTemplate } from './app/no-code-template/no-code-template';


bootstrapApplication(App, {
  providers: [provideHttpClient(),provideRouter([
      {
        path: '',
         // ✅ κοινό layout
        children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'upload', component: CsvUpload },
      { path: 'csv/details', component: CsvDetailsComponent },
      { path: 'create/template', component: TemplateComponent },
      { path: 'home', component: HomeComponent },
      {path: 'json/upload', component: allUpload},
      { path: 'mapping-result', component: MappingResult },
      { path: 'csv-json-mapping', component: CsvJsonMapping },
      { path: 'no-code-template', component: NoCodeTemplate },
        ]
      }
    ])]
});
