Great — here’s the **Technical Specification** for your **Prompt Practice Lab** project, based on the PRD and Colin Matthews’ preferred handoff structure:

---

## **🛠 Tech Spec: Prompt Practice Lab – Prompt Evaluation \+ Training Interface**

**Version**: Initial Build  
 **Linked PRD**: Prompt Practice Lab PRD v1

---

### **🧱 1\. System Architecture Overview**

**Core Modules**:

* **Frontend (Replit / React)**

  * Prompt Input Interface

  * Evaluation Output Display

  * Rating Summary \+ Feedback Blocks

  * Prompt History Tracker

  * Prompt Type Selector (Phase 2+)

* **Backend (FastAPI)**

  * Endpoint: `/evaluate_prompt`

    * Accepts user input \+ optional prompt type

    * Calls LLM and evaluation tools

  * Endpoint: `/improve_prompt`

    * Suggests optimized version of the prompt

  * Endpoint: `/history`

    * Fetches past inputs, feedback, and scores

* **LLM Integration**

  * GPT-4 API with a structured system prompt

  * Embedded few-shot examples of good/bad prompts

  * Agent-style reasoning before evaluation

* **Evaluation Agent**

  * Functions:

    * `clarity_score()`

    * `task_alignment_score()`

    * `tone_match_score()`

    * `suggest_improvement()`

    * `highlight_weak_spots()`

  * Outputs a score (1–10) and rationale per category

* **Database**

  * PostgreSQL (Replit) or Firebase (if scaling)

  * Stores:

    * Prompt submissions

    * Scores \+ feedback

    * Timestamps

    * Prompt type metadata

    * User profile (optional for streaks)

* **Optional RAG (Phase 3\)**

  * Use podcast transcripts or summaries as embedding sources

  * Retrieval of relevant tips/examples

  * Inject into LLM context for contextual feedback

---

### **🧠 2\. Prompt Evaluation Logic**

**System Prompt Structure**:

You are a Prompt Evaluation Agent. Given a prompt, your tasks are:  
1\. Rate it for clarity, specificity, and task fit  
2\. Explain each score in 2–3 lines  
3\. Suggest one improved version  
4\. Highlight what was missing, if anything  
Return results in JSON format.

**Few-shot Additions (in prompt)**:

* Examples of good prompts

* Bad prompts and why they fail

* Style-specific examples (Phase 2\)

**Eval JSON Output Format**:

{  
  "scores": {  
    "clarity": 8,  
    "specificity": 6,  
    "task\_fit": 7  
  },  
  "feedback": {  
    "clarity": "Fairly clear, but could include more context.",  
    "specificity": "Lacks a concrete goal or output format.",  
    "task\_fit": "Mostly aligned, but could benefit from tone guidance."  
  },  
  "suggested\_prompt": "Rewrite your prompt as: 'Summarize the key insights from this podcast in bullet points using plain language.'",  
  "missing\_elements": "No format or tone guidance given."  
}

---

### **⚙️ 3\. Phase-by-Phase Component Breakdown**

#### **Phase 1: MVP**

* Prompt Input UI

* Evaluation Display Module

* Backend with GPT-4 evaluation \+ feedback

* Store/retrieve history

#### **Phase 2: Prompt Types \+ Style Mode**

* Dropdown for prompt styles (instructional, system, creative)

* Adaptive evaluation logic per style

* Style-specific feedback and rewrite logic

#### **Phase 3: RAG Integration**

* Use podcast links or summaries

* Vector store (e.g., ChromaDB or FAISS)

* Retrieve and inject examples based on prompt type or keywords

#### **Phase 4: Eval Functions \+ Progress Dashboard**

* Modularize scoring logic

* Dashboard with trend graphs

* “Top Weak Spots” feedback per user

#### **Phase 5: Playground & Challenge Mode**

* Challenge templates

* Comparison mode: original vs improved

* Gamified feedback system

---

### **🧪 4\. Testing Plan**

**Manual Test Cases**:

* Low-quality prompt → proper critique \+ rewrite

* High-quality prompt → high scores \+ minimal changes

* Edge cases (too long, too short, unclear)

**Automated Evaluation**:

* Seed test prompts with expected scores

* Snapshot test evaluation JSON response structure

---

### **🧩 5\. External Libraries / Tools**

* `openai` for GPT-4

* `FastAPI` for backend

* `SQLAlchemy` for database connection

* `Chroma` or `FAISS` for RAG (Phase 3\)

* `Recharts` or `Chart.js` (Phase 4 dashboard)

* `Tailwind CSS` (UI styling)

---

### **📦 6\. Deployment Plan**

* **Replit Core** for initial prototyping

* Export to GitHub

* Optional deploy via Replit’s web server \+ cron job for backups

* Later: Deploy on Vercel/Render with Postgres if needed

---

Would you like this exported as a downloadable PDF to pair with your PRD? Or should we jump straight into building **Phase 1** in Replit?

