# Naming Conventions

This document defines the terminology used throughout the learning platform to ensure consistency.

---

## Hierarchy Overview

```
Course Goal
    └── Learning Goal (1 or more)
            └── Learning Objective (1 or more)
                    └── Learning Nugget (satisfies the objective)
```

---

## Definitions

### Learning Nugget

A **Learning Nugget** is a self-contained learning unit that helps users achieve a specific learning objective. Nuggets come in different formats:

| Format | Description |
|--------|-------------|
| **Story-driven Course** | Interactive narrative with text, dialogue, explanations, visuals, and ends with a quiz |
| **Challenge Quiz** | Direct assessment for users who want to "test out" and earn credit without the full course |
| **Video Course + Quiz** | Video lessons followed by assessment *(coming soon)* |
| **explAIner** | AI-powered adaptive explanations *(coming soon)* |

**Key characteristics:**
- Contains educational content (text, interactive elements, visuals)
- Ends with an assessment (quiz)
- Satisfies one or more **Learning Objectives**
- Contributes to achieving a **Learning Goal**

---

### Learning Objective

A **Learning Objective** is a specific, measurable skill or knowledge item that a user should acquire. Objectives are granular and focused.

**Examples:**
- "Define what a token is in the context of AI"
- "Explain how AI models predict the next token"
- "Identify factors that influence AI output variability"

**Key characteristics:**
- Specific and measurable
- Satisfied by completing a **Learning Nugget**
- Multiple objectives may be covered by a single nugget
- Part of a broader **Learning Goal**

---

### Learning Goal

A **Learning Goal** is a broader educational target that encompasses multiple learning objectives. Goals represent what users see in the skill tree as nodes they can complete.

**Examples:**
- "Understanding How AI Produces Text"
- "AI Ethics Fundamentals"
- "Prompt Engineering Basics"

**Key characteristics:**
- Visible as nodes in the **Skill Tree**
- Achieved by completing all associated **Learning Objectives**
- May have prerequisites (other Learning Goals)
- Contributes to one or more **Course Goals**

---

### Course Goal

A **Course Goal** (also called a **Certificate**) is the highest-level educational achievement. It represents mastery of a complete subject area.

**Examples:**
- "AI Literacy Certificate"
- "Prompt Engineering Certificate"
- "AI Ethics Certificate"

**Key characteristics:**
- Achieved by completing all required **Learning Goals**
- Represents comprehensive understanding of a topic
- May be displayed as a certificate or badge

---

## Relationship Summary

| Term | Contains | Contained By | Purpose |
|------|----------|--------------|---------|
| **Course Goal** | Learning Goals | — | Certificate/mastery achievement |
| **Learning Goal** | Learning Objectives | Course Goal | Skill tree node |
| **Learning Objective** | — | Learning Goal | Specific measurable outcome |
| **Learning Nugget** | Content + Quiz | — | Delivery mechanism for objectives |

---

## Usage in Code

| Concept | Variable/Component Names |
|---------|-------------------------|
| Learning Nugget | `nugget`, `LearningNugget`, `nuggetElements` |
| Learning Objective | `objective`, `LearningObjective` |
| Learning Goal | `goal`, `LearningGoal`, `SkillNode` |
| Course Goal | `certificate`, `Certificate`, `courseGoal` |

---

## Admin Panel Tabs

| Tab | Purpose |
|-----|---------|
| **Nuggets** | Create and edit learning nuggets (content + quizzes) |
| **Learning Goals** | Manage skill tree nodes and their relationships |
| **Assessment** | Edit quiz questions for nuggets |
| **Publishing** | Control nugget visibility and distribution |

