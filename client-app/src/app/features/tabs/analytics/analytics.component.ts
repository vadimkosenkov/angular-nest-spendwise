import { ChangeDetectionStrategy, Component } from "@angular/core";
import { IonicModule } from "@ionic/angular";

@Component({
  selector: "app-analytics",
  templateUrl: "./analytics.component.html",
  styleUrls: ["./analytics.component.scss"],
  imports: [IonicModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalyticsComponent {

}

