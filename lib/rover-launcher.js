
function RoverLauncher(PlatoManager, ...configurations) {

    this.queue = [];

    this.launched = [];

    this.isLaunching = false;

    const initialize = () => {
        console.log('[Rover Launcher]: OK');
    }

    /*
     * Some awesome queue processing goes here...
     * The better solution is put the rover start on a promisse then only get the another rover after finishes,
     * but now in this simply way will works as expectd
     */
    const processQueue = () => {

        if(this.isLaunching) {
            console.log('[Rover Launcher]: queue processing is busy, skipping... ', this.queue);
            return this;
        }

        this.isLaunching = true;

        console.log('[Rover Launcher]: processing queue... ', this.queue);

        const item = this.queue.shift();

        console.log('[Rover Launcher]: item ', item);

        if(!item) {
            this.isLaunching = false;            
            console.log('[Rover Launcher]: all done!');
            return this;
        }
            
        console.log('[Rover Launcher]: will deploy a rover..', item.rover);

        PlatoManager.land(item.rover, async(rover) => {

            this.isLaunching = false;

            console.log('[Rover Launcher]: Rover landed! ', rover);

            this.launched.push({
                rover: item.rover,
                date: new Date()
            })

            await sleep(1000);

            processQueue();            
        });

        return this;
    }
    
    const launch = (Rover) => {

        this.queue.push({
            rover: Rover
        });

        // Avoiding unecessary calls
        if(!this.isLaunching) {
            processQueue();
        }

        return this;
    }

    return {
        initialize,
        launch : launch,
        queue: this.queue
    }
}

function createRoverLauncher() {

    return new RoverLauncher(...arguments);
}

export default createRoverLauncher;
