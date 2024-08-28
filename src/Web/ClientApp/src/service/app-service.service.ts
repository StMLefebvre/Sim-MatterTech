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

  private static indexHtmlModel: { [elementId: string]: string } = {};
  public static dialog: MatDialog;
  public static https: HttpClient;
  private static renderer: Renderer2;

  // Simulated user roles, adjust as needed
  private static userRoles: string[] = ['Administrator', 'User']; // Example roles

  constructor(
    private http: HttpClient,
    private editor: MatDialog,
    rendererFactory: RendererFactory2
  ) {
    AppService.dialog = editor;
    AppService.https = http;
    AppService.renderer = rendererFactory.createRenderer(null, null);
    this.loadModel(); // Load the model when the service is instantiated
  }

  toggle(isHide: boolean): void {
    AppService.isIndexSubject.next(isHide);
    AppService.updateDOM();
  }

  private static updateDOM(): void {
    Object.keys(AppService.indexHtmlModel).forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.innerHTML = AppService.indexHtmlModel[id];
        if (this.isUserAdmin()) {
          const editIcon = AppService.renderer.createElement('span');
          AppService.renderer.addClass(editIcon, 'edit-icon');
          AppService.renderer.setProperty(editIcon, 'innerHTML', '✏️');
          AppService.renderer.listen(editIcon, 'click', () => AppService.openEditor(id));
          AppService.renderer.appendChild(element, editIcon);
        }
      }
    });

    const frontpageElement = document.querySelector('.frontpage');
    if (frontpageElement) {
      AppService.renderer.setStyle(frontpageElement, 'display', AppService.getValue() ? 'block' : 'none');
    }
  }

  static getValue(): boolean {
    return AppService.isIndexSubject.value;
  }

  static updateContent(elementId: string, content: string): void {
    AppService.indexHtmlModel[elementId] = content;
  }

  static getContent(elementId: string): string {
    return AppService.indexHtmlModel[elementId] || '';
  }

  static openEditor(elementId: string): void {
    const content = AppService.getContent(elementId);
    const dialogRef = AppService.dialog.open(QuillEditorDialogComponent, {
      width: '600px',
      data: { elementId, content }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.content) {
        AppService.updateContent(elementId, result.content);
        this.saveModel(); // Save the model after updating content
      }
      this.updateDOM(); // Re-apply changes to the DOM
    });
  }

  private static isUserAdmin(): boolean {
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
        AppService.indexHtmlModel = data || {};
        AppService.updateDOM();
      })
      .catch(error => {
        console.error('Failed to load indexHtmlModel:', error);
      });
  }

  private static saveModel(): void {
    AppService.https.post('api/IndexHtml/save', AppService.indexHtmlModel).subscribe({
      next: () => console.log('Model saved successfully.'),
      error: err => console.error('Failed to save indexHtmlModel.json:', err)
    });
  }
}
