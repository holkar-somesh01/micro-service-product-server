import mongoose, { Document, Schema } from 'mongoose';

interface IProduct extends Document {
    name: string;
    desc: string;
    price: number;
    stock: number;
    mrp: number;
    hero: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const productSchema: Schema<IProduct> = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        stock: {
            type: Number,
            required: true,
        },
        mrp: {
            type: Number,
            required: true,
        },
        hero: {
            type: String,
            required: true,
        },
        active: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Product = mongoose.model<IProduct>('product', productSchema);

export default Product;
