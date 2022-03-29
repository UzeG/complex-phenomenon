const shuffleArray = arr => arr.sort(() => Math.random() - 0.5);

class Population {
    constructor(option) {
        let { maxNum, startPoint } = option.population;
        let { maxSpeed, maxForce } = option.mover;
        let { target, mutationRate, generationTime } = option.genetic;

        this.maxNum = maxNum;
        this.startPoint = startPoint;

        this.maxSpeed = maxSpeed;
        this.maxForce = maxForce;

        this.target = target;
        this.mutationRate = mutationRate;

        this.container = [];
        this.matingPool = [];
        this.generationTime = generationTime;  // 每一代的存活时间(帧)

        this.generations = 0;


        this.init();
    }

    init() {
        for (let i = 0; i < this.maxNum; i++) {
            let flowField = new FlowField();
            let mover = new Mover(this.startPoint.copy(), this.maxSpeed, this.maxForce, flowField);  // 传值
            this.container.push(mover);
        }

        this.calcGrouperFitness();
    }

    render() {
        this.container.forEach(mover => mover.move());
    }

    /*
        计算适应度
    */
    calcGrouperFitness() {
        this.container.forEach(mover => mover.calcFitness(this.target, this.generationTime));
    }

    getBestGrouper() {
        let best = this.container[0];
        this.container.forEach(mover => {
            if (mover.fitness > best.fitness) {
                best = mover;
            }
        })
        return best;
    }

    /*
        选择
    */
    naturalSelection() {
        this.matingPool = [];

        let maxFitness = this.getBestGrouper().fitness;

        let minFitness = this.container[0].fitness;
        this.container.forEach(mover => {
            if (mover.fitness < minFitness) {
                minFitness = mover.fitness;
            }
        })
        console.log('@minFitness', minFitness);
        console.log('@maxFitness', maxFitness);

        this.container.forEach(mover => {
            let fitness = map(mover.fitness, 0, maxFitness, 0, 1);
            let chance = floor(fitness * 100);
            for (let i = 0; i < chance; i++) {
                this.matingPool.push(mover);
            }
        })
    }

    /*
        产生后代
    */
    generate() {
        let i = 0;
        // 打乱 matingPool
        shuffleArray(this.matingPool);
        while (i < this.maxNum) {
            let a = floor(random(this.matingPool.length));
            let b = floor(random(this.matingPool.length));
            if (random(1) > this.matingPool[a].fitness || random(1) > this.matingPool[b].fitness || a == b) {
                continue;
            }

            let partnerA = this.matingPool[a];
            let partnerB = this.matingPool[b];

            let child = partnerA.crossover(partnerB);

            this.container[i] = child;
            this.container[i].mutate(this.mutationRate);

            i++;
        }

        this.generations++;
    }

    timingGrouper() {
        this.container.forEach(mover => {
            if (!mover.isDie) mover.survivalTime++;
        });
    }


    /*

    */
    evaluate() {
        let succeedNum = 0;
        this.container.forEach(mover => {
            if (mover.position.dist(this.target.position) < 20) {
                mover.isSucceed = true;
                succeedNum++;
            }
        })

        return succeedNum;
    }
}