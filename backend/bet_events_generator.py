import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from cdp_langchain.agent_toolkits import CdpToolkit
from cdp_langchain.utils import CdpAgentkitWrapper
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage
from langchain_community.agent_toolkits.load_tools import load_tools
from langchain_community.utilities.tavily_search import TavilySearchAPIWrapper
from typing import List, Dict
from datetime import datetime

# Load environment variables from .env file
load_dotenv()

# Verify API key is present
if not os.getenv('OPENAI_API_KEY'):
    raise ValueError("OPENAI_API_KEY not found in environment variables")

def init_agent():
        
    # Initialize the LLM
    # if you want to support Claude, for example, you can replace this line with llm = ChatAnthropic(model="claude-3-5-sonnet-20240620"), replace the `from langchain_openai...` import with `from langchain_anthropic import ChatAnthropic`, and run in your terminal `export ANTHROPIC_API_KEY="your-api-key"
    llm = ChatOpenAI(model="gpt-4o-mini")  

    # Initialize CDP Agentkit wrapper
    cdp = CdpAgentkitWrapper()

    # Create toolkit from wrapper
    cdp_toolkit = CdpToolkit.from_cdp_agentkit_wrapper(cdp)

    # Get all available tools
    cdp_tools = cdp_toolkit.get_tools()

    # Add Tavily search to get real world news data
    search_tool = load_tools(["tavily-search"])
    all_tools = cdp_tools + search_tool

    # Create the agent
    agent_executor = create_react_agent(llm, tools=all_tools,
                                        state_modifier="You are a helpful agent that can interact with the Spicy Chiliz testnet blockchain using CDP AgentKit. You can create wallets, deploy tokens, and perform transactions.")
    return agent_executor

# Function to interact with the agent
def ask_agent(question: str, agent_executor):
    for chunk in agent_executor.stream(
        {"messages": [HumanMessage(content=question)]},
        {"configurable": {"thread_id": "my_first_agent"}}
    ):
        if "agent" in chunk:
            print(chunk["agent"]["messages"][0].content)
        elif "tools" in chunk:
            print(chunk["tools"]["messages"][0].content)
        print("-------------------")

def generate_bet_events(team_name: str, agent_executor) -> List[Dict]:
    # Construct search query for team-related betting and positive events
    search_query = f"""
    Latest news about {team_name} related to:
    - Upcoming matches or tournaments
    - Team performance and achievements
    - Player transfers or signings
    - Fan engagement opportunities
    """
    
    # Use the search tool to find relevant events
    search_prompt = f"""
    Search for recent events and news about {team_name} that could be interesting for fans to bet on.
    Focus on positive news and upcoming events. Format the response as structured data with event title,
    description, and date.
    """
    
    events = []
    try:
        # Use the agent to perform the search and process results
        response = ask_agent(search_prompt, agent_executor)
        
        # Note: You might want to process and structure the response here
        # depending on how you want to use the events data
        
        return events
        
    except Exception as e:
        print(f"Error generating bet events for {team_name}: {str(e)}")
        return []

# Example usage:
if __name__ == "__main__":
    agent = init_agent()
    team_name = "Barcelona FC"  # Example team
    events = generate_bet_events(team_name, agent)

