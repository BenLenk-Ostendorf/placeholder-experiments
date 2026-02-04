# Learning Goals JSON Guide

This guide explains how to create and structure learning goals for the AI literacy platform.

## Overview

Learning goals are stored in a JSON file (`data/learningGoals.json`) and accessed through a service layer (`services/learningGoalsService.ts`). This architecture allows for easy content management and future extensibility (e.g., loading from a CMS or API).

## File Structure

The JSON file contains two main sections:
- **learningGoals**: Array of learning goal objects
- **certificates**: Array of certificate objects

## Learning Goal Schema

Each learning goal object has the following properties:

```json
{
  "id": "unique-goal-id",
  "title": "Display Title",
  "description": "Short description (1 sentence)",
  "hint": "Detailed explanation of what the learner will gain",
  "prerequisites": ["prerequisite-goal-id-1", "prerequisite-goal-id-2"],
  "hasContent": true
}
```

### Property Definitions

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | ✅ | Unique identifier using kebab-case (e.g., `ai-text-generation`) |
| `title` | string | ✅ | Display name shown in the skill tree (keep concise, ~3-6 words) |
| `description` | string | ✅ | Brief one-sentence description of the goal |
| `hint` | string | ✅ | Detailed explanation shown in the modal (1-2 sentences) |
| `prerequisites` | string[] | ✅ | Array of goal IDs that must be completed first. Use empty array `[]` for starting goals |
| `hasContent` | boolean | ✅ | Whether learning nuggets are available for this goal. Set to `false` for placeholder goals |

### Naming Conventions

- **IDs**: Use kebab-case (lowercase with hyphens): `ai-text-generation`, `prompt-engineering`
- **Titles**: Use title case: "How AI Produces Text", "Prompt Engineering"
- **Keep titles concise**: Aim for 3-6 words maximum
- **Descriptions**: One clear sentence explaining the goal
- **Hints**: 1-2 sentences providing more context about what the learner will gain

## Certificate Schema

Each certificate object has the following properties:

```json
{
  "id": "certificate-id",
  "title": "Certificate Name",
  "description": "What this certificate represents",
  "icon": "🎓",
  "requiredGoals": ["goal-id-1", "goal-id-2", "goal-id-3"],
  "color": "amber"
}
```

### Property Definitions

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | ✅ | Unique identifier using kebab-case |
| `title` | string | ✅ | Display name of the certificate |
| `description` | string | ✅ | Brief description of what the certificate represents |
| `icon` | string | ✅ | Emoji representing the certificate (single emoji character) |
| `requiredGoals` | string[] | ✅ | Array of goal IDs required to earn this certificate |
| `color` | string | ✅ | Tailwind color name (e.g., `amber`, `purple`, `emerald`, `blue`, `rose`) |

## Creating Learning Paths

Learning goals form a directed acyclic graph (DAG) through prerequisites. Follow these principles:

### 1. **Start with Foundation Goals**
Create entry-point goals with no prerequisites:
```json
{
  "id": "what-is-ai",
  "title": "What is AI?",
  "prerequisites": [],
  "hasContent": true
}
```

### 2. **Build Progressive Levels**
Structure goals in logical progression:
- **Level 0**: Foundation (no prerequisites)
- **Level 1**: Core concepts (depend on foundation)
- **Level 2**: Applied knowledge (depend on core concepts)
- **Level 3**: Advanced topics (depend on applied knowledge)

### 3. **Use Multiple Prerequisites**
Goals can require multiple prerequisites:
```json
{
  "id": "ethical-ai-use",
  "prerequisites": ["fact-checking", "ai-bias"],
  "hasContent": false
}
```

### 4. **Mark Content Availability**
- Set `hasContent: true` only when learning nuggets are ready
- Use `hasContent: false` for planned future content
- Users can only access goals with `hasContent: true`

## Example: Adding a New Learning Goal

Let's add a new goal about "AI Model Selection":

```json
{
  "id": "ai-model-selection",
  "title": "Choosing AI Models",
  "description": "Learn to select the right AI model for your task",
  "hint": "Understand the differences between various AI models and learn how to choose the best one based on your specific needs, budget, and performance requirements.",
  "prerequisites": ["ai-tools-overview", "choosing-ai-tool"],
  "hasContent": false
}
```

**Steps:**
1. Choose a unique, descriptive ID
2. Write a concise title (3-6 words)
3. Create a one-sentence description
4. Write a detailed hint explaining the value
5. Identify prerequisite goals (what should learners know first?)
6. Set `hasContent` based on whether nuggets are ready

## Example: Adding a New Certificate

Let's add a certificate for "AI Research Assistant":

```json
{
  "id": "ai-researcher",
  "title": "AI Research Assistant",
  "description": "Master AI tools for academic and professional research",
  "icon": "🔬",
  "requiredGoals": [
    "ai-text-generation",
    "fact-checking",
    "ai-bias",
    "advanced-prompting"
  ],
  "color": "indigo"
}
```

**Steps:**
1. Choose a unique ID and descriptive title
2. Write a clear description of what the certificate represents
3. Select an appropriate emoji icon
4. List all required goal IDs (learners must complete all)
5. Choose a Tailwind color (amber, purple, emerald, blue, rose, indigo, etc.)

## Validation Checklist

Before adding new content, verify:

- ✅ All IDs are unique and use kebab-case
- ✅ All prerequisite IDs reference existing goals
- ✅ All certificate requiredGoals reference existing goals
- ✅ No circular dependencies in prerequisites
- ✅ JSON is valid (use a JSON validator)
- ✅ Titles are concise and clear
- ✅ hasContent is set appropriately
- ✅ Color names are valid Tailwind colors

## Testing Your Changes

After modifying `learningGoals.json`:

1. **Validate JSON syntax**: Use a JSON validator or your IDE
2. **Check the skill tree**: Navigate to the skill tree view
3. **Test prerequisites**: Verify goals appear only when prerequisites are met
4. **Test certificates**: Complete required goals and check certificate display
5. **Verify content availability**: Ensure goals with `hasContent: true` are accessible

## Common Patterns

### Branching Paths
Create multiple paths from a single goal:
```json
{
  "id": "ai-text-generation",
  "prerequisites": []
}
// Branches into:
{
  "id": "temperature-randomness",
  "prerequisites": ["ai-text-generation"]
}
{
  "id": "ai-hallucinations",
  "prerequisites": ["ai-text-generation"]
}
```

### Converging Paths
Combine multiple goals into one:
```json
{
  "id": "ethical-ai-use",
  "prerequisites": ["fact-checking", "ai-bias"]
}
```

### Linear Progression
Create a straightforward path:
```json
{
  "id": "prompt-engineering",
  "prerequisites": ["temperature-randomness"]
}
{
  "id": "advanced-prompting",
  "prerequisites": ["prompt-engineering"]
}
```

## Best Practices

1. **Keep the graph manageable**: Avoid too many prerequisites (max 2-3 per goal)
2. **Logical progression**: Ensure prerequisites make pedagogical sense
3. **Clear titles**: Use descriptive, jargon-free titles when possible
4. **Consistent style**: Follow existing naming patterns
5. **Test thoroughly**: Verify the learning path flows naturally
6. **Document changes**: Update this guide if you add new patterns

## Service API Reference

The `learningGoalsService.ts` provides these functions:

- `getLearningGoals()`: Get all learning goals
- `getLearningGoalById(id)`: Get a specific goal
- `getCertificates()`: Get all certificates
- `getCertificateById(id)`: Get a specific certificate
- `getStartingGoals()`: Get goals with no prerequisites
- `getAccessibleGoals(completedIds)`: Get goals accessible based on completion
- `getGoalsWithContent()`: Get goals with available content
- `isCertificateEarned(certId, completedIds)`: Check if certificate is earned
- `getAllPrerequisites(goalId)`: Get all prerequisites recursively

## Future Enhancements

Potential extensions to consider:

- **Difficulty levels**: Add a difficulty rating (beginner, intermediate, advanced)
- **Estimated time**: Include estimated completion time
- **Tags/categories**: Add tags for filtering (e.g., "technical", "ethical", "practical")
- **Learning styles**: Indicate preferred learning style (visual, interactive, reading)
- **External resources**: Link to supplementary materials
- **Localization**: Support multiple languages

---

**Questions or Issues?** Refer to `NAMING.md` for terminology definitions or check the service implementation in `src/services/learningGoalsService.ts`.
