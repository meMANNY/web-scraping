'use client';

import { scrapeAndStoreProduct } from "@/lib/actions";
import { FormEvent, useState } from "react";
const isValidAmazonProductURL= (url: string)=>{
    try {
        const parsedURL = new URL(url);
        const hostname = parsedURL.hostname;

        if(hostname.includes('amazon.com') || hostname.includes('amazon.')|| hostname.endsWith('amazon')) return true;
    } catch (error:any) {
        return false;
    }
    return false;
}
const SearchBar = () => {
    const [searchPrompt, setSearchPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {

        event.preventDefault();
        const isValidLink = isValidAmazonProductURL(searchPrompt);
        if(!isValidLink) return alert('Please enter a valid Amazon product link');

        try {
            setIsLoading(true);
            //call the action to scrape the product
            const product = scrapeAndStoreProduct(searchPrompt);

        } catch (error:any) {
            console.log(error);
        }
        finally{
            setIsLoading(false);
        }
        
    }

  return (
    <div>
    <form onSubmit={handleSubmit} className=" flex flex-wrap gap-4 mt-12">
        <input 
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="Enter product link"
        className="searchbar-input"
        />
        <button className="searchbar-btn" type="submit" disabled = {searchPrompt === ''}>
            {isLoading ? "Searching" : 'Search'}</button>
    </form>        
    </div>
  )
}

export default SearchBar
