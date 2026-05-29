import { ChangeDetectionStrategy, Component } from "@angular/core";
import { IonicModule } from "@ionic/angular";

@Component({
  selector: "app-expenses",
  templateUrl: "./expenses.component.html",
  styleUrls: ["./expenses.component.scss"],
  imports: [IonicModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpensesComponent {

}

