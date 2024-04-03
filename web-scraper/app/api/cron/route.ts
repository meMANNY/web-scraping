// Initiate the cron job to scrape the product

import Product from "@/lib/models/product.model";
import { connectToDatabase } from "@/lib/mongoose";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { scrapeAmazonProduct } from "@/lib/scraper";
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from "@/lib/utils";
import { NextResponse } from "next/server";


export async function GET(){
    try {
        connectToDatabase();
        const products = await Product.find();
        if(!products) throw new Error('No products found');

        //scrape latest pdt details and update db

        const updatedProducts = await Promise.all(products.map(async (currentProduct) => {
            const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);
            if(!scrapedProduct) throw new Error('An error occured while trying to scrape the product');

            const updatedPriceHistory = [...currentProduct.priceHistory, {price: scrapedProduct.currentPrice}];
       const product = {
            ...scrapedProduct,
            priceHistory: updatedPriceHistory,
            lowestPrice: getLowestPrice(updatedPriceHistory),
            highestPrice: getHighestPrice(updatedPriceHistory),
            averagePrice: getAveragePrice(updatedPriceHistory)
        
        }
        //finds new product to be updated or created
        const updatedProduct = await Product.findOneAndUpdate({
            url: scrapedProduct.url},
            product,
        
        )

        //check each pdt status and send email if necessary

        const emailNotifType = getEmailNotifType(scrapedProduct, currentProduct);
        if (emailNotifType && updatedProduct.users.length > 0) {
            const productInfo = {
              title: updatedProduct.title,
              url: updatedProduct.url,
            };
            // Construct emailContent
            const emailContent = await generateEmailBody(productInfo, emailNotifType);
            // Get array of user emails
            const userEmails = updatedProduct.users.map((user: any) => user.email);
            // Send email notification
            await sendEmail(emailContent, userEmails);
          }

          return updatedProduct;
        
        }));

        return NextResponse.json({
            message: "Ok",
            data: updatedProducts,
          });
    } catch (error: any) {
        throw new Error('An error occured while trying to scrape the product');
    }
}