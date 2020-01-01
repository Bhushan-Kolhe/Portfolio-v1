function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}
class Activation{
    constructor(func, dfunc){
        this.func = func;
        this.dfunc = dfunc;
    }
}
let sigmoid = new Activation(
    x => 1 / (1 + Math.exp(-x)),
    y => y * (1 - y)
);
let tanh = new Activation(
    x => Math.tanh(x),
    y => 1 - (y * y)
);
let ReLU = new Activation(
    x => Math.max(0, x),
    y => Math.sign(y)
);
let LeakyReLU = new Activation(
    x => Math.max(0.01, x),
    y => {
        if(y < 0) return 0.01;
        else return y;
    }
);
class LossFunc{
    constructor(func, dfunc){
        this.func = func;
        this.dfunc = dfunc;
    }
}
let SquareMeanError = new LossFunc(
    (output, target) => {
        var error =  0.5*Math.pow(target - output,2);
        return error;
    },
    (output, target) => {
        var error = (target - output);
        return error;
    }
);
class NeuralNetwork{
    constructor(Dimensions){
        this.dimensions = Dimensions;
        this.size = Dimensions.length;
        this.lossFunc = SquareMeanError;
        this.loss = [];
        this.layers = [];
        this.output = [];
        this.InitializeParameters();
        this.setLearninRate();
    }

    train(Target){
        this.clacLoss(Target);
        this.clacDeltas();
    }

    clacLoss(Target){
        var i = 0;
        this.layers[this.size-1].neurons.forEach((neuron)=>{
            var val = neuron.calcError(this.lossFunc, Target[i]);
            this.loss.push(val);
            i++;
        });
    }

    updateWeights(){
        for(var i=0;i<this.size-1;i++){
            this.layers[i].neurons.forEach((neuron)=>{
                neuron.updateWeights(this.LearningRate);
            });
            this.layers[i].bias.updateWeights(this.LearningRate);
        }
    }

    clacDeltas(){
        for(var i = this.size-1; i > 0 ; i--){
            this.layers[i-1].neurons.forEach((neuron) => {
                neuron.clacDeltas(this.layers[i]);
            });
            this.layers[i-1].bias.clacDeltas(this.layers[i]);
        }
    }

    setLearninRate(value = 0.1){
        this.LearningRate = value;
    }

    setLossFunc(func){
        this.lossFunc = func;
    }

    InitializeParameters(){
        for(var i=0;i<this.dimensions.length;i++){
            this.layers.push(new Layer(this.dimensions[i],this.dimensions[i+1]));
        }
    }

    predict(Input){
        this.Input = Input;
        var i = 0;
        this.layers[0].neurons.forEach((e)=>{
            e.SetValue(this.Input[i]);
            i++;
        });
        this.feedForward();
    }

    feedForward(){
        for(var i=1;i<this.dimensions.length;i++){
            this.layers[i].neurons.forEach((e)=>{
                e.calcValue(this.layers[i-1]);
            });
        }
        this.getOutput();
    }

    getOutput(){
        this.output = [];
        this.layers[this.size-1].neurons.forEach((e)=>{
            this.output.push(e.getValue()); 
        })
       
    }
}

class Layer{
    constructor(size, nextLayerSize){
        this.layerSize = size;
        this.nextLayerSize = nextLayerSize;
        this.neurons = [];
        this.InitializeLayer();
    }

    InitializeLayer(){
        for(var i=0;i<this.layerSize;i++){
            this.neurons.push(new Neuron(this.nextLayerSize, i));
        }
        this.bias = new Bias(this.nextLayerSize);
    }
}
class Neuron{
    constructor(size, no){
        this.size = size;
        this.no = no;
        this.dW = [];
        this.weights = [];
        this.InitializeNeuron();
        //this.SetActivationFunction();
        this.setRandomActivation();
    }
    setRandomActivation(){
        var random = getRandomInteger(1,4);
        if(random == 1) this.SetActivationFunction(tanh);
        else if(random == 2) this.SetActivationFunction(sigmoid);
        else if(random == 3) this.SetActivationFunction(ReLU);
        else this.SetActivationFunction(LeakyReLU);
    }
    clacDeltas(nextLayer){
        var val = 0;
        this.cost = 0;
        for(var i = 0; i<this.size; i++){
            val = nextLayer.neurons[i].cost * nextLayer.neurons[i].activation.dfunc(nextLayer.neurons[i].Z) * this.value;
            this.dW.push(val);
            this.cost += nextLayer.neurons[i].cost * nextLayer.neurons[i].activation.dfunc(nextLayer.neurons[i].Z) * this.weights[i];
        }
    }

    calcError(lossfunc,desiredVal){
        this.cost = lossfunc.func(this.value, desiredVal);
        return this.getError();
    }

    getError(){
        return this.cost;
    }

    SetValue(value){
        this.value = value;
    }

    getValue(){
        return this.value;
    }

    setZ(value){
        this.Z = value;
    }

    getZ(){
        return this.Z;
    }

    updateWeights(LearningRate){
        for(var i = 0; i<this.size; i++){
            this.weights[i] -= LearningRate * this.dW[i];
        }
    }

    calcValue(prevLayer){
        var val = 0;
        for(var i=0;i<prevLayer.layerSize;i++){
            val += prevLayer.neurons[i].value * prevLayer.neurons[i].weights[this.no]; 
        }
        val += prevLayer.bias.weights[this.no];
        this.setZ(val);
        val = this.activation.func(val);
        this.SetValue(val);
        
    }

    InitializeNeuron(){
        for(var i=0;i<this.size;i++){
            this.weights.push(Math.random());
        }
    }

    SetActivationFunction(func = sigmoid){
        this.activation = func;
    }
}
class Bias{
    constructor(nextLayerSize){
        this.nextLayerSize = nextLayerSize;
        this.weights = [];
        this.db = [];
        this.InitializeBiasNeuron()
    }

    clacDeltas(nextLayer){
        var val = 0;
        for(var i = 0; i<this.nextLayerSize; i++){
            val = nextLayer.neurons[i].cost * nextLayer.neurons[i].activation.dfunc(nextLayer.neurons[i].Z);
            this.db.push(val);
        }
    }

    updateWeights(LearningRate){
        for(var i = 0; i<this.nextLayerSize; i++){
            this.weights[i] -= LearningRate * this.db[i];
        }
    }

    InitializeBiasNeuron(){
        for(var i=0;i<this.nextLayerSize;i++){
            this.weights.push(Math.random());
        }
    }
}

class GeneticAlgorithm{
    constructor(populationSize, networkDimensions){
        this.populationSize = populationSize;
        this.population = [];
        this.networkDimensions = networkDimensions;
        this.networkDimensionSize = this.networkDimensions.length;
        this.InitializePopulation();
        this.percentPopulationPreserve = 5;
        this.mutationRate = 0.2;
        this.generationNumber = 0;
        this.randomNewNetworks = 0;
        this.copyBestSnake = false;
        this.noOfTimesTheBestIsCopied = 3;
    }

    InitializePopulation(){
        for(var i=0; i<this.populationSize ; i++){
            this.population.push({
                network: new NeuralNetwork(this.networkDimensions),
                fitness: 0
            });
        }
    }

    SortByFitness(){
        this.population.sort((a,b) => {
            return a.fitness-b.fitness;
        });
    }

    setMutationRate(value) {  this.mutationRate = value;  }

    setPercentPopulationPreserve(valus){ this.percentPopulationPreserve = value; }

    selectionAndBreeding(){
        var p = (this.percentPopulationPreserve / 100) * this.populationSize;
        var r = (this.randomNewNetworks / 100) * this.populationSize;
        var newPopulation = [];
        p = Math.floor(p);
        r = Math.floor(r);
        newPopulation = this.population.splice(this.populationSize - p);
        if(this.copyBestSnake == true){
            for(var i=0; i<this.noOfTimesTheBestIsCopied; i++){
                newPopulation.push(newPopulation[p-1]);
            }
            p += this.noOfTimesTheBestIsCopied;
        }
        for(var i=0; i<p; i++){
            newPopulation[i].fitness = 0;
            /*
            if(this.population[i].fitness < 0){
                var child = {
                    network: new NeuralNetwork(this.networkDimensions),
                    fitness: 0
                };
                this.population[i] = child; 
            }
            */
        }
        for(var i=0; i<this.populationSize - p - r; i++){
            var parent1 = getRandomInteger(0,p-1);
            var parent2 = getRandomInteger(0,p-1);
            while(parent2 == parent1){
                parent2 = getRandomInteger(0,p-1);
            }
            parent1 = newPopulation[parent1];
            parent2 = newPopulation[parent2];
            var crossoverPoint = getRandomInteger(1, this.networkDimensionSize-1);
            var child = {
                network: new NeuralNetwork(this.networkDimensions),
                fitness: 0
            };
            var randomness = getRandomInteger(0,1);
            for(var j = 0; j < this.networkDimensionSize; j++){
                for(var k =0; k < parent1.network.layers[j].neurons.length; k++){
                    randomness = getRandomInteger(0,1);
                    if(randomness == 0){
                        child.network.layers[j].neurons[k] = parent1.network.layers[j].neurons[k];
                    }else{
                        child.network.layers[j].neurons[k] = parent2.network.layers[j].neurons[k];
                    }
                }
                /* Point Crossover 
                if(j < crossoverPoint){
                    if(randomness == 0){
                        child.network.layers[j] = parent1.network.layers[j];
                    }else{
                        child.network.layers[j] = parent2.network.layers[j];
                    }
                }else{
                    if(randomness == 0){
                        child.network.layers[j] = parent1.network.layers[j];
                    }else{
                        child.network.layers[j] = parent2.network.layers[j];
                    }
                }
                */
            }   
            newPopulation.push(child);
        }
        for(var i = 0; i<r; i++){
            var child = {
                network: new NeuralNetwork(this.networkDimensions),
                fitness: 0
            };
            newPopulation.push(child);
        }
        this.generationNumber++;
        this.population = newPopulation;
    }

    mutation(){
        this.population.forEach((entity) =>{
            if(Math.random() < this.mutationRate){
                entity.network.layers.forEach((layer)=>{
                    if(Math.random() < Math.random()){
                        layer.neurons.forEach((neuron)=>{
                            if(Math.random() < Math.random()){
                                for(var i=0;i<neuron.size;i++){
                                    neuron.weights[i] = Math.random();
                                }
                            }
                        });
                    }
                });
            }
        });
    }
}
