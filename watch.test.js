const rewire = require("rewire")
const watch = rewire("./watch")
const launch = watch.__get__("launch")
// @ponicode
describe("launch", () => {
    test("0", async () => {
        await launch()
    })
})
