"use server"

import { connectToDatabase } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";

export async function scrapeAndStoreProduct(productUrl: string){
    if(!productUrl) throw new Error('Please enter a valid product URL');

    try {
        connectToDatabase();
        const scrapedProduct = await scrapeAmazonProduct(productUrl);
        if(!scrapedProduct) throw new Error('An error occured while trying to scrape the product');
        
        // Store the product in the database

    } catch (error: any) {
        throw new Error('An error occured while trying to scrape the product');
    }
}