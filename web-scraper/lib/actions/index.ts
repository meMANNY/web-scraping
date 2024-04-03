"use server"

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDatabase } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { User } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer";

export async function scrapeAndStoreProduct(productUrl: string){
    if(!productUrl) throw new Error('Please enter a valid product URL');

    try {
        connectToDatabase();
        const scrapedProduct: any = await scrapeAmazonProduct(productUrl);
        if(!scrapedProduct) throw new Error('An error occured while trying to scrape the product');
        
        // Store the product in the database

        let product = scrapedProduct;
        const existingProduct = await Product.findOne({url: scrapedProduct.url});

        if(existingProduct){
            const updatedPriceHistory: any = [...existingProduct.priceHistory, {price: scrapedProduct.currentPrice}];
        product = {
            ...scrapedProduct,
            priceHistory: updatedPriceHistory,
            lowestPrice: getLowestPrice(updatedPriceHistory),
            highestPrice: getHighestPrice(updatedPriceHistory),
            averagePrice: getAveragePrice(updatedPriceHistory)
        }
        }
        //finds new product to be updated or created
        const newProduct = await Product.findOneAndUpdate({
            url: scrapedProduct.url},
            product,
            {new: true, upsert: true}
        )

        revalidatePath(`/product/${newProduct._id} `);

    } catch (error: any) {
        throw new Error('An error occured while trying to scrape the product');
    }
}

export async function getProductById(productId: string){
    try {
        connectToDatabase();
        const product = await Product.findOne({_id: productId})

        if(!product) throw new Error('Product not found');
        return product;
    } catch (error: any) {
        console.log(error);
    }
    
}

export async function getAllProducts(){
try {
    connectToDatabase();
    const products = await Product.find();
    return products;
} catch (error: any) {
    console.log(error);
}
}
export async function getSimilarProducts(productId: string){
try {
    connectToDatabase();
    const currentproduct = await Product.findById(productId);
    if(!currentproduct) throw new Error('Product not found');

    const similarProducts = await Product.find({
        _id: { $ne: productId }
    }).limit(4);
} catch (error: any) {
    console.log(error);
}

}

export async function addUserEmailToProduct(productId: string, userEmail: string){
    try {
        //send our first email
        const product = await Product.findById(productId);
        if(!product) throw new Error('Product not found');

        const userExists = product.users.some((user: User) => user.email === userEmail);
        if(!userExists){
            product.users.push({email: userEmail});
            await product.save();
            const emailContent = generateEmailBody(product, "WELCOME");
            //send email to user
            await sendEmail(emailContent, [userEmail]);
        }

    } catch (error:any) {
        console.log(error)
    }
}