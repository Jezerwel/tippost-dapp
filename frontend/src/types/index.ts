export interface Post {
  id: bigint;
  creator: string;
  imageUrl: string;
  caption: string;
  tipAmount: bigint;
  timestamp: bigint;
}

export type TransactionStatus = 'idle' | 'pending' | 'success' | 'error';

export interface AppState {
  posts: Post[];
  userAddress: string | null;
  userEarnings: bigint;
  transactionStatus: TransactionStatus;
  error: string | null;
}

export type Action =
  | { type: 'SET_POSTS'; payload: Post[] }
  | { type: 'ADD_POST'; payload: Post }
  | { type: 'UPDATE_POST_EARNINGS'; payload: { postId: bigint; amount: bigint } }
  | { type: 'SET_USER_ADDRESS'; payload: string | null }
  | { type: 'SET_USER_EARNINGS'; payload: bigint }
  | { type: 'SET_TRANSACTION_STATUS'; payload: TransactionStatus }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };
