import { Routes } from "@angular/router";
import { onboardingRedirectGuard } from "./core/guards/onboarding.guard";

export const routes: Routes = [
    {
        path: "",
        redirectTo: "tabs/dashboard",
        pathMatch: "full",
    },
    {
        path: "onboarding",
        loadComponent: () =>
          import("./features/onboarding/onboarding.component")
            .then((m) => m.OnboardingComponent),
    },

    {
        path: "tabs",
        loadComponent: () =>
          import("./features/tabs/tabs.component")
            .then((m) => m.TabsComponent),
        canActivate: [onboardingRedirectGuard],

        children: [
            {
                path: "dashboard",
                loadComponent: () =>
                  import("./features/tabs/dashboard/dashboard.component")
                    .then((m) => m.DashboardComponent),
            },
            {
                path: "expenses",
                loadComponent: () =>
                  import("./features/tabs/expenses/expenses.component")
                    .then((m) => m.ExpensesComponent),
            },
            {
                path: "analytics",
                loadComponent: () =>
                  import("./features/tabs/analytics/analytics.component")
                    .then((m) => m.AnalyticsComponent),
            },
            {
                path: "settings",
                loadComponent: () =>
                  import("./features/tabs/settings/settings.component")
                    .then((m) => m.SettingsComponent),
            },
            {
                path: "",
                redirectTo: "dashboard",
                pathMatch: "full",
            },
        ],
    },

    {
        path: "**",
        redirectTo: "tabs/dashboard",
    },
];
