
function PleateauManager(configurations) {

    this.CELL_STATES = {
        // Having available and ocuppied separated we could implement extra logic as could be ocuppied by 2 rovers..
        available: true,
        // The Rovers (or orther objects?) that is occupying this cell
        occupied: {},
        // We could change the color for the purpose of showing a trail
        ground_color_density: 100
    }

    this.structure = [];

    this.dimentions = configurations.structure_dimensions;

    const platoElementGetter = configurations.elementGetter;    

    this.build = function(x, y) {

        console.log(`[Pleateau Manager]: building plateau scruture... with dimensions ${x}x${y}`);

        for(let i=0; i<x ;i++) {

            if (this.structure[i] === undefined) {
                this.structure[i] = [];
            }

            for(let j=0; j<y; j++) {

                if (this.structure[i][j] === undefined) {
                    this.structure[i][j] = [];
                }
                
                this.structure[i][j] = {
                    state: Object.assign({}, this.CELL_STATES)
                }
            }
        }
    }

    /**
     * The render could be a other module for the porpouse of better Separation of Concerns and flexibility/maintainability,
     * having a different render (using SVG for exaomple)
     */
    this.render = async() => {

        console.log('[Pleateau Manager]: rendering...');

        const createElement = (tag, classes, content = null) => {
            const element = document.createElement(tag);
            
            if(0 < classes.length) {
                element.classList.add(...classes);
            }

            if(content) {
                element.innerHTML = content;
            }

            return element;
        }

        const platoElement = platoElementGetter();

        platoElement.innerHTML = '';

        for(let i in this.structure) {

            const row = createElement('div', ['row']);

            platoElement.prepend(row);

            for(let j in this.structure[i]) {

                const classes = ['cell'];

                let content = '';

                if(!this.structure[i][j].state.available) {

                    classes.push('with-lander');

                    const rover = this.structure[i][j].state.occupied;

                    classes.push(`dir-${rover.state.coordinates.direction.toLowerCase()}`);

                    content = rover.state.id;
                }

                const cell = createElement('div', classes, content);

                row.appendChild(cell);
            }
        }

        console.log('[Pleateau Manager]: rendering done!');

        return this;
    }

    const initialize = () => {

        this.build(this.dimentions.x, this.dimentions.y)

        this.render();

        console.log('[Pleateau Manager]: OK');

        return this;
    }

    const updateCell = (rover, coordinates) => {

        const available = !rover;

        if(!available && !this.structure[coordinates.x][coordinates.y].state.available) {
            console.warn('This cell is already taken!');
            //return this;
        }

        this.structure[coordinates.x][coordinates.y].state.available = available;
        this.structure[coordinates.x][coordinates.y].state.occupied = rover || {};

        this.render();

        return this;
    }

    /**
     * This land process could having this own module as well
     * 
     * @param Rover rover 
     * @param function callback 
     */
    const land = (rover, callback) => {
        console.log('[Pleateau Manager]: landing the Rover... ', rover);

        rover.start(() => callback(rover));
    }
   
    const movementListener = (rover) => {

        updateCell(rover, rover.state.coordinates);

        if(rover.state.coordinates_history.length) {
            const history = rover.state.coordinates_history[rover.state.coordinates_history.length -1];        
            updateCell(null, history);
        }
    }

    return {
        initialize,
        render: this.render,
        land: land,
        updateCell: updateCell,
        movementListener: movementListener,
        dimensions: this.dimentions,
    }
}

function createPleateauManager() {

    return new PleateauManager(...arguments);
}

export default createPleateauManager;
