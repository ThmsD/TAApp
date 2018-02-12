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
        return "EVI_color";
      case "Photovoltaik":
        return "PV-Solar_color";
      case "Heizung":
        return "Heizung_color";
      case "Solarthermie":
        return "PV-Solarthermie_color";
      case "Pufferspeicher":
        return "Pufferspeicher_color";
      case "Verbrauch":
        return "Stromzaehler";
      case "Energiespeicher":
        return "Battery_color";
      case "Energiemonitor":
        return "Strommast";
      case "Strom":
        return "Strommast";
      case "Bezug":
        return "Strommast";
      case "Einspeisung":
        return "Strommast";
      case "Verbrauch (gesamt)":
        return "Stromzaehler";
      case "Verbrauch (sonstige)":
        return "Stromzaehler";
      default:
        break;
    }
    //return value.toLowerCase();
  }
}
