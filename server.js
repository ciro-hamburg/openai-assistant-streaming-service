const express = require("express");
const OpenAIAssistantService = require("./openAIAssistantService");
require("dotenv").config();

const app = express();
app.use(express.json());

app.post("/create-thread", async (req, res) => {
  try {
    const { assistantId, message } = req.body;
    const result = await OpenAIAssistantService.createAndRunThread(
      assistantId,
      message
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Example: Passing assistantId as a query parameter
app.get("/stream-message/:threadId", (req, res) => {
  const { threadId } = req.params;
  const assistantId = req.query.assistantId; // provided by the FE
  OpenAIAssistantService.streamMessages(threadId, assistantId, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
