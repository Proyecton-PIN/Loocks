import { ApiUrl } from '@/constants/api-constants';
import {
  GoogleSignin,
  SignInResponse,
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: 'TU_WEB_CLIENT_ID.apps.googleusercontent.com',
});

export async function googleSignIn() {
  await GoogleSignin.hasPlayServices();
  const userInfo: SignInResponse = await GoogleSignin.signIn();
  const idToken = userInfo.data?.idToken;

  await fetch(`${ApiUrl}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: idToken }),
  });
}
