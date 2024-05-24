(function conwaySelfTest() {
    const check = (cond, msg = "Failure") => { if (!cond) throw new Error(msg); }

    let w = new ConwayWorld(5, 5);
    check(!w.touched);
    w.setCell(3, 3, false);
    check(!w.touched);
    w.setCell(3, 3, true);
    check(w.touched);
    check(w.getCell(3, 3));
    check(!w.getCell(2, 2));
    check(!w.getCell(2, 3));
    check(!w.getCell(3, 2));
    check(!w.getCell(4, 2));
    
    let w2 = w.nextGen();
    check(w.getCell(3, 3));
    check(!w2.getCell(3, 3));
    check(!w2.touched);

    w.setCell(1, 3, true);
    w.setCell(2, 3, true);
    w.setCell(3, 3, true);
    let w3 = w.nextGen();
    for (let x = 0; x < 5; ++x) for (let y = 0; y < 5; ++y) {
        check(w3.getCell(x, y) == (
            x == 2 && y == 2 ||
            x == 2 && y == 3 ||
            x == 2 && y == 4
        ), `altering forth x=${x} y=${y}`);
    }

    let w4 = w3.nextGen();
    for (let x = 0; x < 5; ++x) for (let y = 0; y < 5; ++y) {
        check(w4.getCell(x, y) == (
            x == 1 && y == 3 ||
            x == 2 && y == 3 ||
            x == 3 && y == 3
        ), `altering back x=${x} y=${y}`);
    }

    let w0 = new ConwayWorld(5, 5);
    w0.setCell(2, 1, true);
    w0.setCell(2, 3, true);
    w0.setCell(1, 2, true);
    w0.setCell(3, 1, true);
    let w1 = w0.nextGen();
    for (let x = 0; x < 5; ++x) for (let y = 0; y < 5; ++y) {
        check(w1.getCell(x, y) == (
            x == 2 && y == 1 ||
            x == 2 && y == 3 ||
            x == 1 && y == 2 ||
            x == 3 && y == 1
        ), `stable x=${x} y=${y}`);
    }
})();
