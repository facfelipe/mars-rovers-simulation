
import createRover from './rover.js';

function RoverFactory(PlateauManager, ...configurations) {

    const initialize = () => {

        console.log('[Rover Factory]: OK');

        return this;
    }

    const create = (state, Navigator) => {

        console.log('[Rover Factory]: creating a Rover...');

        const rover = createRover({
            state: state
        }, Navigator);

        return rover;
    }
    
    return {
        initialize,
        create
    }
}

function createRoverFactory() {

    return new RoverFactory(...arguments);
}

export default createRoverFactory;
