import { Pipe, PipeTransform } from "@angular/core";
import { Currency } from "@spendwise/shared-types";

@Pipe({
  name: "formatCurrency",
})
export class FormatCurrencyPipe implements PipeTransform {
  transform(amount: number | null | undefined, currency: Currency | null | undefined): string {
    if (amount == null || currency == null) {
      return "";
    }
    return `${amount} ${currency}`;
  }
}
