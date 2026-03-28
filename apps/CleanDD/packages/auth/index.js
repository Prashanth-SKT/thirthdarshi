import { firebaseAuth } from './firebaseAuth';
import { auth0Auth } from './auth0Auth';

const provider = process.env.AUTH_PROVIDER || 'firebase'; // default: firebase

export const authProvider = provider === 'auth0' ? auth0Auth : firebaseAuth;
