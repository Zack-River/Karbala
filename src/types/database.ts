// ─── Database Entity Types ───
// Mirror the Supabase database schema exactly

export type SeasonStatus = "active" | "inactive";
export type NightStatus = "draft" | "published" | "hidden";
export type CardType = "quote" | "reflection" | "visual" | "benefit" | "question" | "note" | "excerpt";
export type CardStatus = "draft" | "published";
export type CardImagePosition = "top" | "bottom" | "left" | "right" | "background";
export type AttachmentType = "audio" | "pdf" | "image";
export type AttachmentStatus = "draft" | "published";
export type ResourceCategory = "book" | "article" | "video" | "website";

// ─── Seasons ───

export interface Season {
  id: string;
  title: string;
  subtitle: string | null;
  intro: string | null;
  hero_image: string | null;
  logo_image: string | null;
  is_active: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Sheikh Profile ───

export interface SheikhProfile {
  id: string;
  name: string;
  image: string | null;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Nights ───

export interface Night {
  id: string;
  season_id: string;
  number: number;
  title: string;
  slug: string;
  short_description: string | null;
  teaser: string | null;
  why_important: string | null;
  central_idea: string | null;
  quote: string | null;
  quote_author: string | null;
  reflection_question: string | null;
  practical_step: string | null;
  cover_image: string | null;
  audio_file: string | null;
  pdf_file: string | null;
  video_file: string | null;
  video_url: string | null;
  show_audio: boolean;
  show_video: boolean;
  status: NightStatus;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
  seo_image: string | null;
  created_at: string;
  updated_at: string;
}

// Night with all related data (for detail page)
export interface NightWithRelations extends Night {
  topics: Topic[];
  verses: Verse[];
  narrations: Narration[];
  resources: Resource[];
  cards: Card[];
  attachments: Attachment[];
  quiz: QuizWithQuestions | null;
}

// ─── Topics ───

export interface Topic {
  id: string;
  night_id: string;
  title: string;
  content: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ─── Verses ───

export interface Verse {
  id: string;
  night_id: string;
  surah_name: string | null;
  verse_number: string | null;
  content: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ─── Narrations ───

export interface Narration {
  id: string;
  night_id: string;
  content: string;
  source: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ─── Resources ───

export interface Resource {
  id: string;
  night_id: string;
  title: string;
  category: ResourceCategory;
  url: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ─── Cards ───

export interface Card {
  id: string;
  night_id: string | null;
  slug: string;
  type: CardType;
  title: string;
  content: string | null;
  image: string | null;
  image_position: CardImagePosition;
  downloadable: boolean;
  status: CardStatus;
  featured: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Attachments ───

export interface Attachment {
  id: string;
  night_id: string;
  title: string;
  type: AttachmentType;
  file_url: string;
  downloadable: boolean;
  status: AttachmentStatus;
  created_at: string;
  updated_at: string;
}

// ─── Quizzes ───

export interface Quiz {
  id: string;
  night_id: string;
  title: string | null;
  is_enabled: boolean;
  opens_at: string | null;
  closes_at: string | null;
  duration_minutes: number | null;
  motivational_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface QuizAnswer {
  id: string;
  question_id: string;
  answer_text: string;
  is_correct?: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestionWithAnswers extends QuizQuestion {
  answers: QuizAnswer[];
}

export interface QuizWithQuestions extends Quiz {
  questions: QuizQuestionWithAnswers[];
}

export interface QuizWithNight extends Quiz {
  night: Pick<Night, "id" | "number" | "title" | "slug">;
}

// ─── Quiz Analytics ───

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  user_id: string | null;
  anonymous_id: string | null;
  started_at: string;
  submitted_at: string | null;
  score: number | null;
  correct_count: number;
  wrong_count: number;
  unanswered_count: number;
  total_questions: number;
  created_at: string;
}

export interface QuizAttemptAnswer {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_answer: string | null;
  is_correct: boolean;
  created_at: string;
}

export interface QuizAttemptWithAnswers extends QuizAttempt {
  answers: QuizAttemptAnswer[];
}

export interface QuizStats {
  quiz_id: string;
  total_attempts: number;
  perfect_score_count: number;
  total_errors: number;
  pass_rate: number;
  average_score: number;
}

// ─── Majalis ───

export interface Majlis {
  id: string;
  name: string;
  address: string | null;
  location_description: string | null;
  google_maps_url: string;
  is_enabled: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
