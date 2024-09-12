const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');

const dynamoDB = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(dynamoDB);

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log("Event: ", JSON.stringify(event, null, 2)); // Look at what exactly is going on with event.json

    const { sub: userId } = event.identity.claims; // This is the authenticated user ID (owner)
    console.log(userId); // troubleshooting

    const { title, text } = event.arguments.input;
    console.log({title, text}); // troubleshooting

    const tableName = "Notes-jwmvhzzwkbf7djbiu327z2gqoe-staging";

    // Check the notes limit for the owner.
    try{

        const params = {
            TableName: tableName,
            IndexName: "byOwner",
            KeyConditionExpression: "#owner = :owner",
            ExpressionAttributeNames: {
                "#owner": "owner" // Replace the reserved keyword with an alias or else it will throw an InvalidKeyConditionException.
            },
            ExpressionAttributeValues: {
                ":owner": userId
            }
        }

        const data = await ddbDocClient.send(new QueryCommand(params));

        console.log(data); // Troubleshooting

        const existingNotes = (data.Items).filter(note => note._deleted != true);

        console.log(existingNotes);

        // If the limit is greater than 5, throw exception.
        if (existingNotes.length >= 5) {
            throw new Error('Limit exceeded: You can only create up to 5 notes.');
        }
        else { // Limit is not exceeded, we can create a new note entry.
            const noteId = `notes-${Date.now()}`; 

            const newNote = {
                id: noteId,
                owner: userId,
                title: title,
                text: text,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                _version: 1, // Set _version to 1 for the initial creation
                _lastChangedAt: Date.now(), // Set the current timestamp
                _deleted: false, // Set to false since it's not deleted
                __typename: "Notes"
            };
    
            const putParams = {
                TableName: tableName,
                Item: newNote
            };
    
            await ddbDocClient.send(new PutCommand(putParams));
    
            return newNote;
        }


    }

    catch(error){

        console.error("Error creating note: ", error);
        throw new Error(error.message);

    }
};
