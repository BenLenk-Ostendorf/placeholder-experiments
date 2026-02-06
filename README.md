# AI Learning Hub - Interactive Learning Nugget Platform

A prototype platform for creating, editing, publishing, and collecting feedback on AI learning nuggets. Built for higher education institutions in Germany to develop and test interactive AI learning content.

## Purpose

This platform enables:
- **Content Creators** - Create, manage, publish and recieve feedback on learning nuggets concerning AI in higher education.
- **Testers** - Test and provide feedback on learning nuggets.
- **Students and instructors** - Learn about AI via a learning path, made of currated learning nuggets in different formats.

## Key Features

### 🎯 Learning Path
- **Interactive Skill Tree** - Visual learning path to navigate through learning nuggets.
- **Certificate Paths** - Structured learning goals leading to certificates (currently placeholders)
- **Multiple Learning Formats**:
  - Story-driven courses with character dialogues
  - Video courses with quizzes
  - explAIner (AI-guided explanations)
  - Problem based learning materials
  - Challenge for Credit (test-out option)
- **Progress Tracking** - Track completed learning nuggets and certificate progress

### 📝 Content Management (Admin Panel)
- **Learning Nugget Editor** - WYSIWYG editor for creating, editing and embed rich learning content
- **Content Elements**:
  - Story sections with character dialogues
  - Explanation sections with visuals
  - Interactive simulations
  - Embedded materials (video, websites etc.)
  - Quizzes and assessments
  - Learning resources and glossary terms
- **Learning Goals Management** - Define goals, prerequisites, and certificate requirements

### 📊 Feedback & Analytics
- **Feedback Collection** - Collect detailed feedback on specific content elements
- **Rating System** - 5-point smiley rating scale for overall learning nuggets rating
- **Analytics Dashboard**:
  - Average ratings per nugget
  - Feedback by learning objective and university
  - Filter and sort capabilities
  - Response counts and trends

### Roles
- **Content Creators** - Create, manage, publish and recieve feedback on learning nuggets concerning AI in higher education.
- **Testers (experts and closed Beta testers)** - Test and provide feedback on learning nuggets 
- **Students and instructors** - Learn about AI via a learning path, made of currated learning nuggets in different formats.

### 🚀 Publishing Workflow
- **Draft Management** - Work on content before testing
- **Publishing Queue** - Allow different groups to test and rate learning nuggets

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5
- **Data**: Currently using mock data (no backend required)
- **Deployment**: Prototype (not production-ready)

## Getting Started

### Prerequisites
- Node.js 20+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd placeholder-experiments
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Open the application**
Navigate to [http://localhost:3000](http://localhost:3000)

### No Environment Variables Required
This prototype uses mock data and does not require any environment configuration.

## Project Structure

```
placeholder-experiments/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── page.tsx              # Redirects to /learning-path
│   │   ├── learning-path/        # Skill tree and learning paths (main page)
│   │   ├── content/              # Learning content viewer
│   │   └── admin/                # Admin panel
│   ├── components/               # React components
│   │   ├── AdminPanel.tsx        # Content management interface
│   │   ├── SkillTree.tsx         # Interactive learning path visualization
│   │   ├── StorySection.tsx      # Character dialogue component
│   │   ├── TokenSimulator.tsx    # Interactive AI concept simulator
│   │   ├── FinalQuiz.tsx         # Assessment component
│   │   ├── Glossary.tsx          # Terminology reference
│   │   └── ...                   # Additional learning components
│   ├── services/
│   │   └── learningGoalsService.ts  # Learning goals data management
│   ├── data/
│   │   └── learningGoals.json    # Learning goals and certificates data
│   ├── lib/                      # Utility functions
│   ├── types/                    # TypeScript type definitions
│   └── config/                   # Configuration files
├── docs/
│   └── LEARNING_GOALS_GUIDE.md   # Guide for creating learning goals
├── NAMING.md                     # Terminology and naming conventions
└── README.md                     # This file
```

## Documentation

### For Content Creators
- **[Learning Goals Guide](docs/LEARNING_GOALS_GUIDE.md)** - Complete guide to creating and structuring learning goals, including JSON schema and examples
- **[Naming Conventions](NAMING.md)** - Terminology used throughout the platform (e.g., "nuggets" vs "resources")

### Component Documentation

#### Core Components
- **`AdminPanel`** - Main content management interface with tabs for:
  - Feedback management and ratings
  - Nugget creation and editing
  - Publishing workflow
  - Learning goals configuration
  - Assessment management

- **`SkillTree`** - Interactive learning path visualization with:
  - Node-based goal representation
  - Prerequisite tracking
  - Certificate path highlighting
  - Progress indicators

- **`StorySection`** - Character-based dialogue component featuring:
  - Multiple character faces and expressions
  - Clickable progression
  - Glossary term integration

- **`TokenSimulator`** - Interactive demonstration of AI token prediction with:
  - Probability distribution visualization
  - User interaction for token selection
  - Real-time feedback

#### Learning Content Components
- **`AIDialogue`** - Conversation-based learning
- **`TrustSurvey`** - User perception assessment
- **`TrustAnalysis`** - Survey results visualization
- **`ExplanationSection`** - Concept explanations with visuals
- **`TokenVisual`** / **`SpinnerVisual`** - Visual learning aids
- **`FinalQuiz`** - Assessment with scoring
- **`LearningComplete`** - Completion celebration
- **`LearningResources`** - External resource links
- **`Glossary`** - Terminology reference with search

#### Utility Components
- **`Editable`** - Wrapper for content editing mode
- **`Flaggable`** - Wrapper for feedback collection
- **`FeedbackFlag`** - Feedback submission interface

### API / Service Layer

#### `learningGoalsService.ts`
Provides access to learning goals and certificate data:
```typescript
// Get all learning goals
const goals = getLearningGoals();

// Get all certificates
const certificates = getCertificates();

// Get a specific goal by ID
const goal = getGoalById('ai-text-generation');

// Get goals for a certificate
const certGoals = getGoalsForCertificate('ai-fundamentals');
```

#### Data Structure
Learning goals are defined in `data/learningGoals.json` with the following structure:
```typescript
{
  learningGoals: SkillNode[];  // Array of learning goal nodes
  certificates: Certificate[];  // Array of certificate definitions
}
```

See [Learning Goals Guide](docs/LEARNING_GOALS_GUIDE.md) for detailed schema documentation.

## Usage

### For Students
1. Open the app — you start directly on the **Learning Path**
2. Explore the skill tree and select a learning goal
3. Choose your preferred learning format
4. Complete the interactive content
5. Take quizzes to test your knowledge
6. Provide feedback on the learning experience

### For Lecturers (Content Creators)
1. Access the **Admin Panel** from the navigation
2. Go to the **Nuggets** tab
3. Select a learning goal or create a new one
4. Add content elements (story, explanations, quizzes)
5. Preview your content in the editor
6. Submit for publishing when ready

### For Testers
1. Enable **Testing Mode** (flag icon in navigation)
2. Review learning content
3. Flag issues or provide feedback on specific elements
4. View feedback summary in the Admin Panel

## Development

### Adding New Learning Goals
1. Edit `src/data/learningGoals.json`
2. Follow the schema defined in [Learning Goals Guide](docs/LEARNING_GOALS_GUIDE.md)
3. Add goal metadata, prerequisites, and learning formats
4. The skill tree will automatically update

### Creating New Components
Follow the existing component patterns:
- Use TypeScript for type safety
- Implement proper prop interfaces
- Support dark mode with Tailwind dark: classes
- Add accessibility attributes
- Document complex logic

### Mock Data
All data is currently mocked in the components. To connect to a real backend:
1. Create API service layer in `src/lib/`
2. Replace mock data with API calls
3. Add environment variables for API endpoints
4. Implement authentication if needed

## License

**Open Source - Attribution Required**

You are free to use, modify, and distribute this software, including for commercial purposes, provided that you:
- Cite the original authors
- Include attribution in derivative works

**Authors**: [Add your names here]

## Contributing

This is a prototype for research and educational purposes. Contributions are welcome:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request with a clear description

## Support

For questions or issues:
- Review the documentation in `docs/`
- Check the [Learning Goals Guide](docs/LEARNING_GOALS_GUIDE.md)
- Review [Naming Conventions](NAMING.md)

## Roadmap

- [ ] Learning Projects implementation
- [ ] Backend integration (database, authentication)
- [ ] Real-time collaboration features
- [ ] Advanced analytics and reporting
- [ ] Multi-language support (German/English)
- [ ] Export/import functionality for content
- [ ] Mobile app version
