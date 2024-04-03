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