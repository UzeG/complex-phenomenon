class Target {
    constructor(position) {
        this.position = position;

        this.radius = 15;
    }

    render() {
        let { x, y } = this.position;

        push();

        fill(220, 220, 0);
        stroke(100, 100);
        strokeWeight(2);
        ellipse(x, y, this.radius);

        pop();
    }

    setPosition(newPos) {
        this.position = newPos;
    }
}