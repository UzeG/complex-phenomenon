let target;
let population;
let generationTimer;

let succeedRecord = 0;

function setup() {
    createCanvas(1200, 600);
    background(235);

    target = new Target(createVector(1100, height / 2));

    population = new Population({
        population: {
            maxNum: 100,
            startPoint: createVector(100, height / 2)
        },
        mover: {
            maxSpeed: 10,
            maxForce: .2
        },
        genetic: {
            target: target,
            mutationRate: .01,
            generationTime: 500
        }
    })

    generationTimer = population.generationTime;
}

function draw() {
    background(235);

    text(`Count Down: ${generationTimer}`,
        10, 18);
    text(`Best Fitness: ${population.getBestGrouper().fitness}`,
        10, 43)
    text(`Generation #: ${population.generations + 1}`,
        10, 68);

    push();
    textSize(15);
    textAlign(CENTER);
    text(`Population #: ${population.maxNum}`, width/2, 20)
    text(`Succeed #: ${population.evaluate()}`, width / 2, 40);
    if (population.generations > 0) text(`Succeed (Last Time) #: ${succeedRecord}`, width / 2, 60);
    pop();

    population.calcGrouperFitness();
    drawBest();

    generationTimer--;
    if (generationTimer < 0) {
        succeedRecord = population.evaluate();
        population.naturalSelection();
        population.generate();
        generationTimer = population.generationTime;
    }
    target.render();
    drawBest();
    population.render();
    population.timingGrouper();
}

function mousePressed() {
    target.setPosition(createVector(mouseX, mouseY));
}

function drawBest() {
    let { x, y } = population.getBestGrouper().position;

    push();
    fill(255, 0, 0, 50);
    ellipse(x, y, 30);
    pop();

    push();
    line(target.position.x, target.position.y, x, y);
    pop()
}