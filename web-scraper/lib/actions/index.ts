"use server"

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDatabase } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";

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