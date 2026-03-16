import { exec } from 'child_process';
import { promisify } from 'util';
import crypto from 'crypto';

const execAsync = promisify(exec);

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
  
  const expiration = new Date();
  expiration.setDate(expiration.getDate() + expirationDays);
  
  try {
    // Upload via Shelby CLI
    const { stdout, stderr } = await execAsync(
      `shelby upload "${filePath}" ${shelbyPath} ` +
      `-e "${expiration.toISOString()}" --assume-yes`,
      { timeout: 120000 } // 2 minute timeout
    );

    if (stderr && !stderr.includes('Upload complete')) {
      console.error('Shelby upload stderr:', stderr);
    }

    console.log('Shelby upload success:', stdout);
    
    return { shelbyPath, shareId };
  } catch (error) {
    console.error('Shelby upload error:', error);
    throw new Error('Failed to upload to Shelby network');
  }
}

export async function downloadFromShelby(
  shelbyPath: string,
  outputPath: string
): Promise<void> {
  try {
    const { stdout, stderr } = await execAsync(
      `shelby download ${shelbyPath} "${outputPath}"`,
      { timeout: 120000 }
    );

    if (stderr && !stderr.includes('Download complete')) {
      console.error('Shelby download stderr:', stderr);
    }

    console.log('Shelby download success:', stdout);
  } catch (error) {
    console.error('Shelby download error:', error);
    throw new Error('Failed to download from Shelby network');
  }
}

export async function getShelbyAccountBalance(): Promise<{
  apt: number;
  shelbyUSD: number;
}> {
  try {
    const { stdout } = await execAsync('shelby account balance');
    
    // Parse balance from CLI output
    // This is a simplified parser - adjust based on actual CLI output
    const aptMatch = stdout.match(/(\d+\.\d+)\s*APT/);
    const shelbyMatch = stdout.match(/(\d+\.\d+)\s*ShelbyUSD/);
    
    return {
      apt: aptMatch ? parseFloat(aptMatch[1]) : 0,
      shelbyUSD: shelbyMatch ? parseFloat(shelbyMatch[1]) : 0,
    };
  } catch (error) {
    console.error('Failed to get Shelby balance:', error);
    return { apt: 0, shelbyUSD: 0 };
  }
}
