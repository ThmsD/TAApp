import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataPipe',
})
export class DataPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    switch (value) {
      case "EVI":
        return "EVI";
      case "Photovoltaik":
        return "PV-Solar";
      case "Heizung":
        return "Heizung";
      case "Solarthermie":
        return "PV-Solarthermie";
      case "Pufferspeicher":
        return "Pufferspeicher";
      case "Verbrauch":
        return "Stromzaehler";
      case "Energiespeicher":
        return "Battery";
      case "Energiemonitor":
        return "Strommast";
      default:
        break;
    }
    //return value.toLowerCase();
  }
}
