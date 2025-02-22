require("dotenv").config();
const { OpenAI } = require("openai");

class OpenAIAssistantService {
  constructor() {
    console.log("Initializing OpenAI Service...");
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async createAndRunThread(assistantId, userMessage) {
    try {
      console.log(`📢 Creating assistant thread with message: ${userMessage}`);

      const thread = await this.openai.beta.threads.create({
        messages: [{ role: "user", content: userMessage }],
      });

      console.log(`✅ Thread Created: ${thread.id}`);

      // Use OpenAI's streaming run helper
      const run = await this.openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistantId,
      });

      console.log(`✅ Run Started: ${run.id} (Status: ${run.status})`);
      return { threadId: thread.id, runId: run.id };
    } catch (error) {
      console.error("❌ Error creating thread:", error);
      throw error;
    }
  }

  async streamMessages(threadId, runId, res) {
    try {
      console.log(
        `📢 Streaming messages for Thread: ${threadId}, Run: ${runId}`
      );

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      // Retrieve assistant_id from environment (or you could pass it in)
      const assistantId = process.env.ASSISTANT_ID;

      // Build the stream options; note we remove run_id as it's not supported.
      const streamOptions = { assistant_id: assistantId };

      // Call the streaming endpoint (runId is not passed as an option)
      const stream = this.openai.beta.threads.runs.stream(
        threadId,
        streamOptions
      );

      stream
        .on("textCreated", () => {
          console.log("Assistant started responding...");
          res.write(
            "event: textCreated\ndata: Assistant started responding\n\n"
          );
        })
        .on("textDelta", (textDelta) => {
          console.log("Streaming text:", textDelta.value);
          res.write(`data: ${textDelta.value}\n\n`);
        })
        .on("end", () => {
          console.log("✅ Streaming finished.");
          res.write("event: done\ndata: END\n\n");
          res.end();
        })
        .on("error", (error) => {
          console.error("❌ Streaming error:", error);
          res.write("event: error\ndata: Streaming failed\n\n");
          res.end();
        });
    } catch (error) {
      console.error("❌ Error in streaming:", error);
      res.write("event: error\ndata: Streaming failed\n\n");
      res.end();
    }
  }
}

module.exports = new OpenAIAssistantService();
