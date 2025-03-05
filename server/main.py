# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# from typing import List, Optional

# from dotenv import load_dotenv
# from langchain_core.messages import AIMessage, HumanMessage
# from langchain_core.prompts import ChatPromptTemplate
# from langchain_core.runnables import RunnablePassthrough
# from langchain_community.utilities import SQLDatabase
# from langchain_core.output_parsers import StrOutputParser
# from langchain_groq import ChatGroq

# # Load environment variables (including your groq api key)
# load_dotenv()

# app = FastAPI(title="Chat with MySQL API")

# # Pydantic models for request and response bodies
# class ChatMessage(BaseModel):
#     role: str  # "AI" or "Human"
#     content: str

# class ChatRequest(BaseModel):
#     host: str
#     port: str
#     user: str
#     password: str
#     database: str
#     model_name: str
#     question: str
#     chat_history: Optional[List[ChatMessage]] = None

# class ChatResponse(BaseModel):
#     response: str

# def init_database(user: str, password: str, host: str, port: str, database: str) -> SQLDatabase:
#     """
#     Initialize the database connection using provided credentials.
#     """
#     try:
#         db_uri = f"mysql+mysqlconnector://{user}:{password}@{host}:{port}/{database}"
#         return SQLDatabase.from_uri(db_uri)
#     except Exception as e:
#         raise ConnectionError(f"Could not connect to the database: {str(e)}")

# def get_sql_chain(db, model_name):
#     """
#     Create the SQL chain that takes the conversation context and
#     generates an SQL query using the prompt engineering approach.
#     """
#     try:
#         template = """
#             You are a data analyst at a company. You are interacting with a user who is asking you questions about the company's database.
#             Based on the table schema below, write a SQL query that would answer the user's question. Take the conversation history into account.
            
#             <SCHEMA>{schema}</SCHEMA>
            
#             Conversation History: {chat_history}
            
#             Write only the SQL query and nothing else. Do not wrap the SQL query in any other text, not even backticks.
            
#             For example:
#             Question: which 3 artists have the most tracks?
#             SQL Query: SELECT ArtistId, COUNT(*) as track_count FROM Track GROUP BY ArtistId ORDER BY track_count DESC LIMIT 3;
#             Question: Name 10 artists
#             SQL Query: SELECT Name FROM Artist LIMIT 10;
            
#             Your turn:
            
#             Question: {question}
#             SQL Query:
#         """
#         prompt = ChatPromptTemplate.from_template(template)
#         llm = ChatGroq(model=model_name, temperature=0)
        
#         def get_schema(_):
#             return db.get_table_info()
        
#         return (
#             RunnablePassthrough.assign(schema=get_schema)
#             | prompt
#             | llm
#             | StrOutputParser()
#         )
#     except Exception as e:
#         raise RuntimeError(f"Error initializing the SQL chain: {str(e)}")

# def get_response(user_query: str, db: SQLDatabase, chat_history, model_name: str):
#     """
#     Generate a natural language response based on the SQL query and its result,
#     while considering the conversation history.
#     """
#     try:
#         sql_chain = get_sql_chain(db, model_name)
        
#         template = """
#             You are a data analyst at a company. You are interacting with a user who is asking you questions about the company's database.
#             Based on the table schema below, question, sql query, and sql response, write a natural language response.
#             <SCHEMA>{schema}</SCHEMA>

#             Conversation History: {chat_history}
#             SQL Query: <SQL>{query}</SQL>
#             User question: {question}
#             SQL Response: {response}"""
        
#         prompt = ChatPromptTemplate.from_template(template)
#         llm = ChatGroq(model=model_name, temperature=0)
        
#         chain = (
#             RunnablePassthrough.assign(query=sql_chain).assign(
#                 schema=lambda _: db.get_table_info(),
#                 response=lambda vars: db.run(vars["query"]),
#             )
#             | prompt
#             | llm
#             | StrOutputParser()
#         )
        
#         return chain.invoke({
#             "question": user_query,
#             "chat_history": chat_history,
#         })
    
#     except ConnectionError as db_error:
#         return f"""
#         Oops! An error occurred while connecting to the database:

#         **Error:** {str(db_error)}
        
#         Please check your database credentials and try again.
#         """
#     except ValueError as api_key_error:
#         return f"""
#         Oops! An error occurred while connecting to the LLM API:

#         **Error:** {str(api_key_error)}

#         Ensure that your API key is set in the environment variables or provided as a parameter.
#         """
#     except Exception as e:
#         return f"""
#         Oops! An unexpected error occurred:

#         **Error:** {str(e)}
        
#         Please contact support or try again later.
#         """

# @app.post("/chat", response_model=ChatResponse)
# def chat_endpoint(request: ChatRequest):
#     """
#     API endpoint that receives the database credentials, model name, user question,
#     and chat history, then returns the assistant's response.
#     """
#     # Convert the provided chat_history into langchain message objects.
#     if request.chat_history is None:
#         # Initialize with a default AI message if no history is provided.
#         chat_history_converted = [
#             AIMessage(content="Hello! I'm a SQL assistant. Ask me anything about your database.")
#         ]
#     else:
#         chat_history_converted = []
#         for msg in request.chat_history:
#             if msg.role.lower() == "ai":
#                 chat_history_converted.append(AIMessage(content=msg.content))
#             else:
#                 chat_history_converted.append(HumanMessage(content=msg.content))
    
#     # Initialize the database connection using credentials from the request.
#     try:
#         db = init_database(
#             request.user,
#             request.password,
#             request.host,
#             request.port,
#             request.database
#         )
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=f"Database connection failed: {str(e)}")
    
#     # Generate the response using the provided question and conversation history.
#     response_text = get_response(request.question, db, chat_history_converted, request.model_name)
    
#     return ChatResponse(response=response_text)

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)



























from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from dotenv import load_dotenv
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_community.utilities import SQLDatabase
from langchain_core.output_parsers import StrOutputParser
from langchain_groq import ChatGroq

# Load environment variables (including your Groq API key)
load_dotenv()

app = FastAPI(title="Chat with MySQL API")

# Enable CORS for requests coming from your React app (http://localhost:3000)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust this list as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request and response bodies
class ChatMessage(BaseModel):
    role: str  # "AI" or "Human"
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
    """
    Initialize the database connection using provided credentials.
    """
    try:
        db_uri = f"mysql+mysqlconnector://{user}:{password}@{host}:{port}/{database}"
        return SQLDatabase.from_uri(db_uri)
    except Exception as e:
        raise ConnectionError(f"Could not connect to the database: {str(e)}")

def get_sql_chain(db, model_name):
    """
    Create the SQL chain that takes the conversation context and
    generates an SQL query using the prompt engineering approach.
    """
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
        raise RuntimeError(f"Error initializing the SQL chain: {str(e)}")

def get_response(user_query: str, db: SQLDatabase, chat_history, model_name: str):
    """
    Generate a natural language response based on the SQL query and its result,
    while considering the conversation history.
    """
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
        return f"""
        Oops! An error occurred while connecting to the database:

        **Error:** {str(db_error)}
        
        Please check your database credentials and try again.
        """
    except ValueError as api_key_error:
        return f"""
        Oops! An error occurred while connecting to the LLM API:

        **Error:** {str(api_key_error)}

        Ensure that your API key is set in the environment variables or provided as a parameter.
        """
    except Exception as e:
        return f"""
        Oops! An unexpected error occurred:

        **Error:** {str(e)}
        
        Please contact support or try again later.
        """

@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    """
    API endpoint that receives the database credentials, model name, user question,
    and chat history, then returns the assistant's response.
    """
    # Convert the provided chat_history into langchain message objects.
    if request.chat_history is None:
        # Initialize with a default AI message if no history is provided.
        chat_history_converted = [
            AIMessage(content="Hello! I'm a SQL assistant. Ask me anything about your database.")
        ]
    else:
        chat_history_converted = []
        for msg in request.chat_history:
            if msg.role.lower() == "ai":
                chat_history_converted.append(AIMessage(content=msg.content))
            else:
                chat_history_converted.append(HumanMessage(content=msg.content))
    
    # Initialize the database connection using credentials from the request.
    try:
        db = init_database(
            request.user,
            request.password,
            request.host,
            request.port,
            request.database
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Database connection failed: {str(e)}")
    
    # Generate the response using the provided question and conversation history.
    response_text = get_response(request.question, db, chat_history_converted, request.model_name)
    
    return ChatResponse(response=response_text)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
