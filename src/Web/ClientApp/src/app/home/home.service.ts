import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { UserVm } from 'src/shared/models';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private baseUrl: string = 'https://localhost:44447';

  constructor() {}

  getHomeIndex(): Observable<UserVm> {
    const url = `${this.baseUrl}/api/HomeIndex`;

    // Using Fetch API wrapped in an observable
    return from(
      fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      })
    ).pipe(
      // Switching to handle the fetch promise and converting it to a proper UserVm
      switchMap((response) => {
        if (!response.ok) {
          // Check for HTTP errors
          return from(response.text()).pipe(
            switchMap((errorText) =>
              throwError(
                () =>
                  new Error(
                    `Error fetching data: ${response.status} ${response.statusText} - ${errorText}`
                  )
              )
            )
          );
        }
        // Convert the response to JSON and return as UserVm
        return from(response.json() as Promise<UserVm>);
      }),
      catchError((error) => {
        // Catch and log any errors
        console.error('Error in getHomeIndex:', error);
        return throwError(() => error);
      })
    );
  }
}
