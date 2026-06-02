import { ChangeDetectionStrategy, Component } from "@angular/core";
import { IonicModule } from "@ionic/angular";

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  imports: [IonicModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent {

}

