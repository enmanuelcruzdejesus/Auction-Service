import createError from "http-errors";
import {getEndedAuctions} from "../lib/getEndedAuctions";
import {closeAuction} from "../lib/closeAuction";


async function processAuctions(event, context){
    try{
        const auctionsToClose = await getEndedAuctions();
    
        console.log(auctionsToClose);
        
        const closedPromises = auctionsToClose.map(auction => closeAuction(auction.id));
        
        await Promise.all(closedPromises);

     
        return {closed: closedPromises.length };
    
    }catch(error){
        console.error(error);
        throw new createError.InternalServerError(error);
    }
  
    
}

export const handler  = processAuctions;