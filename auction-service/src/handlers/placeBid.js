
import AWS from 'aws-sdk';
import commonMiddleWare from '../lib/commonMiddleWare';
import createError from 'http-errors';
import { getAuctionById } from './getAuction';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context){

  let updatedAuction;
  const { id } = event.pathParameters;
  const { amount } = event.body;

  let auction  = await getAuctionById(id);

  if(amount <= auction.highestBid.amount){
    throw new createError.Fordibben("the amount should be greater than the highest bid")
  }
  
  const params = {
      TableName: "AuctionsTable",
      Key: {id},
      UpdateExpression: "set highestBid.amount = :amount",
      ExpressionsAttributesValues:{
          ":amount": amount
      },
      ReturnValues: "ALL_NEW"
  }

  try{
    const result = await dynamoDb.
    update(params).promise();
    updatedAuction = result.Attributes;
  }catch(error){
    console.error(error);
    throw new createError.InternalServerError(error);
  }

 
  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction)
  };

}


export const handler = commonMiddleWare(placeBid);
