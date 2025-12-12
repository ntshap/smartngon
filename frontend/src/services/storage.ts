import { supabase } from '@/utils/supabase/client';

type BucketName = 'goats' | 'farms' | 'avatars';

export const storageService = {
    /**
     * Uploads a file to Supabase Storage
     * @param file The file to upload
     * @param bucket The bucket to upload to
     * @param path Optional path (folder structure). If not provided, uses a random filename.
     * @returns The public URL of the uploaded file
     */
    async uploadFile(file: File, bucket: BucketName, path?: string): Promise<string | null> {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = path || `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (uploadError) {
                console.error('Error uploading file:', uploadError);
                return null;
            }

            const { data } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            return data.publicUrl;
        } catch (error) {
            console.error('Unexpected error uploading file:', error);
            return null;
        }
    },

    /**
     * Deletes a file from Supabase Storage
     * @param path The path of the file to delete
     * @param bucket The bucket the file is in
     */
    async deleteFile(path: string, bucket: BucketName): Promise<boolean> {
        try {
            const { error } = await supabase.storage
                .from(bucket)
                .remove([path]);

            if (error) {
                console.error('Error deleting file:', error);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Unexpected error deleting file:', error);
            return false;
        }
    }
};
