import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
const dynamoDB = new DynamoDBClient;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

exports.handler = async (event) => {

    const { userId } = event.identity.claims;
    const { title, text } = event.arguments.input;

    const tableName = process.env.STORAGE_Notesjwmvhzzwkbf7djbiu327z2gqoestaging;

    
};
