import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
const dynamoDB = new DynamoDBClient;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    const { userId } = event.identity.claims; // This is the authenticated user ID (owner)
    const { title, text } = event.arguments.input;

    const tableName = process.env.STORAGE_Notesjwmvhzzwkbf7djbiu327z2gqoestaging_NAME;

    // Check the notes limit for the owner.
    try{

        const params = {
            TableName: tableName,
            IndexName: "byOwner",
            KeyConditionExpression: "owner = :owner",
            ExpressionAttributeValues: {
               ":owner" : userId
            }
        }

        const data = await dynamoDB.query(params).promise();

        // If the limit is greater than 5, throw exception.
        if (data.Items.length >= 5) {
            throw new Error('Limit exceeded: You can only create up to 5 notes.');
        }
        else { // Limit is not exceeded, we can create a new note entry.
            const noteId = `note-${Date.now()}`; 

            const newNote = {
                id: noteId,
                owner: userId,
                title: title,
                text: text,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
    
            const putParams = {
                TableName: tableName,
                Item: newNote
            };
    
            await dynamoDB.put(putParams).promise();
    
            return newNote;
        }


    }

    catch(error){

        console.error("Error creating note: ", error);
        throw new Error(error.message);

    }
};
