import { HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode } from '@angular/common/http';
import {Location} from "@angular/common";
import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import { State } from './model/state.model';
import { User } from './model/user.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http: HttpClient = inject(HttpClient);
  location: Location = inject(Location);

  notConnected: string = "NOT_CONNECTED";

  private fetchUser$: WritableSignal<State<User>> =
    signal(State.Builder<User>().forSuccess({ email: this.notConnected }));
  
  // Contiene el último valor actualizado del signal gracias a computed
  fetchUser = computed(() => this.fetchUser$());

  /**
 * Fetches the authenticated user data from the backend and updates the state.
 * 
 * This method makes an HTTP request to the backend to retrieve the currently authenticated user.
 * It accepts a `forceResync` parameter to indicate whether the server should force a resynchronization
 * of the user information (for example, refreshing session data or re-authenticating the user).
 * 
 * If the request is successful, the user data is stored in the internal state using `fetchUser$`. If there
 * is an error, the error is handled, and the state is updated accordingly.
 * 
 * If the error status is `HttpStatusCode.Unauthorized` and the user is authenticated, it will set the state
 * to indicate the user is not connected. For other errors, the state will be updated with the error details.
 * 
 * @param forceResync - A boolean flag indicating whether to force the resynchronization of the user data.
 *                      If `true`, the backend will refresh the user data.
 * 
 * @returns void - This method does not return any value. It only updates the internal state based on the result
 *                 of the HTTP request.
 */
  fetch(forceResync: boolean): void {
    this.FetchHttpUser(forceResync)
      .subscribe({
        next: (user) => {
          this.fetchUser$.set(State.Builder<User>().forSuccess(user));
        }, error: (err) => {
          if (err.status === HttpStatusCode.Unauthorized && this.isAuthenticated()) {
            this.fetchUser$.set(State.Builder<User>().forSuccess({ email: this.notConnected }));
          } else {
            this.fetchUser$.set(State.Builder<User>().forError(err));

          }
        }
    })
  }

    /**
   * Checks if the user is authenticated by evaluating the current user state.
   * 
   * This method examines the `fetchUser$` state to determine if the user is authenticated.
   * If the user data exists and the email is not equal to the value indicating "not connected",
   * the user is considered authenticated. If the user is not connected or if the user data 
   * is not available, it returns `false`, indicating the user is not authenticated.
   * 
   * @returns {boolean} `true` if the user is authenticated (i.e., has a valid email),
   *                    `false` if the user is not authenticated or the email is the "not connected" value.
   */
  isAuthenticated(): boolean {
    if (this.fetchUser$().value) {
      return this.fetchUser$().value!.email !== this.notConnected;
    } else {
      return false;
    }
  }

    /**
   * Redirects the user to the external authentication provider (Okta in this case).
   * 
   * This method constructs the URL for the Okta authentication page by combining the current origin
   * of the application (the base URL) with the provided path (`"oauth2/authorization/okta"`).
   * It then redirects the user to that URL by updating `location.href`, initiating the authentication flow.
   * 
   * The `prepareExternalUrl` method is used to properly format the external URL path to ensure it's valid
   * for redirection outside of the Angular routing context.
   * 
   * Example:
   * If the application is hosted at `https://www.misitio.com` and the provided path is `"oauth2/authorization/okta"`,
   * the user will be redirected to `https://www.misitio.com/oauth2/authorization/okta` to begin the authentication process.
   * 
   * @returns {void} This method does not return a value. It performs a redirection to the authentication URL.
   */
  login(): void {
    // Si tu aplicación está en https://www.misitio.com y la ruta proporcionada es "oauth2/authorization/okta", el resultado de location.href sería algo como:
    location.href = `${location.origin}${this.location.prepareExternalUrl("oauth2/authorization/okta")}`;
  }

    /**
   * Logs out the currently authenticated user.
   * 
   * This method makes a POST request to the backend logout endpoint to terminate the user's session.
   * Upon successful logout, it updates the internal user state to indicate that the user is no longer connected,
   * setting the user's email to a predefined "not connected" value.
   * 
   * After updating the internal state, it redirects the user to a logout URL provided by the backend
   * (commonly used to complete the logout process in external identity providers like Okta).
   * 
   * This method handles the subscription internally since its purpose is to perform side effects (state update
   * and redirection) rather than return data to the component.
   * 
   * @returns {void} This method does not return a value. It performs logout operations and redirects the user.
   */
  logout(): void {
    this.http.post(`${environment.API_URL}/auth/logout`, {})
      .subscribe({
        next: (response: any) => {
          this.fetchUser$.set(State.Builder<User>()
            .forSuccess({email: this.notConnected}));
          location.href = response.logoutUrl
        }
      })
  }

  /**
 * Fetches the authenticated user from the backend.
 * 
 * This method sends a GET request to the backend to retrieve the currently authenticated user's data.
 * It includes an optional query parameter `forceResync` to indicate whether the server should force 
 * a resynchronization of the user information (e.g., by refreshing session data or re-authenticating the user).
 *
 * @param forceResync - A boolean flag that determines whether the backend should force a resynchronization 
 *                      of the authenticated user data. If set to true, the server will refresh the user data.
 * @returns An Observable of the `User` object containing the authenticated user's data.
 */
  FetchHttpUser(forceResync: boolean): Observable<User> {
    const params = new HttpParams().set('forceResync', forceResync);
    return this.http.get<User>(`${environment.API_URL}/auth/get-authenticated-user`, {params})
  }
    
  /**
   * Checks if the authenticated user has at least one of the specified authorities (roles or permissions).
   * 
   * This method first ensures that the user is authenticated by checking if the email is not equal to the
   * predefined "not connected" value. If the user is not authenticated, it returns `false`.
   * 
   * It then normalizes the input to an array (in case a single string was passed), and checks whether the user
   * has any of the provided authorities by comparing them against the user's list of authorities.
   * 
   * @param {string[] | string} authorities - A list of authorities or a single authority string to check against the user's roles.
   * @returns {boolean} `true` if the user has at least one of the specified authorities, `false` otherwise.
   */
  hasAnyAuthority(authorities: String[] | string): boolean {
    if (this.fetchUser$().value!.email === this.notConnected) {
      return false;
    }
    if (!Array.isArray(authorities)) {
      authorities = [authorities];
    }
    return this.fetchUser$().value!.authorities!.some((authority: string) => authorities.includes(authority));
  }
}
