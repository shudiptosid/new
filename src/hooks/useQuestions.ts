import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Question,
  QuestionWithOptions,
  MCQOption,
  ShortAnswer,
  QuestionFormData,
  UserQuizAttempt,
  UserQuestionProgress,
} from "@/types/question.types";

export const useQuestions = () => {
  const [questions, setQuestions] = useState<QuestionWithOptions[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all questions (with options)
  const fetchQuestions = async (includeInactive = false) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("questions")
        .select(
          `
          *,
          mcq_options (*),
          short_answers (*)
        `,
        )
        .order("order_index", { ascending: true });

      if (!includeInactive) {
        query = query.eq("is_active", true);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      const formattedData = data.map((q: any) => ({
        ...q,
        mcq_options: q.mcq_options || [],
        short_answer: q.short_answers?.[0] || null,
      }));

      setQuestions(formattedData);
      return formattedData;
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching questions:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch questions by category
  const fetchQuestionsByCategory = async (category: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("questions")
        .select(
          `
          *,
          mcq_options (*),
          short_answers (*)
        `,
        )
        .eq("category", category)
        .eq("is_active", true)
        .order("order_index", { ascending: true });

      if (fetchError) throw fetchError;

      const formattedData = data.map((q: any) => ({
        ...q,
        mcq_options: q.mcq_options || [],
        short_answer: q.short_answers?.[0] || null,
      }));

      setQuestions(formattedData);
      return formattedData;
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching questions by category:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Create a new question
  const createQuestion = async (formData: QuestionFormData) => {
    try {
      setLoading(true);
      setError(null);

      // Insert question
      const { data: question, error: questionError } = await supabase
        .from("questions")
        .insert({
          question_text: formData.question_text,
          question_type: formData.question_type,
          category: formData.category,
          difficulty: formData.difficulty,
          explanation: formData.explanation,
          is_active: formData.is_active,
          order_index: formData.mcq_options ? 0 : 0,
        })
        .select()
        .single();

      if (questionError) throw questionError;

      // Insert MCQ options if applicable
      if (formData.question_type === "mcq" && formData.mcq_options) {
        const optionsToInsert = formData.mcq_options.map((opt, index) => ({
          question_id: question.id,
          option_text: opt.option_text,
          is_correct: opt.is_correct,
          order_index: index,
        }));

        const { error: optionsError } = await supabase
          .from("mcq_options")
          .insert(optionsToInsert);

        if (optionsError) throw optionsError;
      }

      // Insert short answer if applicable
      if (formData.question_type === "short_answer" && formData.short_answer) {
        const { error: answerError } = await supabase
          .from("short_answers")
          .insert({
            question_id: question.id,
            correct_answer: formData.short_answer.correct_answer,
            alternative_answers:
              formData.short_answer.alternative_answers || [],
          });

        if (answerError) throw answerError;
      }

      await fetchQuestions(true);
      return question;
    } catch (err: any) {
      setError(err.message);
      console.error("Error creating question:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a question
  const updateQuestion = async (id: string, formData: QuestionFormData) => {
    try {
      setLoading(true);
      setError(null);

      // Update question
      const { error: questionError } = await supabase
        .from("questions")
        .update({
          question_text: formData.question_text,
          category: formData.category,
          difficulty: formData.difficulty,
          explanation: formData.explanation,
          is_active: formData.is_active,
        })
        .eq("id", id);

      if (questionError) throw questionError;

      // Update MCQ options if applicable
      if (formData.question_type === "mcq" && formData.mcq_options) {
        // Delete existing options
        await supabase.from("mcq_options").delete().eq("question_id", id);

        // Insert new options
        const optionsToInsert = formData.mcq_options.map((opt, index) => ({
          question_id: id,
          option_text: opt.option_text,
          is_correct: opt.is_correct,
          order_index: index,
        }));

        const { error: optionsError } = await supabase
          .from("mcq_options")
          .insert(optionsToInsert);

        if (optionsError) throw optionsError;
      }

      // Update short answer if applicable
      if (formData.question_type === "short_answer" && formData.short_answer) {
        // Delete existing answer
        await supabase.from("short_answers").delete().eq("question_id", id);

        // Insert new answer
        const { error: answerError } = await supabase
          .from("short_answers")
          .insert({
            question_id: id,
            correct_answer: formData.short_answer.correct_answer,
            alternative_answers:
              formData.short_answer.alternative_answers || [],
          });

        if (answerError) throw answerError;
      }

      await fetchQuestions(true);
    } catch (err: any) {
      setError(err.message);
      console.error("Error updating question:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a question
  const deleteQuestion = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from("questions")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      await fetchQuestions(true);
    } catch (err: any) {
      setError(err.message);
      console.error("Error deleting question:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Toggle question active status
  const toggleQuestionActive = async (id: string, isActive: boolean) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("questions")
        .update({ is_active: !isActive })
        .eq("id", id);

      if (error) throw error;
      await fetchQuestions(true);
    } catch (err: any) {
      setError(err.message);
      console.error("Error toggling question:", err);
    } finally {
      setLoading(false);
    }
  };

  // Save quiz attempt
  const saveQuizAttempt = async (
    category: string | undefined,
    totalQuestions: number,
    correctAnswers: number,
    timeTaken: number,
  ) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const scorePercentage = (correctAnswers / totalQuestions) * 100;

      const { error } = await supabase.from("user_quiz_attempts").insert({
        user_id: user.id,
        category: category || null,
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        score_percentage: scorePercentage,
        time_taken_seconds: timeTaken,
      });

      if (error) throw error;
    } catch (err: any) {
      console.error("Error saving quiz attempt:", err);
      throw err;
    }
  };

  // Save individual question progress
  const saveQuestionProgress = async (
    questionId: string,
    isCorrect: boolean,
    userAnswer: string,
  ) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase.from("user_question_progress").insert({
        user_id: user.id,
        question_id: questionId,
        is_correct: isCorrect,
        user_answer: userAnswer,
      });

      if (error) throw error;
    } catch (err: any) {
      console.error("Error saving question progress:", err);
      throw err;
    }
  };

  // Get user's quiz history
  const getUserQuizHistory = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("user_quiz_attempts")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });

      if (error) throw error;
      return data as UserQuizAttempt[];
    } catch (err: any) {
      console.error("Error fetching quiz history:", err);
      return [];
    }
  };

  // Get all unique categories
  const getCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("questions")
        .select("category")
        .eq("is_active", true);

      if (error) throw error;

      const uniqueCategories = [...new Set(data.map((q) => q.category))];
      return uniqueCategories;
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      return [];
    }
  };

  return {
    questions,
    loading,
    error,
    fetchQuestions,
    fetchQuestionsByCategory,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    toggleQuestionActive,
    saveQuizAttempt,
    saveQuestionProgress,
    getUserQuizHistory,
    getCategories,
  };
};
