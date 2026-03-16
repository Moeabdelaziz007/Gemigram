import { ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../firebase';
import { validateAvatarData } from './avatar-generator';

/**
 * Firebase Storage paths for agent avatars
 */
const AVATAR_PATH = 'agents/avatars';

/**
 * Upload agent avatar to Firebase Storage
 * 
 * @param agentId - Unique agent identifier
 * @param avatarDataUrl - Base64 data URL of avatar image
 * @returns Promise resolving to download URL
 * 
 * @throws Error if upload fails or validation fails
 */
export async function saveAgentAvatar(
  agentId: string,
  avatarDataUrl: string
): Promise<string> {
  try {
    // Validate avatar before upload
    const validation = validateAvatarData(avatarDataUrl);
    if (!validation.valid) {
      throw new Error(`Avatar validation failed: ${validation.error}`);
    }

    // Create storage reference
    const avatarRef = ref(storage, `${AVATAR_PATH}/${agentId}.png`);

    // Upload base64 string
    await uploadString(avatarRef, avatarDataUrl, 'data_url', {
      contentType: 'image/png',
      customMetadata: {
        agentId,
        uploadedAt: new Date().toISOString(),
      },
    });

    // Get download URL
    const downloadURL = await getDownloadURL(avatarRef);

    console.log('[AvatarStorage] Avatar uploaded successfully:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('[AvatarStorage] Failed to save avatar:', error);
    throw new Error(
      `Failed to save avatar: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Retrieve agent avatar URL from Firebase Storage
 * 
 * @param agentId - Unique agent identifier
 * @returns Promise resolving to avatar URL or fallback URL
 */
export async function getAgentAvatar(agentId: string): Promise<string> {
  try {
    const avatarRef = ref(storage, `${AVATAR_PATH}/${agentId}.png`);
    const url = await getDownloadURL(avatarRef);
    return url;
  } catch (error) {
    console.warn('[AvatarStorage] Avatar not found, using fallback:', agentId);
    return '/aether-entity.png';
  }
}

/**
 * Delete agent avatar from Firebase Storage
 * 
 * @param agentId - Unique agent identifier
 * @returns Promise resolving when deletion is complete
 */
export async function deleteAgentAvatar(agentId: string): Promise<void> {
  try {
    const avatarRef = ref(storage, `${AVATAR_PATH}/${agentId}.png`);
    await deleteObject(avatarRef);
    console.log('[AvatarStorage] Avatar deleted successfully:', agentId);
  } catch (error) {
    console.error('[AvatarStorage] Failed to delete avatar:', error);
    // Don't throw error if file doesn't exist
    if (!(error instanceof Error) || !error.message.includes('object does not exist')) {
      throw error;
    }
  }
}

/**
 * Check if avatar exists for agent
 * 
 * @param agentId - Unique agent identifier
 * @returns Promise resolving to boolean
 */
export async function hasAvatar(agentId: string): Promise<boolean> {
  try {
    const avatarRef = ref(storage, `${AVATAR_PATH}/${agentId}.png`);
    await getDownloadURL(avatarRef);
    return true;
  } catch {
    return false;
  }
}

/**
 * Batch upload multiple agent avatars
 * 
 * @param avatars - Map of agentId to avatar data URL
 * @returns Promise resolving to map of agentId to download URL
 */
export async function batchSaveAvatars(
  avatars: Record<string, string>
): Promise<Record<string, string>> {
  const results: Record<string, string> = {};
  const errors: Array<{ agentId: string; error: string }> = [];

  // Process in parallel with concurrency limit
  const concurrencyLimit = 5;
  const queue = Object.entries(avatars);
  const processing: Promise<void>[] = [];

  while (queue.length > 0 || processing.length > 0) {
    // Fill up to concurrency limit
    while (processing.length < concurrencyLimit && queue.length > 0) {
      const [agentId, avatarDataUrl] = queue.shift()!;
      
      const promise = saveAgentAvatar(agentId, avatarDataUrl)
        .then((url) => {
          results[agentId] = url;
        })
        .catch((error) => {
          errors.push({ agentId, error: error.message });
          results[agentId] = '/aether-entity.png'; // Fallback
        })
        .finally(() => {
          const index = processing.indexOf(promise);
          if (index > -1) {
            processing.splice(index, 1);
          }
        });

      processing.push(promise);
    }

    // Wait for at least one to complete
    if (processing.length > 0) {
      await Promise.race(processing);
    }
  }

  if (errors.length > 0) {
    console.error('[AvatarStorage] Batch upload completed with errors:', errors);
  }

  return results;
}

export default {
  saveAgentAvatar,
  getAgentAvatar,
  deleteAgentAvatar,
  hasAvatar,
  batchSaveAvatars,
};
