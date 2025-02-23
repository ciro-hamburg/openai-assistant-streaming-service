# OpenAI Assistant Streaming Service

This project demonstrates how to create an OpenAI Assistant thread, run it using a streaming API, and then stream the assistant’s response to the client using Server-Sent Events (SSE).

> **Example Message:**  
> "I want to run a LinkedIn Ads campaign targeting mid-level marketing professionals in the tech industry. The goal is to generate leads for a SaaS product focused on AI-powered marketing automation. The ideal audience should have experience in digital marketing, growth strategies, or demand generation. The companies should be mid-to-large-sized, preferably experiencing high growth. What targeting options should I use?"

## Prerequisites

- **Node.js** (version 14 or later)
- An **OpenAI API key** with access to the Assistants API.
- An **assistant ID** (this is not a secret key but an identifier for your OpenAI assistant).

## Setup

1. **Clone the Repository** (or create your project folder) and navigate into it:

   ```sh
   git clone https://github.com/yourusername/openai-streaming-service.git
   cd openai-streaming-service
   ```

2. **Install Dependencies:**

   ```sh
   npm install
   ```

3. **Environment Configuration:**

   Create a `.env` file in the project root and add your OpenAI API key. (Since the assistant ID is passed dynamically from the frontend, it is not stored in the environment.)

   ```ini
   OPENAI_API_KEY=your-openai-api-key
   ```

## Code Overview

- **openAIAssistantService.js:**  
  Contains methods to:
  - Create a thread with a user message.
  - Start a run (using the assistant ID passed in) and stream the assistant’s response.
- **server.js:**  
  An Express server that exposes endpoints to:
  - Create a thread and run the assistant.
  - Stream the assistant's response using SSE.

## How to Start the Server

1. Open a terminal in your project folder.
2. Run the server using Node.js:
   ```sh
   node server.js
   ```
   You should see a message in the terminal:
   ```
   Initializing OpenAI Service...
   Server running on port 3000
   ```

## How to Create a Thread

Use the following `curl` command (or use Postman) to create a thread. Make sure to replace `your-assistant-id` with the actual assistant identifier.

```sh
curl -X POST http://localhost:3000/create-thread \
-H "Content-Type: application/json" \
-d '{
  "assistantId": "your-assistant-id",
  "message": "I want to run a LinkedIn Ads campaign targeting mid-level marketing professionals in the tech industry. The goal is to generate leads for a SaaS product focused on AI-powered marketing automation. The ideal audience should have experience in digital marketing, growth strategies, or demand generation. The companies should be mid-to-large-sized, preferably experiencing high growth. What targeting options should I use?"
}'
```

### Expected Response

You will receive a JSON response containing the thread ID (and run ID):

```json
{
  "threadId": "thread_xyz",
  "runId": "run_abc"
}
```

## How to Stream the Message

The streaming endpoint uses Server-Sent Events (SSE) to deliver the assistant’s response in real time.

1. Open another terminal (or use a browser that supports SSE).
2. Use the following `curl` command, ensuring you pass the `assistantId` as a query parameter:
   ```sh
   curl -N "http://localhost:3000/stream-message/thread_xyz?assistantId=your-assistant-id"
   ```
   Replace `thread_xyz` with the thread ID you received earlier and `your-assistant-id` with your assistant's ID.

### What to Expect

As the assistant processes the request, you will see output similar to the following:

```
event: textCreated
data: Assistant started responding

data: [Assistant’s streamed response content here...]

event: done
data: END
```

The response will be streamed in real time, allowing you to see the assistant’s output as it is generated.

---

## Summary

1. **Start the Server:**  
   Run `node server.js` in your project folder.

2. **Create a Thread:**  
   Use the provided POST endpoint with your desired message to create a thread and start a run.

3. **Stream the Message:**  
   Access the `/stream-message/:threadId` endpoint with the `assistantId` provided as a query parameter to receive the streaming response.

This documentation should help you get started and test the functionality of your OpenAI Assistant streaming service. If you have any further questions or need additional assistance, feel free to ask!
