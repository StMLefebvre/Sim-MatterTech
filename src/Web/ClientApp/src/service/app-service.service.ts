import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { QuillEditorDialogComponent } from 'src/app/home/quill-editor-dialog/quill-editor-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private static isIndexSubject = new BehaviorSubject<boolean>(true);
  isIndex$ = AppService.isIndexSubject.asObservable();

  private indexHtmlModel: { [elementId: string]: string } = {};
  private renderer: Renderer2;

  // Simulated user roles, adjust as needed
  private userRoles: string[] = ['Administrator', 'User']; // Example roles

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.loadModel(); // Load the model when the service is instantiated
  }

  toggle(isHide: boolean): void {
    AppService.isIndexSubject.next(isHide);
    this.updateDOM();
  }

  private updateDOM(): void {
    Object.keys(this.indexHtmlModel).forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.innerHTML = this.indexHtmlModel[id];
        if (this.isUserAdmin()) {
          const editIcon = this.renderer.createElement('span');
          this.renderer.addClass(editIcon, 'edit-icon');
          this.renderer.setProperty(editIcon, 'innerHTML', '✏️');
          this.renderer.listen(editIcon, 'click', () => this.openEditor(id));
          this.renderer.appendChild(element, editIcon);
        }
      }
    });

    const frontpageElement = document.querySelector('.frontpage');
    if (frontpageElement) {
      this.renderer.setStyle(frontpageElement, 'display', this.getValue() ? 'block' : 'none');
    }
  }

  getValue(): boolean {
    //this.loadModel();
    return AppService.isIndexSubject.value;
  }

  updateContent(elementId: string, content: string): void {
    this.indexHtmlModel[elementId] = content;
  }

  getContent(elementId: string): string {
    return this.indexHtmlModel[elementId] || '';
  }

  openEditor(elementId: string): void {
    const content = this.getContent(elementId);
    const dialogRef = this.dialog.open(QuillEditorDialogComponent, {
      width: '600px',
      data: { elementId, content }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.content) {
        this.updateContent(elementId, result.content);
        this.saveModel(); // Save the model after updating content
      }
      this.updateDOM(); // Re-apply changes to the DOM
    });
  }

  private isUserAdmin(): boolean {
    return this.userRoles.includes('Administrator');
  }

  private loadModel(): void {
    fetch('api/IndexHtml/load')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Data loaded successfully:', data);
        this.indexHtmlModel = data || {};
        this.updateDOM();
      })
      .catch(error => {
        console.error('Failed to load indexHtmlModel:', error);
      });
  }

  private saveModel(): void {
    fetch('api/IndexHtml/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.indexHtmlModel)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log('Model saved successfully.');
    })
    .catch(error => {
      console.error('Failed to save indexHtmlModel:', error);
    });
  }
  
}
