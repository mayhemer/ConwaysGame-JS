class ConwayWorldUtils {
  static center(world) {
    let lx = world.width,
      hx = 0,
      ly = world.height,
      hy = 0;

    for (let x = 0; x < world.width; ++x) {
      for (let y = 0; y < world.height; ++y) {
        if (world.getCell(x, y)) {
          if (hx < x) hx = x;
          if (lx > x) lx = x;
          if (hy < y) hy = y;
          if (ly > y) ly = y;
        }
      }
    }

    const ax = (hx + lx) / 2;
    const ay = (hy + ly) / 2;
    const dx = (world.width / 2 - ax) | 0
    const dy = (world.height / 2 - ay) | 0

    const r = new ConwayWorld(world.width, world.height);
    for (let x = 0; x < world.width; ++x) {
      for (let y = 0; y < world.height; ++y) {
        if (world.getCell(x, y)) {
          r.setCell(x + dx, y + dy, true);
        }
      }
    }

    return r;
  }

  static enlarge(world) {
    const r = new ConwayWorld(world.width * 2, world.height * 2);
    const dx = (world.width / 2) | 0
    const dy = (world.height / 2) | 0

    for (let x = 0; x < world.width; ++x) {
      for (let y = 0; y < world.height; ++y) {
        if (world.getCell(x, y)) {
          r.setCell(x + dx, y + dy, true);
        }
      }
    }

    return r;
  }

  static shrink(world) {
    const r = new ConwayWorld(world.width / 2, world.height / 2);
    const dx = (world.width / 4) | 0
    const dy = (world.height / 4) | 0

    for (let x = dx; x < dx * 3; ++x) {
      for (let y = dy; y < dy * 3; ++y) {
        if (world.getCell(x, y)) {
          r.setCell(x - dx, y - dy, true);
        }
      }
    }

    return r;
  }
}
