require("dotenv").config();

describe("Application", function () {

    it("app", function (done) {
        done();
    });

    /*describe("Swap", function () {
        require("./Swap/swap.test");
    });*/

    require("./Swap/pair.test")
});
