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

class ConwayWorldGame {
    static #randomInit(world) {
        world.forEach((e, i) => {
            const a = Math.random() * 256;
            const b = Math.random() * 256;
            world[i] = a && b; // to sparse...
        });
    }
    
    static #paint(world, next, target) {
        for (let x = 0; x < world.width; ++x) {
            for (let y = 0; y < world.height; ++y) {
                target(x, y, world.getCell(x, y), next.getCell(x, y));
            }
        }
        
    }
    
    static #progress(world, target) {
        const next = world.nextGen();
        this.#paint(world, next, target);
        return next;
    }
    
    static loop(width, height, target, interval) {
        const w0 = new ConwayWorld(width, height);
        let world = new ConwayWorld(width, height);

        this.#randomInit(world);
        this.#paint(w0, world, target);
        
        return new Promise(resolve => {
            const handle = setInterval(() => {
                world = this.#progress(world, target);
                
                if (!world.touched) {
                    clearInterval(handle);
                    console.log('All dead...');
                    resolve();
                    return;
                }

            }, interval);
        });
    }    
}