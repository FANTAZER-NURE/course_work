import moment, { MomentInput } from 'moment'

export const DISPLAY_DATE_FORMAT = 'DD-MM-YYYY'

export function formatDateForDisplay(date: MomentInput) {
  const mdate = moment(date)

  if (mdate.isValid()) {
    return mdate.format(DISPLAY_DATE_FORMAT)
  }

  return ''
}

export function momentFormatter(format: string) {
  return {
    formatDate: (date: moment.MomentInput) => moment(date).format(format),
    parseDate: (str: string) => moment(str, format).toDate(),
    placeholder: `${format} (moment)`,
  }
}
