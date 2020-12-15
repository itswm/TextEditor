import { Component } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'TextEditor';
    htmlContent = '<b>Welcome Bojdo</b><div><b><br></b></div><div><b>Dupa</b></div>';
    filterEnabled = false;

    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '150px',
        minHeight: '0',
        maxHeight: 'auto',
        width: 'auto',
        minWidth: '0',
        translate: 'yes',
        enableToolbar: true,
        showToolbar: true,
        placeholder: 'Enter text here...',
        defaultParagraphSeparator: '',
        defaultFontName: '',
        defaultFontSize: '',
        toolbarPosition: 'top',
        toolbarHiddenButtons: [
            ['subscript', 'superscript', 'heading', 'fontName'],
            ['backgroundColor', 'customClasses', 'insertImage',
                'insertVideo',
                'insertHorizontalRule', 'toggleEditorMode']
        ]
    };

    filterResutls = [];

    public onChange(): void {
        console.log(this.htmlContent);
    }

    public toggleFilter(): void {
        this.filterEnabled = !this.filterEnabled;
    }

    public onSubmit(results: number[]): void {
        this.filterResutls = results;
        this.toggleFilter();
    }
}
