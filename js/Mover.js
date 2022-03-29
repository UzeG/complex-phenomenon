class Mover {
    constructor(position, maxSpeed, maxForce, flowField) {
        this.position = position;
        this.startPoint = this.position.copy();

        this.r = 5;
        this.mass = 1;
        this.maxSpeed = maxSpeed;
        this.maxForce = maxForce;

        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);

        // 每个 mover 都有各自的 flowField
        this.flowField = flowField;

        this.fitness = 0;

        this.survivalTime = 0;

        this.isDie = false;
        this.isSucceed = false;
    }

    applyForce(force) {
        this.acc.add(force.mult(1 / this.mass));
    }

    followFlow() {
        let desired = this.flowField.lookUp(this.position);
        desired.mult(this.maxSpeed);

        let steerForce = desired.sub(this.vel);
        steerForce.limit(this.maxForce);
        this.applyForce(steerForce);
    }

    updateVel() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.acc.mult(0);
    }

    updatePos() {
        if (this.isDie || this.isSucceed) return;

        this.position.add(this.vel);
    }

    borders() {
        if (this.position.x < -this.r) this.position.x = width + this.r;
        if (this.position.y < -this.r) this.position.y = height + this.r;
        if (this.position.x > width + this.r) this.position.x = -this.r;
        if (this.position.y > height + this.r) this.position.y = -this.r;
    }

    render() {
        let theta = this.vel.heading() + PI / 2;

        push();
        fill(200);
        stroke(100);
        strokeWeight(2);

        translate(this.position.x, this.position.y);
        rotate(theta);
        beginShape();
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(0, this.r * 1.5);
        vertex(this.r, this.r * 2);
        endShape(CLOSE);

        pop();
    }

    move() {
        this.followFlow();
        this.updateVel();
        this.updatePos();
        this.borders();
        this.render();
    }

    /* 
        计算适应度 fitness
        - 与生存时间成正比，与目标距离成反比
        - 判定距离为小于等于 1 则达到目标
            target: Target 对象实例
    */
    calcFitness(target, generationTime) {
        let initialDistance = this.startPoint.dist(target.position);
        let currentDistance = this.position.dist(target.position);
        this.fitness = map(this.survivalTime / currentDistance, 0, generationTime, 0, 1);
    }

    /*
        交叉
    */
    crossover(partner) {
        let childFlowField = new FlowField();

        /* for (let i = 0; i < this.flowField.field.length; i++) {
            if (i % 2) {
                childFlowField.field[i] = [...this.flowField.field[i]];
            } else {
                childFlowField.field[i] = [...partner.flowField.field[i]];
            }
        } */

        let flag = true;
        for (let i = 0; i < this.flowField.field.length; i++) {
            for (let j = 0; j < this.flowField.field[i].length; j++) {
                if (flag) childFlowField.field[i][j] = this.flowField.field[i][j];
                else childFlowField.field[i][j] = partner.flowField.field[i][j];
                flag = !flag;
            }
        }

        let child = new Mover(this.startPoint.copy(), this.maxSpeed, this.maxForce, childFlowField);

        return child;
    }

    /*
        变异
    */
    mutate(mutationRate) {
        for (let i = 0; i < this.flowField.field.length; i++) {
            for (let j = 0; j < this.flowField.field[i].length; j++) {
                if (random(1) < mutationRate) {
                    let theta = random(0, TWO_PI);
                    this.flowField.field[i][j] = p5.Vector.fromAngle(theta);
                }
            }
        }
    }

    borders() {
        if (this.position.x < -this.r ||
            this.position.y < -this.r ||
            this.position.x > width + this.r ||
            this.position.y > height + this.r) {
            this.isDie = true;
        }
    }
}