import  { useState, useEffect } from 'react';

let globalState = {};
//Array full of functions that can be called to update all components using the custom hook
let listeners = [];
let actions = {};

export const useStore = () => {
    const setState = useState(globalState)[1];

    //When dispatch is called, global state is updated
    //Listeners called, which are just set state calls, causing a rerender
    const dispatch = (actionIdentifier, payload) => {
        const newState = actions[actionIdentifier](globalState, payload)
        globalState = {...globalState, ...newState};

        for (const listener of listeners) {
            listener(globalState);
        }
    };

    
    //Register one listener per component
    useEffect(() => {
        listeners.push(setState);
    
    //Cleanup function to remove listener when components unmounts    
    return () => {
        console.log(listeners)
        listeners = listeners.filter(li => li !== setState)
    }



    }, [setState]);

    return [globalState, dispatch];
}

//Initializes store
export const initStore = (userActions, initialState) => {
    if (initialState) {
        globalState = {...globalState, ...initialState};
    }
    actions = {...actions, ...userActions};
};