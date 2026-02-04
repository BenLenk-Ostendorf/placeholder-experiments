/**
 * Learning Goals Service
 * 
 * This service provides access to learning goals and certificates data.
 * It loads data from the JSON file and provides type-safe access to the data.
 */

import learningGoalsData from '@/data/learningGoals.json';

export interface SkillNode {
  id: string;
  title: string;
  description: string;
  hint: string;
  prerequisites: string[];
  hasContent: boolean;
}

export interface Certificate {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredGoals: string[];
  color: string;
}

interface LearningGoalsData {
  learningGoals: SkillNode[];
  certificates: Certificate[];
}

/**
 * Get all learning goals
 * @returns Array of all learning goals
 */
export function getLearningGoals(): SkillNode[] {
  return (learningGoalsData as LearningGoalsData).learningGoals;
}

/**
 * Get a specific learning goal by ID
 * @param id - The ID of the learning goal
 * @returns The learning goal or undefined if not found
 */
export function getLearningGoalById(id: string): SkillNode | undefined {
  return getLearningGoals().find(goal => goal.id === id);
}

/**
 * Get all certificates
 * @returns Array of all certificates
 */
export function getCertificates(): Certificate[] {
  return (learningGoalsData as LearningGoalsData).certificates;
}

/**
 * Get a specific certificate by ID
 * @param id - The ID of the certificate
 * @returns The certificate or undefined if not found
 */
export function getCertificateById(id: string): Certificate | undefined {
  return getCertificates().find(cert => cert.id === id);
}

/**
 * Get learning goals that have no prerequisites (starting points)
 * @returns Array of learning goals with no prerequisites
 */
export function getStartingGoals(): SkillNode[] {
  return getLearningGoals().filter(goal => goal.prerequisites.length === 0);
}

/**
 * Get learning goals that are accessible given completed goals
 * @param completedGoalIds - Array of completed goal IDs
 * @returns Array of accessible learning goals
 */
export function getAccessibleGoals(completedGoalIds: string[]): SkillNode[] {
  return getLearningGoals().filter(goal =>
    goal.prerequisites.every(prereq => completedGoalIds.includes(prereq))
  );
}

/**
 * Get learning goals that have content available
 * @returns Array of learning goals with hasContent = true
 */
export function getGoalsWithContent(): SkillNode[] {
  return getLearningGoals().filter(goal => goal.hasContent);
}

/**
 * Check if a certificate is earned based on completed goals
 * @param certificateId - The ID of the certificate
 * @param completedGoalIds - Array of completed goal IDs
 * @returns True if the certificate is earned
 */
export function isCertificateEarned(certificateId: string, completedGoalIds: string[]): boolean {
  const certificate = getCertificateById(certificateId);
  if (!certificate) return false;
  
  return certificate.requiredGoals.every(goalId => completedGoalIds.includes(goalId));
}

/**
 * Get all prerequisites for a learning goal (recursive)
 * @param goalId - The ID of the learning goal
 * @returns Set of all prerequisite goal IDs
 */
export function getAllPrerequisites(goalId: string): Set<string> {
  const prerequisites = new Set<string>();
  const goal = getLearningGoalById(goalId);
  
  if (!goal) return prerequisites;
  
  const addPrerequisites = (currentGoalId: string) => {
    const currentGoal = getLearningGoalById(currentGoalId);
    if (!currentGoal) return;
    
    currentGoal.prerequisites.forEach(prereqId => {
      if (!prerequisites.has(prereqId)) {
        prerequisites.add(prereqId);
        addPrerequisites(prereqId);
      }
    });
  };
  
  addPrerequisites(goalId);
  return prerequisites;
}
