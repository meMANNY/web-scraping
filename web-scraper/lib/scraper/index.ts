import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractprice } from "../utils";
export async function scrapeAmazonProduct(productUrl: string){
    if(!productUrl) throw new Error('Please enter a valid product URL');

    // curl --proxy brd.superproxy.io:22225 --proxy-user brd-customer-hl_ee99a3ee-zone-pricewise:quo49d3cunhb -k https://lumtest.com/myip.json
    try {
        // scrape the product
        //Brightdata proxy configuration
        const username = String(process.env.USERNAME);
        const password = String(process.env.PASSWORD);
        const port = 22225;
        const session_id = (100000*Math.random())|0;
        
        const options = {
            auth: {
                username: `${username}-session-${session_id}`,
                password,},
                host: 'brd.superproxy.io',
                port,
                rejectUnauthorized: false,};

                try {
                    //fetch the product page
                    const response = await axios.get(productUrl, options);
                    const $ = cheerio.load(response.data);

                    //extract the product details
                    const title = $('#productTitle').text().trim();
                    const price = extractprice(
                        $('.priceToPay span.a-price-whole'),
                        $('a.size.base.a-color-price'),
                        $('.a-button-selected .a-color-base')
                    );
                    
                    const outOfStock = $('#availability').text().includes('Currently unavailable');
                    const image = $('#imgBlkFront').attr('data-a-dynamic-image') || $('#landingImage').attr('data-a-dynamic-image') 
                    || '';

                    const imageUrls = Object.keys(JSON.parse(image));

                    const currency = extractCurrency($('.a-price-symbol'));
                } catch (error: any) {
                    throw new error('An error occured while trying to scrape the product');
                }
        
                        
    } catch (error: any) {
        throw new Error('An error occured while trying to scrape the product');
    }
}