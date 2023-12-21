
import AWS from 'aws-sdk';
import commonMiddleWare from '../lib/commonMiddleWare';
import createError from 'http-errors';
import validator from "@middy/validator";
import getAuctionSchema from "../lib/schemas/getAuctionSchema";


const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function getAuctionById(id){
  let auction;
  try{

    const result = await dynamoDb.get({
      TableName: "AuctionsTable",
      Key: {id}
    }).promise

    auction = result.Item;

    if(!auction){
      throw new createError.NotFound("auction id is invalid");
    }

    return auction;
  }catch(error){
    console.error(error);
    throw new createError.InternalServerError(error);
  }
}

async function getAuction(event, context){

  let auction;

  const { id } = event.pathParameters;

  auction = await getAuctionById(id);
  
  return {
    statusCode: 200,
    body: JSON.stringify(auction)
  };

}


export const handler = commonMiddleWare(getAuction).use(
  validator({inputSchema: getAuctionSchema, useDefaults: true})
);
