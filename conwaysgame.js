class ConwayWorld extends Uint8ClampedArray {
    #BITS_PER_ELEMENT = super.BYTES_PER_ELEMENT * 8;
    touched = false;

    constructor(w, h) {
        super((w * h) / 8);
        this.width = w;
        this.height = h;
    }

    #index(x, y) {
        const m = (x + (y * this.width));
        const i = (m / this.#BITS_PER_ELEMENT) | 0;
        const j = m % this.#BITS_PER_ELEMENT; 
        return {i, j};
    }

    #isOutbound(x, y) {
        return x < 0 || x >= this.width || y < 0 || y >= this.height;
    }

    setCell(x, y, alive) {
        if (this.#isOutbound(x, y)) {
            return;
        }
        
        const {i, j} = this.#index(x, y);
        if (alive) {
            this[i] |= (1 << j);
            this.touched = true;
        } else {
            this[i] &= ~(1 << j); 
        }
    }

    getCell(x, y) {
        if (this.#isOutbound(x, y)) {
            return false;
        }

        const {i, j} = this.#index(x, y);
        return !!(this[i] & (1 << j));
    }

    neigbors(x, y) {
        let n = 0;
        for (let a = x - 1; a <= x + 1; ++a) {
            for (let b = y - 1; b <= y + 1; ++b) {
                if (a == x && b == y) continue;
                n += this.getCell(a, b) | 0;
                if (n > 3) break;
            }
        }
        return n;
    }

    nextGen() {
        let r = new ConwayWorld(this.width, this.height);
        for (let x = 0; x < this.width; ++x) {
            for (let y = 0; y < this.height; ++y) {
                const c = this.getCell(x, y);
                const n = this.neigbors(x, y);
                /*
                Rule 1: a dead cell with exactly 3 neighbours comes alive
                Rule 2: an alive cell with less than 2 or more than 3 neighbours dies
                */
                if (c ? n >= 2 && n <= 3 : n == 3) {
                    r.setCell(x, y, true);
                }
            }
        }

        return r;
    }    
}

function randomInit(world) {
    world.forEach(() => {
        const a = Math.random() * 256;
        const b = Math.random() * 256;
        world[i] = a && b; // to sparse...
    });
}

function progress(world, target) {
    const next = world.nextGen();
    for (let x = 0; x < world.width; ++x) {
        for (let y = 0; y < world.height; ++y) {
            target(x, y, world.getCell(x, y), next.getCell(x, y));
        }
    }
    return next;
}

function loop(target) {
    let world = new ConwayWorld(800, 600);
    randomInit(world);

    const p = new Promise(resolve => {
        const handle = setInterval(() => {
            world = progress(world, target);
    
            if (!world.touched) {
                clearInterval(handle);
                console.log('All dead...');
                resolve();
            }
        }, 200);
    });

    return p;
}
