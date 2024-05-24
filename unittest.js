(function conwaySelfTest() {
  const check = (cond, msg = "Failure") => {
    if (!cond) throw new Error(msg);
  };

  console.log("unittest begin");

  // simple arithmetics of the bit array
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

  // test the neighbours function
  check(w.neigbors(1, 1) == 0);
  check(w.neigbors(2, 2) == 1);
  check(w.neigbors(4, 2) == 1);
  check(w.neigbors(2, 3) == 1);
  check(w.neigbors(3, 3) == 0);
  check(w.neigbors(4, 3) == 1);
  check(w.neigbors(2, 4) == 1);
  check(w.neigbors(3, 4) == 1);
  check(w.neigbors(4, 4) == 1);

  // only one cell alive means next gen is all-dead
  let w2 = w.nextGen();
  check(w.getCell(3, 3));
  check(!w2.getCell(3, 3));
  check(!w2.touched);

  // this pattern oscilates (a 3 cell horizontal bar)
  w.setCell(1, 3, true);
  w.setCell(2, 3, true);
  w.setCell(3, 3, true);
  let w3 = w.nextGen();
  for (let x = 0; x < 5; ++x)
    for (let y = 0; y < 5; ++y) {
      check(
        w3.getCell(x, y) ==
          ((x == 2 && y == 2) || (x == 2 && y == 3) || (x == 2 && y == 4)),
        `altering forth x=${x} y=${y} n=${w3.neigbors(x, y)}`
      );
    }

  // ...and try it back
  let w4 = w3.nextGen();
  for (let x = 0; x < 5; ++x)
    for (let y = 0; y < 5; ++y) {
      check(
        w4.getCell(x, y) ==
          ((x == 1 && y == 3) || (x == 2 && y == 3) || (x == 3 && y == 3)),
        `altering back x=${x} y=${y}`
      );
    }

  // this has to remain stable (a 3 by 3 pointed star)
  let w0 = new ConwayWorld(5, 5);
  w0.setCell(2, 1, true);
  w0.setCell(2, 3, true);
  w0.setCell(1, 2, true);
  w0.setCell(3, 2, true);
  let w1 = w0.nextGen();
  for (let x = 0; x < 5; ++x)
    for (let y = 0; y < 5; ++y) {
      check(w1.getCell(x, y) == w0.getCell(x, y), `stable x=${x} y=${y}`);
    }

  // check leaks to other side
  let wn = new ConwayWorld(6, 8);
  wn.setCell(0, 2, true);
  wn.setCell(0, 3, true);
  wn.setCell(0, 4, true);
  wn.setCell(0, 5, true);
  wn.setCell(0, 6, true);
  check(!wn.neigbors(5, 0));
  check(!wn.neigbors(5, 1));
  check(!wn.neigbors(5, 2));
  check(!wn.neigbors(5, 3));
  check(!wn.neigbors(5, 4));
  wn = wn.nextGen();
  check(!wn.getCell(5, 0));
  check(!wn.getCell(5, 1));
  check(!wn.getCell(5, 2));
  check(!wn.getCell(5, 3));
  check(!wn.getCell(5, 4));
  check(!wn.neigbors(5, 0));
  check(!wn.neigbors(5, 1));
  check(!wn.neigbors(5, 2));
  check(!wn.neigbors(5, 3));
  check(!wn.neigbors(5, 4));

  console.log("unittest end");
})();
