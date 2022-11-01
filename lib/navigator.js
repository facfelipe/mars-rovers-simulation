
function Navigator(PlatoManager, ...configurations) {

    this.DIRECTION_NORTH = 'N';
    this.DIRECTION_SOUTH = 'S';
    this.DIRECTION_EAST = 'E';
    this.DIRECTION_WEAST = 'W';
    
    this.DIRECTIONS = [
        this.DIRECTION_NORTH,        
        this.DIRECTION_EAST,
        this.DIRECTION_SOUTH,
        this.DIRECTION_WEAST,
    ];
    
    const initialize = () => {
        console.log('[Navigator]: OK');
    }

    const readNasaCoordinates = (input) => {

        const data = input.split(' ');
        
        return {
            x: parseInt(data[0]),
            y: parseInt(data[1]),
            direction: this.DIRECTIONS.indexOf(data[2]) ? data[2] : this.DIRECTION_NORTH,
        };
    }

    const readNasaMovementSequence = (input) => {

        const movements = input.split('');

        return movements;
    }

    const moveRover = (Rover) => {

        try {

            const history = Object.assign({}, Rover.state.coordinates);

            switch(Rover.state.coordinates.direction) {
                case this.DIRECTION_NORTH:
    
                    if(PlatoManager.dimensions.x === (Rover.state.coordinates.x + 1)) {
                        throw this.DIRECTION_NORTH;
                    }

                    Rover.state.coordinates.x++;                    
                    break;
                case this.DIRECTION_SOUTH:

                    if(0 > (Rover.state.coordinates.x - 1)) {
                        throw this.DIRECTION_SOUTH;
                    }

                    Rover.state.coordinates.x--;
                    break;
                case this.DIRECTION_EAST:

                    if(PlatoManager.dimensions.y === (Rover.state.coordinates.y + 1)) {
                        throw this.DIRECTION_EAST;
                    }

                    Rover.state.coordinates.y++;
                    break;
                case this.DIRECTION_WEAST:

                    if(0 > (Rover.state.coordinates.y - 1)) {
                        throw this.DIRECTION_WEAST;
                    }

                    Rover.state.coordinates.y--;
                    break;
            }

            Rover.addCoordinatesHistory(history);
            
        } catch (direction) {
            console.warn(`[Navigator]: Rover ${Rover.state.id} can't move to this direction right now: ${direction}`);
        }

        console.log(`[Navigator]: Rover ${Rover.state.id} moved forward}`)

        notifyMovement(Rover);
    }

    // @todo: change for an Observer Design Pattern
    const notifyMovement = (Rover) => {

        PlatoManager.movementListener(Rover);

        return this;
    }
    
    return {
        DIRECTION_NORTH: this.DIRECTION_NORTH,
        DIRECTION_SOUTH: this.DIRECTION_SOUTH,
        DIRECTION_EAST: this.DIRECTION_EAST,
        DIRECTION_WEAST: this.DIRECTION_WEAST ,
        DIRECTIONS: this.DIRECTIONS,
        initialize,
        readNasaCoordinates: readNasaCoordinates,
        readNasaMovementSequence: readNasaMovementSequence,
        moveRover: moveRover,
        notifyMovement: notifyMovement
    }
}

function createNavigator() {

    return new Navigator(...arguments);
}

export default createNavigator;