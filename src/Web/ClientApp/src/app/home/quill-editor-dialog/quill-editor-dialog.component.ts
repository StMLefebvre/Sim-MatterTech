import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuillModules } from 'ngx-quill';

@Component({
  selector: 'app-quill-editor-dialog',
  templateUrl: './quill-editor-dialog.component.html',
  styleUrls: ['./quill-editor-dialog.component.css']
})
export class QuillEditorDialogComponent {

  editorContent: string;
  quillConfig: QuillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', 'medium', 'large', 'huge'] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean']
    ]
  };

  constructor(
    public dialogRef: MatDialogRef<QuillEditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { elementId: string, content: string }
  ) {
    this.editorContent = data.content;
  }

  onSave(): void {
    this.dialogRef.close({ content: this.editorContent });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
