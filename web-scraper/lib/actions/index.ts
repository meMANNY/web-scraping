"use server"

import { scrapeAmazonProduct } from "../scraper";

export async function scrapeAndStoreProduct(productUrl: string){
    if(!productUrl) throw new Error('Please enter a valid product URL');

    try {
        const scrapedProduct = await scrapeAmazonProduct(productUrl);
        
    } catch (error: any) {
        throw new Error('An error occured while trying to scrape the product');
    }
}