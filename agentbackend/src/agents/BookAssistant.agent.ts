import { Agent, Doc, Model, VectorDB } from '@smythos/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

/**
 * This is an example of a simple agent where the skills are implemented programmatically
 *
 */

const __dirname = process.cwd();
const BOOKS_NAMESPACE = 'books';

//#region [ Agent Instance] ===================================

//We create the agent instance
const agent = new Agent({
    id: 'book-assistant', //<=== agent id is important for data isolation in vector DBs and Storage

    //the name of the agent, this is how the agent will identify itself
    name: 'Book Assistant',

    //here we are using a builtin model
    //note that we are not passing an apiKey because we will rely on smyth vault for the model credentials
    model: 'gemini-2.0-flash',

    //the behavior of the agent, this describes the personnality and behavior of the agent
    behavior: `You are a helpful assistant that can answer questions about books. 

IMPORTANT RULES:
1. When a skill execution completes successfully, ALWAYS provide a final response to the user
2. NEVER call the same skill multiple times in a row
3. If a skill returns a success message, acknowledge it and respond to the user immediately
4. Do not retry skills that have already executed successfully

Available skills:
- index_book: Index a PDF book into the vector database
- lookup_book: Search for content in indexed books  
- purge_books: Remove all indexed books (use carefully!)
- get_book_info: Get book information from OpenLibrary

Always be concise and helpful in your responses.`,
});

//We create a Pinecone vectorDB instance, at the agent scope
//Pinecone is a production-ready vector database for remote storage
const pinecone = agent.vectorDB.Pinecone(BOOKS_NAMESPACE, {
    indexName: 'ilts',
    apiKey: process.env.PINECONE_API_KEY,
    embeddings: Model.GoogleAI('gemini-embedding-001'),
});

//#endregion

//#region [ Skills ] ===================================

//Index a book in Pinecone vector database
agent.addSkill({
    name: 'index_book',
    description: 'Use this skill to index a book in a vector database. The user will provide the path to the book (e.g., "data/bitcoin.pdf" or "agentbackend/data/bitcoin.pdf")',
    process: async ({ book_path }) => {
        try {
            console.log(`[DEBUG] Attempting to index book: ${book_path}`);
            console.log(`[DEBUG] Using index name: ilts`);
            
            // Handle both relative and absolute paths, and clean up duplicated directory names
            let filePath;
            if (path.isAbsolute(book_path)) {
                filePath = book_path;
            } else {
                // Remove leading 'agentbackend/' if present since we're already in that directory
                const cleanPath = book_path.replace(/^agentbackend\//, '');
                filePath = path.resolve(__dirname, cleanPath);
            }
            
            console.log(`[DEBUG] Resolved file path: ${filePath}`);
            
            if (!fs.existsSync(filePath)) {
                const errorMsg = `File resolved path to ${filePath} does not exist`;
                console.log(`[ERROR] ${errorMsg}`);
                return errorMsg;
            }

            console.log(`[DEBUG] Parsing document...`);
            const parsedDoc = await Doc.pdf.parse(filePath);
            console.log(`[DEBUG] Document parsed successfully`);

            const name = path.basename(filePath);
            console.log(`[DEBUG] Inserting document ${name} into Pinecone vector DB...`);
            console.log(`[DEBUG] Document will be inserted with namespace: ${BOOKS_NAMESPACE}`);
            
            // Test Pinecone connection first
            try {
                console.log(`[DEBUG] Testing Pinecone connection...`);
                const testResult = await pinecone.search('test', { topK: 1 });
                console.log(`[DEBUG] Pinecone connection successful`);
            } catch (connError) {
                console.log(`[ERROR] Pinecone connection failed:`, connError.message);
                return `Pinecone connection failed: ${connError.message}`;
            }
            
            const result = await pinecone.insertDoc(name, parsedDoc, { 
                fileName: name, 
                indexedAt: new Date().toISOString(),
                namespace: BOOKS_NAMESPACE 
            });
            console.log(`[DEBUG] Insert result:`, result);

            if (result) {
                const successMsg = `Book ${name} indexed successfully in Pinecone`;
                console.log(`[SUCCESS] ${successMsg}`);
                
                // Verify the insertion by searching
                console.log(`[DEBUG] Verifying insertion by searching...`);
                const verifyResult = await pinecone.search('test', { topK: 1 });
                console.log(`[DEBUG] Verification search result:`, verifyResult);
                
                return successMsg;
            } else {
                const failMsg = `Book ${name} indexing failed - no result returned`;
                console.log(`[ERROR] ${failMsg}`);
                return failMsg;
            }
        } catch (error) {
            const errorMsg = `Error indexing book: ${error.message}`;
            console.error(`[ERROR] ${errorMsg}`, error);
            console.error(`[ERROR] Stack trace:`, error.stack);
            return errorMsg;
        }
    },
});

//Lookup a book in Pinecone vector database
agent.addSkill({
    name: 'lookup_book',
    description: 'Use this skill ONCE to lookup content in the Pinecone vector database. Do not call this skill multiple times for the same query.',
    process: async ({ user_query }) => {
        try {
            console.log(`[DEBUG] Searching for: "${user_query}"`);
            
            const result = await pinecone.search(user_query, {
                topK: 3,
            });
            
            console.log(`[DEBUG] Search completed. Found ${result?.length || 0} results`);
            
            if (!result || result.length === 0) {
                return "❌ No relevant content found in the indexed books. Please make sure books are indexed first using the 'index_book' skill.";
            }
            
            // Simple approach - just return the first result's text
            const firstResult = result[0];
            const text = firstResult.text || firstResult.content || firstResult.pageContent || 'No text found in result';
            const source = firstResult.metadata?.fileName || firstResult.metadata?.datasourceLabel || 'Bitcoin PDF';
            
            console.log(`[DEBUG] Extracted text length:`, text.length);
            
            const response = `✅ Found content from ${source}:\n\n${text}`;
            console.log(`[DEBUG] Returning response successfully`);
            
            return response;
            
        } catch (error) {
            const errorMsg = `❌ Error searching books: ${error.message}`;
            console.error(`[ERROR] ${errorMsg}`, error);
            return errorMsg;
        }
    },
});

//Purge all data from Pinecone vector database (useful for testing)
const purgeSkill = agent.addSkill({
    name: 'purge_books',
    description: 'Use this skill to remove all indexed books from the vector database. WARNING: This will delete all data! Only call this once per user request.',
    process: async (params) => {
        try {
            console.log(`[DEBUG] Purging all data from Pinecone...`);
            console.log(`[DEBUG] Skill called with params:`, params);
            
            await pinecone.purge();
            
            const successMsg = `All books have been successfully deleted from the vector database. The database is now completely empty.`;
            console.log(`[SUCCESS] ${successMsg}`);
            
            return successMsg;
            
        } catch (error) {
            const errorMsg = `Failed to delete books from database: ${error.message}`;
            console.error(`[ERROR] ${errorMsg}`, error);
            return errorMsg;
        }
    },
});

// Add explicit input validation to prevent retries
purgeSkill.in({
    confirmation: {
        description: 'Set to "yes" to confirm deletion of all books',
        optional: true
    }
});

//Openlibrary lookup : this is a simple skill that uses the openlibrary API to get information about a book
const openlibraryLookupSkill = agent.addSkill({
    name: 'get_book_info',
    description: 'Use this skill to get information about a book',
    process: async ({ book_name }) => {
        const url = `https://openlibrary.org/search.json?q=${book_name}`;

        const response = await fetch(url);
        const data = await response.json();

        return data.docs[0];
    },
});

//The skill that we just created requires a book_name input,
// sometime the agent LLM will need a description or more details about the input in order to use it properly
//below we add a description to the book_name input in order to tell the LLM how to use it
openlibraryLookupSkill.in({
    book_name: {
        description: 'This need to be a name of a book, extract it from the user query',
    },
});

//#endregion

export default agent;
