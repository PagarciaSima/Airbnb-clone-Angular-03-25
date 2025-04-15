import {HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from "@angular/common/http";
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";
import {tap} from "rxjs";

/**
 * Interceptor that handles HTTP errors, specifically for authentication expiration.
 * 
 * This interceptor listens for HTTP 401 (Unauthorized) errors and checks if the user
 * is still authenticated. If the error is related to authentication expiration (i.e., 
 * the user is authenticated but the session has expired), it redirects the user to the
 * login page to re-authenticate.
 * 
 * The interceptor also ensures that errors from authentication-related endpoints (such as 
 * login or token refresh) do not trigger the login redirection again to avoid infinite loops.
 */
export const authExpired: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  return next(req).pipe(
    tap({
      error: (err: HttpErrorResponse) => {
        if(err.status === 401 && err.url && !err.url.includes("api/auth") && authService.isAuthenticated()) {
          authService.login();
        }
      }
    })
  )
}
