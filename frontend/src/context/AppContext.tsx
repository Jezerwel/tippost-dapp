import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { AppState, Action } from '@/types';

const initialState: AppState = {
  posts: [],
  userAddress: null,
  userEarnings: BigInt(0),
  transactionStatus: 'idle',
  error: null,
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_POSTS':
      return { ...state, posts: action.payload };

    case 'ADD_POST':
      return { ...state, posts: [...state.posts, action.payload] };

    case 'UPDATE_POST_EARNINGS': {
      const { postId, amount } = action.payload;
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === postId ? { ...post, tipAmount: post.tipAmount + amount } : post
        ),
      };
    }

    case 'SET_USER_ADDRESS':
      return { ...state, userAddress: action.payload };

    case 'SET_USER_EARNINGS':
      return { ...state, userEarnings: action.payload };

    case 'SET_TRANSACTION_STATUS':
      return { ...state, transactionStatus: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
