import moment from 'moment';
import 'moment/locale/sv';

export const convertYearMonth = (monthYear) => {
    const m = moment(monthYear)
    return m.format("MMMM") + " " + m.format("YYYY")
}