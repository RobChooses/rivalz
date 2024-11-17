import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from cdp_langchain.agent_toolkits import CdpToolkit
from cdp_langchain.utils import CdpAgentkitWrapper
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage
from langchain_community.agent_toolkits.load_tools import load_tools
from langchain_community.utilities.tavily_search import TavilySearchAPIWrapper
from langchain_community.tools import TavilySearchResults

from typing import List, Dict
from datetime import datetime
import json

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
    search_tool = [TavilySearchResults(
        max_results=5,
        search_depth="advanced",
        include_answer=True,
        include_raw_content=True,
        include_images=False
    )]
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

def generate_bet_events(description: str, fan_token_name: str) -> List[Dict]:
    agent_executor = init_agent()
    todays_date = datetime.now()
    
    # Update the search prompt to request JSON format specifically
    search_prompt = f"""
    The following in brackets [{description}] is a betting event that needs to be attested. It is in free-form and needs to be structured. Use search tools to gather all the information needed to create a bet that can be attested to. It must be a single event after today's date of {todays_date} and be related to {fan_token_name}. If it is empty or not provided or the betting event is limited, create a fun bet on real life future events for that {fan_token_name} but only focus on positive news and upcoming events.

    Return ONLY a JSON object with the following structure, and nothing else:
    {{
        "description": "clear description of the bet",
        "event_title": "short title of the event",
        "event_datetime": "YYYY-MM-DD HH:MM:SS"
    }}
    """
    
    try:
        # Use the agent to perform the search and process results
        response = ask_agent(search_prompt, agent_executor)
        
        # Parse the response to extract just the JSON
        # Find the first { and last } to extract the JSON string
        start_idx = response.find('{')
        end_idx = response.rfind('}') + 1
        print('****1')
        if start_idx != -1 and end_idx != -1:
            json_str = response[start_idx:end_idx]
            event = json.loads(json_str)
            print('****2')
            return event
        else:
            print(f"No valid JSON found in response for {fan_token_name}")
            return {}
            
    except Exception as e:
        print(f"Error generating bet events: {str(e)}")
        return {}

# Example usage:
if __name__ == "__main__":
    agent = init_agent()
    team_name = "Barcelona FC"  # Example team
    events = generate_bet_events(team_name, agent)

