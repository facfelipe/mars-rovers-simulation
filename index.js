import createSimulator from './lib/simulator.js'

let plateauElementGetter = null;
let structureDimensions = null;

const setPlateauElementGetter = elementGetter => plateauElementGetter = elementGetter;
const setStructureDimensions = structureDimensions => structureDimensions = structureDimensions;

const createDefaultConfigurations = () => ({
        parameters: {
            plateau_manager: {
                elementGetter: plateauElementGetter,
                structure_dimensions: structureDimensions || {
                    x: 15,
                    y: 20
                }
            }
    }
});

const build = () => {

    try {

        const configurations = createDefaultConfigurations();

        const simulator = createSimulator(configurations);

        simulator.initialize();

        return simulator;
    
    } catch(error) {        
        console.error(error);
    }
}

window.sleep = function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
    setPlateauElementGetter: setPlateauElementGetter,
    setStructureDimensions: setStructureDimensions,
    build: build
}
