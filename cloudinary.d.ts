declare module "cloudinary" {
    const cloudinary: any;
    export default cloudinary;
}

declare module "cloudinary" {
    namespace v2 {
        function config(configOptions: {
            cloud_name: string;
            api_key: string;
            api_secret: string;
        }): void;

        namespace uploader {
            function upload(
                file: string,
                options?: Record<string, any>
            ): Promise<{ url: string; secure_url: string }>;

            function destroy(
                publicId: string,
                options?: Record<string, any>
            ): Promise<{ result: string }>;
        }
    }
}
