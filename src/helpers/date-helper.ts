import * as moment from 'moment'

export class DateHelper {
  static getTimeLabel(ts: number): string {
    return moment(ts).format('HH:mm:ss')
  }
}
