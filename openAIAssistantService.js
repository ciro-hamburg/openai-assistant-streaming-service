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
      return { threadId: thread.id };
    } catch (error) {
      console.error("❌ Error creating thread:", error);
      throw error;
    }
  }

  async streamMessages(threadId, assistantId, res) {
    try {
      console.log(
        `📢 Starting streaming run for Thread: ${threadId} using assistantId: ${assistantId}`
      );

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      // Create and stream the run in one step
      const stream = this.openai.beta.threads.runs.stream(threadId, {
        assistant_id: assistantId,
      });

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
