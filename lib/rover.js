
function Rover(configurations, Navigator) {
    
    this.state = Object.assign({
            id: 'R-' + Math.floor(Math.random() * 100),
            input: [],
            coordinates: {
                x: 0,
                y: 0,
                direction: null,
            },
            coordinates_history: [],
        }, 
        configurations.state
    );

    this.initialize = () => {
        console.log(`[Rover ${this.state.id}] is initializing...`);

        setupLandingCoordinates();
    }

    const setupLandingCoordinates = () => {
        this.state.coordinates = Object.assign({} , Navigator.readNasaCoordinates(this.state.input[0]));
        return this;
    }

    this.addCoordinatesHistory = function (coordinates) {
        this.state.coordinates_history.push(coordinates);
    },

    this.spin = function (right = true) {

        console.log(`[Rover ${this.state.id}] is spinning to ${right ? 'right' : 'left'}`);

        let index = Navigator.DIRECTIONS.findIndex(index => index === this.state.coordinates.direction);

        if(right) {
            this.state.coordinates.direction = Navigator.DIRECTIONS[3 === index ? 0 : ++index];
        } else { // The unique else in this code...
            this.state.coordinates.direction = Navigator.DIRECTIONS[0 === index ? 3 : --index];
        }        

        Navigator.notifyMovement(this);
        
        return this;
    }

    const movementsProcessor = (command) => {
        
        const availableMovements = {
            L(rover) {
                rover.spin(false);
            },
            R(rover) {
                rover.spin();
            },
            M(rover, Navigator) {                
                Navigator.moveRover(rover);
            },
        }

        const moveFunction = availableMovements[command];

        if(moveFunction) {
            console.log(`[Rover ${this.state.id}] executing the command: ${command}`);

            return moveFunction(this, Navigator);
        }

        console.warn(`[Rover ${this.state.id}] tried to execute an unavailable command: ${command}`);
    }

    const move = async(movement, nextMove = () => {}) => {

        movementsProcessor(movement);

        Navigator.notifyMovement(this);
        
        return nextMove();
    }

    /**
     * A recursive function that process the movements one at time
     * In this way is better than just a loop
     * 
     * @param array movements 
     */
    const processMovementsSequence = (movements, onEnding = () => {}) => {

        const movement = movements.shift();

        if(movement) {

            return move(movement, async() => {

                // Faking a delay
                await sleep(1000);

                processMovementsSequence(movements, onEnding);
            })
        }

        onEnding();

        return this;
    }

    const start = async(whenStop) => {

        this.initialize();

        Navigator.notifyMovement(this);        

        console.log(`[Rover ${this.state.id}] starting...`);

        // Faking a delay
        await sleep(1000);        

        if(undefined === this.state.input[1]) {
            console.warn(`[Rover ${this.state.id}] no movement sequence was provided. No places to go.`);
            return whenStop();
        }

        const movements = Navigator.readNasaMovementSequence(this.state.input[1]);

        processMovementsSequence(movements, () => whenStop());        

        return this;
    }
    
    return {
        state: this.state,
        spin: this.spin,
        start: start,
        addCoordinatesHistory: this.addCoordinatesHistory
    }
}

function createRover() {

    return new Rover(...arguments);
}

export default createRover;
