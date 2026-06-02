import { ChangeDetectionStrategy, Component } from "@angular/core";
import { IonicModule } from "@ionic/angular";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
  imports: [IonicModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {}

