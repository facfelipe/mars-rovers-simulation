import createPlateauManager from './plateau-manager.js';
import createNavigator from './navigator.js';
import createRoverLauncher from './rover-launcher.js';
import createRoverFactory from './rover-factory.js';
import createKeyboardListener from './keyboard-listener.js';

function Simulator() {

    const configurations = arguments[0] || {};

    this.modules = {
        PlateauManager: null,
        Navigator: null,
        RoverLauncher: null,
        RoverFactory: null,
        KeyboardListener: null
    };

    this.rovers = configurations.rovers || [];

    /**
     * On the modules initialization, we can previously inform their instances.
     * In this way we can just inject mock modules intance for the porpouse of do isolated tests, 
     * so we can test only Simulator methods independent of the rest of the libraries
     * 
     * @param array modules 
     * @param array parameters 
     */
    this.initializeModules = function(modules, parameters)
    {
        console.log('\n[Simulator] --- Initializing modules ---')

        this.modules.PlateauManager = modules.PlateauManager || createPlateauManager(parameters.plateau_manager || {});

        this.modules.Navigator = modules.Navigator || createNavigator(this.modules.PlateauManager);

        this.modules.RoverFactory = modules.RoverFactory || createRoverFactory(this.modules.Navigator);

        this.modules.RoverLauncher = modules.RoverLauncher || createRoverLauncher(this.modules.PlateauManager);

        this.modules.KeyboardListener = modules.KeyboardListener || createRoverLauncher(this.modules.Navigator);

        for(let module in this.modules) {

            console.log(`[Simulator] Initializing: ${module}`);

            if(null === this.modules[module]) {
                throw `[Simulator] The module ${module} was not created`;
            }            

            if ('function' !== typeof this.modules[module].initialize) { 
                console.warn(`[Simulator] The module ${module} does not have a initialize method. Skipping... It can cause system errors.`)
            }

            this.modules[module].initialize();
        }

        console.log('')
    }

    const initialize = () => {

        console.log('[Simulator] Initializing Mars Rover Simulation..');

        this.initializeModules(configurations.modules || {}, configurations.parameters || {})
    }

    const launchRover = (input) => {

        console.log('[Simulator] launching a Rover with the input: ', input)

        const rover = this.modules.RoverFactory.create({
                input: input,
                id: 'R-' + (this.rovers.length + 1)
            }, 
            this.modules.Navigator
        );

        this.rovers.push(rover);

        this.modules.RoverLauncher.launch(rover);
    }

    return {
        modules: this.modules,
        initialize,
        launchRover,
    }
}

function createSimulator() {

    const simulator = new Simulator(...arguments);

    return simulator;
}

export default createSimulator;
