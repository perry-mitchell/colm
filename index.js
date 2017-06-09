const termSize = require("term-size");
const pad = require("pad");
const stripAnsi = require("strip-ansi");

function countColumns(data) {
    let cols = 0;
    data.forEach(row => {
        cols = Math.max(cols, row.length);
    });
    return cols;
}

function getColumnWidths(data, colCount, termWidth) {
    const colMaxWidth = [];
    const colTotalWidth = [];
    const rows = data.length;
    const separatorCount = colCount - 1;
    data.forEach(row => {
        for (let i = 0; i < colCount; i += 1) {
            const rowItem = row[i] || "";
            const rowItemLength = stripAnsi(rowItem).length;
            const currWidth = colTotalWidth[i] || 0;
            colTotalWidth[i] = currWidth + rowItemLength;
            const currTotal = colMaxWidth[i] || 0;
            colMaxWidth[i] = Math.max(currTotal, rowItemLength);
        }
    });
    const colAvgWidth = colTotalWidth.map(total => Math.ceil(total / rows));
    // determine if we're over width
    const getCurrentTotalWidth = colWidths => colWidths.reduce((curr, next) => curr + next, 0) + separatorCount;
    const naiveWidth = getCurrentTotalWidth(colMaxWidth);
    if (naiveWidth > termWidth) {
        let difference = naiveWidth - termWidth;
        while (difference > 0) {
            let targetIndex = 0,
                targetRatio = 0;
            colMaxWidth.forEach((colWidth, index) => {
                const ratio = colWidth / colAvgWidth[index];
                if (ratio > targetRatio) {
                    targetRatio = ratio;
                    targetIndex = index;
                }
            });
            colMaxWidth[targetIndex] -= 1;
            difference -= 1;
        }
    }
    return colMaxWidth;
}

function getTerminalWidth() {
    return termSize().columns;
}

function formatColumns(data, options = {}) {
    const { termWidth } = mergeOptions(options);
    const columns = countColumns(data);
    const widths = options.columnWidths || getColumnWidths(data, columns, termWidth);
    return data
        .reduce((output, row) => {
            let line = "";
            row.forEach((item, col) => {
                line += pad(item, widths[col], { strip: true, colors: true, char: " " });
                if (col < columns - 1) {
                    line += " ";
                }
            });
            return output + "\n" + line;
        }, "")
        .trim();
}

function mergeOptions(ops) {
    return Object.assign(
        {
            columnWidths: null,
            termWidth: getTerminalWidth()
        },
        ops || {}
    );
}

module.exports = formatColumns;
