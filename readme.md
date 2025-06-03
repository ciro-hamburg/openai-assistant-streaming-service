# OpenAI Assistant Streaming Service - Media Planner Example

A Node.js service demonstrating how to create an intelligent **Media Planner Assistant** using OpenAI's Assistant API with real-time streaming responses. This example shows how to build an AI-powered LinkedIn advertising campaign planner that leverages vector stores for contextual targeting recommendations.

🔗 **Live Demo**: [https://github.com/ciro-hamburg/openai-assistant-streaming-service](https://github.com/ciro-hamburg/openai-assistant-streaming-service)

## 🎯 What This Demonstrates

This project showcases how to:
- **Stream OpenAI Assistant responses** in real-time using Server-Sent Events (SSE)
- **Integrate vector stores** with OpenAI Assistants for context-aware responses
- **Build domain-specific AI assistants** (Media Planning use case)
- **Create interactive web interfaces** for AI assistant interactions

## 🧠 The Media Planner Assistant

This example creates an AI assistant that specializes in LinkedIn advertising campaign planning. The assistant analyzes campaign requests and provides detailed targeting recommendations using stored LinkedIn targeting attributes.

### System Instructions Used:
```
Plan LinkedIn advertising campaigns using JSON files containing LinkedIn targeting attributes (job_titles, skills, staffCountCategories, growthRateCategories, revenueCategories, industries, ageRange, yearsOfExperience, memberBehaviour, interest, jobFunctions, and seniorities). 

Analyze the user's campaign request to identify key themes such as industry, job roles, professional interests, seniority levels, company size, and growth stage.

Match relevant targeting options from the stored attributes, ensuring alignment with campaign goals. Assess available targeting categories, including job functions, industries, and audience interests, to refine the strategy. 

Provide detailed recommendations, specifying targeting attributes such as job titles, skills, company growth rate, or revenue where applicable.

Break down the plan by campaign objective (e.g., brand awareness, lead generation, engagement) and suggest audience targeting strategies accordingly. Ensure recommendations are actionable and specific, making them directly applicable to LinkedIn Ads campaign setup. 

Summarize the strategy in a structured format, ready for implementation. No annotations.
```

## 🏗️ Technical Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Frontend  │────│  Express Server │────│ OpenAI Assistant│
│   (HTML/JS)     │    │   (Node.js)     │    │   + Vector Store│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │ 1. Create Thread      │ 2. API Call           │
         │ 2. Stream Response    │ 3. Stream Back        │
         │                       │                       │
         └───────── SSE ─────────┘                       │
                                                         │
                                 ┌─────────────────────┐ │
                                 │ LinkedIn Targeting  │ │
                                 │ Data (Vector Store) │─┘
                                 └─────────────────────┘
```

### Core Components:

1. **OpenAI Assistant Service** (`openAIAssistantService.js`)
   - Manages thread creation and streaming in one unified flow
   - Handles OpenAI API integration with simplified response structure
   - Processes Server-Sent Events with real-time streaming
   - Uses OpenAI's native streaming capabilities for optimal performance

2. **Express Server** (`server.js`)
   - Serves the frontend application
   - Provides REST endpoints for thread management
   - Streams assistant responses via SSE

3. **Web Interface** (`public/index.html`)
   - Clean, responsive UI for assistant interaction
   - Real-time response streaming with visual feedback
   - Status indicators and comprehensive error handling
   - Interactive features including typing indicators and keyboard shortcuts

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14 or later)
- **OpenAI API Key** with Assistant API access
- **Assistant ID** (created in OpenAI platform)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ciro-hamburg/openai-assistant-streaming-service.git
   cd openai-assistant-streaming-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Edit .env file
   OPENAI_API_KEY=your-openai-api-key-here
   PORT=3000
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🔧 Setting Up Your Media Planner Assistant

### Step 1: Create an OpenAI Assistant

1. Go to [OpenAI Platform Assistants](https://platform.openai.com/assistants)
2. Click "Create Assistant"
3. **Name**: "LinkedIn Media Planner"
4. **Instructions**: Use the system prompt provided above
5. **Enable Tools**: Check "File Search"
6. **Model**: Choose GPT-4 or GPT-4 Turbo

### Step 2: Create and Upload Vector Store

1. **Create a Vector Store** in the OpenAI platform
2. **Prepare your targeting data** as JSON files:
   ```json
   {
     "job_titles": ["Marketing Manager", "Digital Marketing Specialist", "Growth Manager"],
     "skills": ["Digital Marketing", "Lead Generation", "Marketing Automation"],
     "industries": ["Software", "Technology", "SaaS"],
     "staffCountCategories": ["51-200", "201-500", "501-1000"],
     "growthRateCategories": ["High Growth", "Medium Growth"],
     "revenueCategories": ["$1M-$10M", "$10M-$50M"],
     "jobFunctions": ["Marketing", "Sales", "Business Development"],
     "seniorities": ["Mid-level", "Senior", "Director"]
   }
   ```

3. **Upload targeting files** to your vector store
4. **Link the vector store** to your assistant

### Step 3: Test Your Assistant

Use the web interface to test with prompts like:
> "I want to run a LinkedIn Ads campaign targeting mid-level marketing professionals in the tech industry for a SaaS product focused on AI-powered marketing automation."

## 📡 API Endpoints

### POST `/create-thread`
Creates a new conversation thread with the assistant and immediately prepares it for streaming.

**Request Body:**
```json
{
  "assistantId": "asst_your_assistant_id",
  "message": "Your campaign planning request"
}
```

**Response:**
```json
{
  "threadId": "thread_abc123"
}
```

### GET `/stream-message/:threadId`
Streams the assistant's response using Server-Sent Events. This endpoint creates a run and immediately starts streaming the response.

**Query Parameters:**
- `assistantId`: Your OpenAI assistant ID

**Response:** SSE stream with real-time assistant output

**Events:**
- `textCreated`: Fired when the assistant starts responding
- `message`: Contains streamed text chunks
- `done`: Fired when streaming is complete
- `error`: Fired if an error occurs

## 🛠️ Development

### Project Structure
```
openai-streaming-service/
├── server.js                 # Express server and routing
├── openAIAssistantService.js # OpenAI API integration
├── package.json              # Dependencies and scripts
├── .env                      # Environment variables
├── .gitignore               # Git ignore rules
└── public/
    └── index.html           # Frontend interface
```

### Key Technologies
- **Backend**: Node.js, Express.js
- **AI Integration**: OpenAI Assistant API with native streaming
- **Frontend**: Vanilla HTML/CSS/JavaScript with SSE integration
- **Streaming**: Server-Sent Events (SSE) with real-time response handling
- **Environment**: dotenv for configuration management

### Recent Updates (Latest Commit)
- **Simplified API Response**: Removed `runId` from response structure - now returns only `threadId`
- **Streamlined Service**: Refactored `OpenAIAssistantService` to create and stream in one unified operation
- **Enhanced UX**: Improved frontend with better status indicators, typing indicators, and keyboard shortcuts
- **Error Handling**: More robust error handling and connection management

## 🎨 Customization

### Adapting for Other Use Cases

This architecture can be adapted for various domain-specific assistants:

1. **Legal Document Assistant**: Upload legal templates and statutes
2. **Code Review Assistant**: Include coding standards and best practices
3. **Customer Support Assistant**: Upload product documentation and FAQs
4. **Content Strategy Assistant**: Include brand guidelines and content templates

### Modifying the System Prompt

Update the assistant instructions in the OpenAI platform directly. The service automatically uses the instructions configured for your assistant:

1. Go to [OpenAI Platform Assistants](https://platform.openai.com/assistants)
2. Select your assistant
3. Update the "Instructions" field with your custom prompt
4. Save changes - no code changes needed!

## 🔒 Security Considerations

- ✅ API keys stored in environment variables
- ✅ `.env` file excluded from git
- ✅ Input validation on API endpoints
- ✅ Error handling for failed requests

## 📚 Learn More

- [OpenAI Assistant API Documentation](https://platform.openai.com/docs/assistants/overview)
- [Vector Stores Guide](https://platform.openai.com/docs/assistants/tools/file-search)
- [Server-Sent Events (SSE)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

**💡 Pro Tip**: This example demonstrates the power of combining OpenAI Assistants with vector stores for domain-specific AI applications. The same pattern can be applied to create specialized assistants for various industries and use cases.
