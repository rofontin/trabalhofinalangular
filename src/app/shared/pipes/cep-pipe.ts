import {mapToNumeric, formatToCEP } from '../helpers/utils.helper';
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'cep' })
export class CepPipe implements PipeTransform {

  transform(value: string | null) {
    const str = mapToNumeric(value || '');
    return formatToCEP(str);
  }

}
