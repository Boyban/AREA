module.exports = {
    lowLevelLog: function (printable) {
        console.log('\x1b[33m%s\x1b[0m%s', getPrintableDate(), printable);
    },
    highLevelLog: function (printable) {
        console.log('\x1b[33m%s\x1b[0m\x1b[34m%s\x1b[0m', getPrintableDate(), printable);
    },
    criticLevelLog: function (printable) {
        console.log('\x1b[33m%s\x1b[0m\x1b[31m%s\x1b[0m', getPrintableDate(), printable);
    }
};

function getPrintableDate() {
    var date = new Date;
    var printableDate = "[";

    printableDate += date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() + " ";
    printableDate += date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "]: ";
    return printableDate;
}