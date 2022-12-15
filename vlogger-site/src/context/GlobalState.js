import { createContext } from "react";
import { useSetState } from 'react-use';

const initialState = {
    notes: [],
}

export const GlobalContext = createContext(initialState)

export const GlobalProvider = ({ children }) => {
    const [state, setState] = useSetState(initialState)

    const setNotes = (notes) => setState({notes})
    
    function addVlog(data) {
        setState( oldState => ({
            notes: [data, ...oldState.notes]
        }))
    }

    function addAllVlogs(data, username) {
        if(username){
            const userData = data.filter((user) => user.username === username)
            setNotes(userData)
        }else{  
            setNotes(data)
        }
        
    }

    function getOneVlog(data) {
        setNotes(data)
    }

    function removeVlog(blogId) {
        const noteIndex = state.notes.map(object => object.blogId).indexOf(blogId);
        const newState = state.notes.splice(noteIndex, 1);

        setState( () => ({
            notes: [...newState]
        }))
    }

    return(
        <GlobalContext.Provider 
            value = {{
                notes: state.notes,
                addVlog,
                addAllVlogs,
                removeVlog,
                getOneVlog
            }}
        >
            {children}
        </GlobalContext.Provider>
    );

};