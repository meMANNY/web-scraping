export function extractprice(...elements: any){
    for(const element of elements){
        if(element){
            const priceText = element.text().trim();
            if(priceText) return priceText.replace(/[^0-9.]/g, '');
            
            
        }
        return '';
    }
}

export function extractCurrency(element: any){
    if(element){
        return element.text().trim().slice(0, 1);
    }
    return '';
}