//IMPORTANT NOTE : Your API keys are configured in one of the following files :
//  .smyth/.sre/vault.json
//  ~/.smyth/.sre/vault.json

//Edit the vault.json file to update your API keys

import BookAssistantAgent from './agents/BookAssistant.agent';
import { runChat } from './utils/TerminalChat';

//In this example we are directly starting with the Book Assistant
//You can modify this to add back the agent selection menu if needed

const main = async () => {
    console.log('Starting Book Assistant...');
    
    //Use the Book Assistant agent
    const agent = BookAssistantAgent;

    //Create a chat object from the agent
    //this is used to identify the chat session, using the same ID will load the previous chat session
    const sessionId = `my-chat-session-book-assistant`;
    const chat = agent.chat({
        id: sessionId,
        persist: true,
    });

    //Run the chat session in the terminal
    runChat(chat);
};

main();

//Below you can find other ways to interact with the agent

//1. call a skill directly
// const result = await BookAssistantAgent.call('get_book_info', {
//     book_name: 'The Black Swan',
// });
// console.log(result);

//2. prompt
//const result = await BookAssistantAgent.prompt('Who is the author of the book "The Black Swan"?');
//console.log(result);

//3. prompt and stream response
// const stream = await BookAssistantAgent.prompt('Who is the author of the book "The Black Swan"?').stream();
// stream.on(TLLMEvent.Content, (content) => {
//     console.log(content);
// });
