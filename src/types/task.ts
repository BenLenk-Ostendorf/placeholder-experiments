export interface LearningGoal {
  id: string;
  title: string;
  description: string;
  category: 'basics' | 'ml' | 'nlp' | 'ethics' | 'applications';
  completed: boolean;
}

export type LearningGoalInput = Omit<LearningGoal, 'id'>;
