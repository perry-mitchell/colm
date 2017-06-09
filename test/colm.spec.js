const formatColumns = require("../index.js");

describe("formatColumns", function() {

    it("separates columns correctly", function() {
        const formatted = formatColumns([
            ["column1", "column2", "column 3"]
        ]);
        expect(formatted.trim()).to.equal("column1 column2 column 3");
    });

    it("pads columns correctly", function() {
        const formatted = formatColumns([
            ["column1", "column2", "3"],
            ["longerOne", "short", "3"]
        ]);
        expect(formatted.trim()).to.equal("column1   column2 3\nlongerOne short   3");
    });

    it("shortens long columns", function() {
        const formatted = formatColumns([
            ["abc", "def", "really-long-column-value"]
        ], { termWidth: 20 });
        expect(formatted.trim()).to.equal("ab de really-long-co");
    });

    it("supports overidding column widths", function() {
        const formatted = formatColumns([
            ["abc", "def", "really-long-column-value"]
        ], { columnWidths: [3, 6, 7] });
        expect(formatted.trim()).to.equal("abc def    really-");
    });

});
