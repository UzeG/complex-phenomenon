class FlowField {
    constructor() {
        this.resolution = 20;

        this.rows = height / this.resolution;
        this.cols = width / this.resolution;
        this.field = [];
        for (let i = 0; i < this.rows; i++) {
            this.field.push([]);
            for (let j = 0; j < this.cols; j++) {
                this.field[i].push(createVector());
            }
        }

        this.init();
    }

    init() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let theta = random(0, TWO_PI);
                this.field[i][j] = p5.Vector.fromAngle(theta);
            }
        }
    }

    lookUp(position) {
        let { x, y } = position;
        let row = int(constrain(y / this.resolution, 0, this.rows - 1));
        let col = int(constrain(x / this.resolution, 0, this.cols - 1));
        return this.field[row][col].copy();  // 传值
    }


    drawVector(v, x, y, scayl) {
        push();

        translate(x, y);
        stroke(0, 100);
        rotate(v.heading());
        let len = v.mag() * scayl;
        line(0, 0, len, 0);

        pop();
    }

    render() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.drawVector(this.field[i][j], j * this.resolution, i * this.resolution, this.resolution - 2);
            }
        }
    }
}