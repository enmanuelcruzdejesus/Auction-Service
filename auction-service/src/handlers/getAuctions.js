
import AWS from 'aws-sdk';
import commonMiddleWare from '../lib/commonMiddleWare';
import createError from 'http-errors';

const dynamoDb = new AWS.DynamoDB.DocumentClient();


async function getAuctions(event, context){
  const { status }  = event.queryStringParameters;

  let auctions;

  let params = {
    TableName : "AuctionsTable",
    IndexName: 'statusAndEndDate',
    KeyConditionExpression: '#status = :status',
    ExpressionAttributeValues: {
      ':status': status
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    },
  }

  try{
    const result = await dynamoDb.
    query(params).promise();
    auctions = result.Items;
  }catch(error){
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions)
  };

}


export const handler = commonMiddleWare(getAuctions)


