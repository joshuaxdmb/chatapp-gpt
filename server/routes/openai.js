import express from 'express';
import axios from 'axios';
import { openai } from '../index.js';
import * as dotenv from 'dotenv';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { JSONLoader } from 'langchain/document_loaders/fs/json';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { RetrievalQAChain } from 'langchain/chains';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { ContextualCompressionRetriever } from 'langchain/retrievers/contextual_compression';
import { LLMChainExtractor } from 'langchain/retrievers/document_compressors/chain_extract';
import { OpenAI } from 'langchain';

dotenv.config();

const loader = new DirectoryLoader('./routes/context', {
  '.json': (path) => new JSONLoader(path),
  '.txt': (path) => new TextLoader(path),
});

const call = async (text) => {
  const docs = await loader.load();
  console.log('Docs', { docs });

  const model = new OpenAI({
    modelName: 'gpt-3.5-turbo',
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.5,
  });

  const basePrompt = ' ';
  const baseCompressor = LLMChainExtractor.fromLLM(model);
  const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
  const retriever = new ContextualCompressionRetriever({
    baseCompressor,
    baseRetriever: vectorStore.asRetriever(),
  });

  const chain = RetrievalQAChain.fromLLM(model, retriever);
  const prompt = basePrompt.concat(text);
  const res = await chain.call({
    query: prompt,
  });
  return res;
};

const router = express.Router();

router.post('/text', async (req, res) => {
  try {
    const { text, activeChatId } = req.body;
    const response = await call(text);
    // const response = await openai.createChatCompletion({
    //     model: "gpt-3.5-turbo",
    //     messages: [{"role": "system", "content": "You are a helpful assistant. Your name is Jarvis."}, {role: "user", content: text}],
    //     temperature:0.5,
    //     max_tokens:2048,
    // })
    await axios.post(
      `https://api.chatengine.io/chats/${activeChatId}/messages/`,
      {
        text: response.text, //data.choices[0].message.content
      },
      {
        headers: {
          'Project-ID': process.env.PROJECT_ID, // Fix the typo here
          'User-Name': process.env.BOT_USER_NAME,
          'User-Secret': process.env.BOT_USER_SECRET,
        },
      }
    );
    console.log('Text: ', response.text);

    res.status(200).json({ text });
  } catch (e) {
    console.error('Error', e);
    res.status(500).json({ error: e.message });
  }
});

router.post('/complete', async (req, res) => {
  try {
    const { text, activeChatId } = req.body;
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Finish my thought (do not include my prompt): ${text}`,
        },
      ],
      temperature: 0.5,
      max_tokens: 2048,
    });

    console.log(response.data.choices[0].message.content);

    res.status(200).json({ text: response.data.choices[0].message.content });
  } catch (e) {
    console.error('Error', e);
    res.status(500).json({ error: e.message });
  }
});

export default router;
