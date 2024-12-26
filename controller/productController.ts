import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import cloudinary from "cloudinary";
import { upload } from "../utils/upload";
import { publishToQueue } from "../connection/rabbit";
import Product from "../modal/Product";


// dotenv.config();
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

// Get all products
export const adminGetAllProducts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await Product.find();
    res.json({
        message: "Product Fetch Success",
        products: result,
    });
});

// Add a new product
// export const adminAddProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
//     upload(req, res, async (err: any) => {
//         if (err) {
//             console.log(err);
//             return res.status(400).json({ message: "Upload error" });
//         }

//         try {
//             const { secure_url } = await cloudinary.v2.uploader.upload(req.file!.path);
//             const result = await Product.create({ ...req.body, images: secure_url });
//             res.json({ message: "Product Add Success", result });
//         } catch (uploadError) {
//             console.error("Error uploading image to Cloudinary:", uploadError);
//             res.status(500).json({ message: "Internal server error" });
//         }
//     });
// });




export const adminAddProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    upload(req, res, async (err: any) => {
        if (err) {
            console.error("File upload error:", err);
            return res.status(400).json({ message: "Upload sss error" });
        }

        try {

            const { secure_url } = await cloudinary.v2.uploader.upload(req.file!.path);


            const { name, desc, price, stock, mrp, active } = req.body;
            const result = await Product.create({
                name,
                desc,
                price,
                stock,
                mrp,
                active: active !== undefined ? active : false,
                hero: secure_url,
            });
            publishToQueue('productQueue', {
                action: 'add',
                _id: result._id,
                name: result.name,
                desc: result.desc,
                price: result.price,
                stock: result.stock,
                mrp: result.mrp,
                active: result.active,
                hero: result.hero
            });

            res.json({ message: "Product Add Success", result });
        } catch (uploadError) {
            console.error("Internal server error:", uploadError);
            res.status(500).json({ message: "Internal server error", error: uploadError });
        }
    });
});



// Update a product
export const adminUpdateProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    upload(req, res, async (err: any) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ message: "Upload error" });
        }

        try {
            console.log(req.file, "FILE");
            console.log(req.files, "REQ.FILES");

            const { secure_url } = await cloudinary.v2.uploader.upload(req.file!.path);
            const { updateId } = req.params;
            const updatedProduct: any = await Product.findByIdAndUpdate(
                updateId,
                { ...req.body, hero: secure_url },
                { new: true }
            );
            const updated: any = await Product.findById(updatedProduct._id)
            await publishToQueue("updateProductQueue", updated)

            if (!updatedProduct) {
                return res.status(404).json({ message: "Product not found" });
            }

            res.json({ message: "Product update success", product: updatedProduct });
        } catch (err) {
            console.error("Error updating product:", err);
            res.status(500).json({ message: "Internal server error", error: err });
        }
    });
});

// Delete a product
export const adminDeleteProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { deleteId } = req.params;

    const result = await Product.findById(deleteId);
    if (!result) {
        res.status(404).json({ message: "Product not found" });
        return;
    }

    const str = result.hero.split("/");
    const img = str[str.length - 1].split(".")[0];
    await cloudinary.v2.uploader.destroy(img);
    const product: any = await Product.findByIdAndDelete(deleteId);
    await publishToQueue("deleteProductQueue", product._id)
    res.json({ message: "Product Delete Success" });
    return;
})
// Deactivate a product
export const deactivateProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { deactiveId } = req.params;
    await Product.findByIdAndUpdate(deactiveId, { active: false });
    res.json({ message: "Product Deactivate Success" });
});

// Activate a product
export const activateProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { activeId } = req.params;
    await Product.findByIdAndUpdate(activeId, { active: true });
    res.json({ message: "Product Activate Success" });
});

// Get product details
export const getProductDetails = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    res.json({ message: "Product Details Fetch Success" });
});
