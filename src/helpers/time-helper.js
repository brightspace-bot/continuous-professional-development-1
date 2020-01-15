import dayjs from 'dayjs/esm';

export function formatForDatePicker(date) {
	return dayjs(date).format('YYYY-MM-DD');
}

export function dateParamString(dateStr, end = false) {
	let date = dayjs(dateStr);

	if (end) {
		date = date.endOf('day');
	}

	return date.toISOString();
}

export function getHoursAndMinutes(minutes) {
	return {
		hours: getHours(minutes),
		minutes: getMinutes(minutes)
	};
}

export function getHours(minutes) {
	if (!minutes) {
		return 0;
	}
	return Math.floor(minutes / 60);
}

export function getHoursRounded(minutes) {
	const hours = minutes / 60;
	return roundToOneDecimal(hours);
}

export function getMinutes(minutes) {
	if (!minutes) {
		return 0;
	}
	return minutes % 60;
}

export function getTotalMinutes(hours, minutes) {
	return parseInt(hours || 0) * 60 + parseInt(minutes || 0);
}

export function roundToOneDecimal(number) {
	return Number(number.toFixed(1));
}
