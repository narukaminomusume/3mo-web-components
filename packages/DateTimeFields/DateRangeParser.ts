import { DateParser } from './DateParser.js'

export class DateRangeParser {
	static readonly dateRangeSeparator = ' – '
	static readonly userDateRangeSeparators = [DateRangeParser.dateRangeSeparator, ' ', '-', '~']

	static parse(dateRangeText: string, referenceDate = new DateTime) {
		const keywordResult = DateRangeParser.parseDateRangeFromKeyword(dateRangeText, referenceDate)
		if (keywordResult) {
			return keywordResult
		}

		let separator = DateRangeParser.userDateRangeSeparators.find(separator => dateRangeText.includes(separator))

		if (!separator) {
			dateRangeText += DateRangeParser.dateRangeSeparator
			separator = DateRangeParser.dateRangeSeparator
		}

		const [startDateText, endDateText] = dateRangeText.toLowerCase().split(separator)

		const startDate = DateParser.parse(startDateText!, referenceDate)
		const endDate = DateParser.parse(endDateText!, referenceDate)

		return new DateTimeRange(startDate, endDate)
	}

	private static parseDateRangeFromKeyword(keyword: string, referenceDate = new DateTime): DateTimeRange | undefined {
		switch (keyword) {
			case 'w':
			case 'dw': return new DateTimeRange(referenceDate.weekStart, referenceDate.weekEnd)
			case 'nw': return new DateTimeRange(referenceDate.addWeeks(+1).weekStart, referenceDate.addWeeks(+1).weekEnd)
			case 'lw': return new DateTimeRange(referenceDate.addWeeks(-1).weekStart, referenceDate.addWeeks(-1).weekEnd)
			case 'm':
			case 'dm': return new DateTimeRange(referenceDate.monthStart, referenceDate.monthEnd)
			case 'lm': return new DateTimeRange(referenceDate.addMonths(-1).monthStart, referenceDate.addMonths(-1).monthEnd)
			case 'nm': return new DateTimeRange(referenceDate.addMonths(+1).monthStart, referenceDate.addMonths(+1).monthEnd)
			case 'j':
			case 'dj': return new DateTimeRange(referenceDate.yearStart, referenceDate.yearEnd)
			case 'lj': return new DateTimeRange(referenceDate.addYears(-1).yearStart, referenceDate.addYears(-1).yearEnd)
			case 'nj': return new DateTimeRange(referenceDate.addYears(+1).yearStart, referenceDate.addYears(+1).yearEnd)
			default: return undefined
		}
	}
}