import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "tabs/dashboard",
        pathMatch: "full",
    },

    {
        path: "tabs",
        loadComponent: () =>
          import("./features/tabs/tabs.component")
            .then((m) => m.TabsComponent),

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
];
