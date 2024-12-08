const {DateTime} = require('luxon');

const months = require('./months.js');
const formats = require('./formats.js');

function dateToISOString({ src, options }) {

    // сразу форматируем строку и приводим к общему виду - dd MMM yyyy HH:mm, или оставляем строку в ISO
    const dateString = src[options]
    .split(' ')
    .map(item => {
        if (new RegExp(/(?=.*\d)/).test(item))
            return item.replace(/["“”‟‛›«»‹›]/g, '');
        else
            return months.find(month => month.substring(0,3) === item.substring(0,3)) || 
                (item === 'май' ? 'мая' : undefined); // май исключение - потому что всего три буквы
    })
    .filter(item => item !== undefined)
    .join(' ');

    // подбираем форматы к строке
    for (const format of formats) {
        const date = DateTime.fromFormat(dateString, format, { locale: "ru" });
        if (date.isValid) {
            if (format.indexOf('ZZ') > 0)
                return date.toFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZZ");
            else
                return date.toFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        }
    }

}

module.exports = dateToISOString;