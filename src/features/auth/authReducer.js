
import {CURRENT_USER_AVAILABLE, CURRENT_USER_NOT_AVAILABLE, WEB3_AVAILABLE, USER_EXISTS, NEW_USER, NO_USER_EXISTS, REDIRECT_TO_HOME} from './authConstants'

export default function authReducer (state = { currentUserId: 'Loading...'} , action) {

    if (action.type === WEB3_AVAILABLE){
        return {...state, web3: action.payload}
    }
    
    if (action.type === CURRENT_USER_AVAILABLE){
        return {...state, currentUserId: action.payload}
    }
   
    if (action.type ===  CURRENT_USER_NOT_AVAILABLE){
        return {...state, currentUserId: 'PLEASE SIGN IN TO METAMASK'}
    }

    if (action.type ===  USER_EXISTS){
        return {...state, user: action.payload, newUser: false, existingUser:true, currentUserId: action.payload.walletId  }
    }

    if (action.type ===  NEW_USER){
        return {...state, newUser: true }
    }
    
    if (action.type ===  NO_USER_EXISTS){
        return {...state, existingUser: false, user: null, newUser: true, currentUserId: action.payload }
    }

    if (action.type ===  REDIRECT_TO_HOME){
        return {...state, redirectToHome: true }
    }

    // if (action.type ===  REDIRECTED_HOME){
    //     return {...state, redirectToHome: false }
    // }


    return state
    
}