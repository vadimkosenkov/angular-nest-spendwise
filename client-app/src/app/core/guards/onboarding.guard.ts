import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";

export const onboardingRedirectGuard: CanActivateFn = () => {
  const router: Router = inject(Router);
  const onboardingCompleted = localStorage.getItem("onboardingCompleted");

  if (onboardingCompleted === "true") {
    return true;
  } else {
    return router.parseUrl("/onboarding");
  }
};