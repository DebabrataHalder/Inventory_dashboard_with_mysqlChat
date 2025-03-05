from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_community.utilities import SQLDatabase
from langchain_core.output_parsers import StrOutputParser
from langchain_groq import ChatGroq

# Load environment variables
load_dotenv()

app = FastAPI(title="Chat with MySQL API")

# Configure CORS using environment variables
from fastapi.middleware.cors import CORSMiddleware

allowed_origins = os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    host: str
    port: str
    user: str
    password: str
    database: str
    model_name: str
    question: str
    chat_history: Optional[List[ChatMessage]] = None

class ChatResponse(BaseModel):
    response: str

def init_database(user: str, password: str, host: str, port: str, database: str) -> SQLDatabase:
    try:
        db_uri = f"mysql+mysqlconnector://{user}:{password}@{host}:{port}/{database}"
        return SQLDatabase.from_uri(db_uri)
    except Exception as e:
        raise ConnectionError(f"Database connection error: {str(e)}")

def get_sql_chain(db, model_name):
    try:
        template = """
            You are a data analyst at a company. You are interacting with a user who is asking you questions about the company's database.
            Based on the table schema below, write a SQL query that would answer the user's question. Take the conversation history into account.
            
            <SCHEMA>{schema}</SCHEMA>
            
            Conversation History: {chat_history}
            
            Write only the SQL query and nothing else. Do not wrap the SQL query in any other text, not even backticks.
            
            For example:
            Question: which 3 artists have the most tracks?
            SQL Query: SELECT ArtistId, COUNT(*) as track_count FROM Track GROUP BY ArtistId ORDER BY track_count DESC LIMIT 3;
            Question: Name 10 artists
            SQL Query: SELECT Name FROM Artist LIMIT 10;
            
            Your turn:
            
            Question: {question}
            SQL Query:
        """
        prompt = ChatPromptTemplate.from_template(template)
        llm = ChatGroq(model=model_name, temperature=0)
        
        def get_schema(_):
            return db.get_table_info()
        
        return (
            RunnablePassthrough.assign(schema=get_schema)
            | prompt
            | llm
            | StrOutputParser()
        )
    except Exception as e:
        raise RuntimeError(f"SQL chain error: {str(e)}")

def get_response(user_query: str, db: SQLDatabase, chat_history, model_name: str):
    try:
        sql_chain = get_sql_chain(db, model_name)
        
        template = """
            You are a data analyst at a company. You are interacting with a user who is asking you questions about the company's database.
            Based on the table schema below, question, sql query, and sql response, write a natural language response.
            <SCHEMA>{schema}</SCHEMA>

            Conversation History: {chat_history}
            SQL Query: <SQL>{query}</SQL>
            User question: {question}
            SQL Response: {response}"""
        
        prompt = ChatPromptTemplate.from_template(template)
        llm = ChatGroq(model=model_name, temperature=0)
        
        chain = (
            RunnablePassthrough.assign(query=sql_chain).assign(
                schema=lambda _: db.get_table_info(),
                response=lambda vars: db.run(vars["query"]),
            )
            | prompt
            | llm
            | StrOutputParser()
        )
        
        return chain.invoke({
            "question": user_query,
            "chat_history": chat_history,
        })
    
    except ConnectionError as db_error:
        return f"Database error: {str(db_error)}"
    except ValueError as api_key_error:
        return f"API key error: {str(api_key_error)}"
    except Exception as e:
        return f"Unexpected error: {str(e)}"

@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    # Convert chat history
    chat_history_converted = [
        AIMessage(content="Hello! I'm a SQL assistant. Ask me anything about your database.")
    ] if not request.chat_history else [
        AIMessage(content=msg.content) if msg.role.lower() == "ai" 
        else HumanMessage(content=msg.content) 
        for msg in request.chat_history
    ]
    
    # Initialize database
    try:
        db = init_database(
            request.user,
            request.password,
            request.host,
            request.port,
            request.database
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    # Generate response
    response_text = get_response(request.question, db, chat_history_converted, request.model_name)
    
    return ChatResponse(response=response_text)

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
