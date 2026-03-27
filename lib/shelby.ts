import crypto from 'crypto';

export interface UploadResult {
  shelbyPath: string;
  shareId: string;
}

export async function uploadToShelby(
  filePath: string,
  expirationDays: number = 7
): Promise<UploadResult> {
  const shareId = crypto.randomBytes(6).toString('hex');
  const shelbyPath = `files/${shareId}`;
  
  // MOCK: Giả lập upload thành công
  console.log('MOCK: Upload would happen here for:', filePath);
  
  return { shelbyPath, shareId };
}

export async function downloadFromShelby(
  shelbyPath: string,
  outputPath: string
): Promise<void> {
  throw new Error('Download not available in demo mode');
}

export async function getShelbyAccountBalance(): Promise<{
  apt: number;
  shelbyUSD: number;
}> {
  return { apt: 0, shelbyUSD: 0 };
}
