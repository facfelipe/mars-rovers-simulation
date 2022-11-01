
function KeyboardListener(configurations) {

    const initialize = () => {

        console.log('[KeyboardListener]: OK');
    }
    
    return {
        initialize,
    }
}

function createKeyboardListener() {

    return new KeyboardListener(...arguments);
}

export default createKeyboardListener;