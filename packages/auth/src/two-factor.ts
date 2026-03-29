import { authenticator } from 'otplib';
import QRCode from 'qrcode';

export function generateTwoFactorSecret(userEmail: string) {
  const secret = authenticator.generateSecret();
  const otpauthUrl = authenticator.keyuri(userEmail, 'ForgeAI', secret);
  return { secret, otpauthUrl };
}

export async function generateQRCodeDataURL(otpauthUrl: string): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(otpauthUrl, {
      margin: 1,
      width: 250,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return dataUrl;
  } catch (err) {
    throw new Error('Failed to generate QR sequence');
  }
}

export function verifyTOTP(token: string, secret: string): boolean {
  try {
    return authenticator.verify({ token, secret });
  } catch (err) {
    return false;
  }
}
