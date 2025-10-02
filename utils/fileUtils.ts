
/**
 * Converts a File object to a base64 string, stripping the data URL prefix.
 * @param file The file to convert.
 * @returns A promise that resolves to the base64 encoded string.
 */
export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // Strip the data URL prefix (e.g., "data:image/jpeg;base64,")
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = error => reject(error);
    });
}

/**
 * Extracts a name from a filename by removing the extension and any prefixes separated by underscores.
 * @param filename The full filename (e.g., "photo_of_john.jpg").
 * @returns The extracted name (e.g., "john").
 */
export function extractNameFromFilename(filename: string): string {
    let name = filename.split('.').slice(0, -1).join('.');
    let parts = name.split(/_|-| /); // Split by underscore, hyphen, or space
    return parts[parts.length - 1];
}
