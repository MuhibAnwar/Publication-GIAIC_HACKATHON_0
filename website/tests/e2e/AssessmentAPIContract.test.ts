// website/tests\e2e\AssessmentAPIContract.test.ts
// Contract test for assessment API endpoints from assessment-api.yaml

import { test, expect, request, APIRequestContext } from '@playwright/test';

test.describe('Assessment API Contract Tests', () => {
  let apiContext: APIRequestContext;

  test.beforeAll(async () => {
    apiContext = await request.newContext({
      baseURL: 'https://api.physical-ai-textbook.com/v1',
      extraHTTPHeaders: {
        'Authorization': 'Bearer test-jwt-token',
        'Content-Type': 'application/json',
      },
    });
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test('GET /exercises/{exerciseId} returns proper response structure', async () => {
    const exerciseId = 'ex_123';
    const response = await apiContext.get(`/exercises/${exerciseId}`);

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    
    // Verify response structure according to assessment-api.yaml
    expect(responseBody).toHaveProperty('id');
    expect(responseBody).toHaveProperty('type');
    expect(responseBody).toHaveProperty('question');
    expect(responseBody).toHaveProperty('options');
    expect(responseBody).toHaveProperty('associatedChapter');
    expect(responseBody).toHaveProperty('difficulty');
    
    // Verify specific property types
    expect(typeof responseBody.id).toBe('string');
    expect(typeof responseBody.type).toBe('string');
    expect(typeof responseBody.question).toBe('string');
    expect(Array.isArray(responseBody.options)).toBe(true);
    expect(typeof responseBody.associatedChapter).toBe('string');
    expect(typeof responseBody.difficulty).toBe('string');
  });

  test('POST /assessments/{exerciseId}/submit processes exercise answers correctly', async () => {
    const exerciseId = 'ex_123';
    const requestBody = {
      answer: 'selected_option_A',
      studentId: 'student_12345',
      timestamp: new Date().toISOString()
    };
    
    const response = await apiContext.post(`/assessments/${exerciseId}/submit`, {
      data: requestBody
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    
    // Verify response structure according to assessment-api.yaml
    expect(responseBody).toHaveProperty('success');
    expect(responseBody).toHaveProperty('result');
    
    const result = responseBody.result;
    expect(result).toHaveProperty('exerciseId');
    expect(result).toHaveProperty('isCorrect');
    expect(result).toHaveProperty('feedback');
    expect(result).toHaveProperty('score');
    expect(result).toHaveProperty('completedAt');
    
    // Verify specific property types
    expect(responseBody.success).toBe(true);
    expect(typeof result.exerciseId).toBe('string');
    expect(typeof result.isCorrect).toBe('boolean');
    expect(typeof result.feedback).toBe('string');
    expect(typeof result.score).toBe('number');
    expect(typeof result.completedAt).toBe('string'); // ISO date string
    
    // Verify score is between 0 and 1
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(1);
  });

  test('GET /students/{studentId}/progress returns proper progress structure', async () => {
    const studentId = 'student_12345';
    const response = await apiContext.get(`/students/${studentId}/progress`);

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    
    // Verify response structure according to assessment-api.yaml
    expect(responseBody).toHaveProperty('studentId');
    expect(responseBody).toHaveProperty('courses');
    
    // Verify studentId matches
    expect(responseBody.studentId).toBe(studentId);
    
    // Check courses structure if exists
    if (responseBody.courses && responseBody.courses.length > 0) {
      const firstCourse = responseBody.courses[0];
      expect(firstCourse).toHaveProperty('courseId');
      expect(firstCourse).toHaveProperty('progress');
      
      const progress = firstCourse.progress;
      expect(progress).toHaveProperty('completedChapters');
      expect(progress).toHaveProperty('totalChapters');
      expect(progress).toHaveProperty('exercisesCompleted');
      expect(progress).toHaveProperty('totalExercises');
      expect(progress).toHaveProperty('overallScore');
    }
  });

  test('POST /students/{studentId}/chapters/{chapterId}/progress updates progress correctly', async () => {
    const studentId = 'student_12345';
    const chapterId = 'module-3-isaac';
    const requestBody = {
      chapterId: chapterId,
      status: 'completed',
      timeSpent: 3600,
      exercisesCompleted: ['ex_101', 'ex_102'],
      exerciseScores: {
        'ex_101': 1.0,
        'ex_102': 0.8
      }
    };
    
    const response = await apiContext.post(`/students/${studentId}/chapters/${chapterId}/progress`, {
      data: requestBody
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    
    // Verify response structure according to assessment-api.yaml
    expect(responseBody).toHaveProperty('success');
    expect(responseBody.success).toBe(true);
    
    expect(responseBody).toHaveProperty('progressRecord');
    const progressRecord = responseBody.progressRecord;
    
    expect(progressRecord).toHaveProperty('studentId');
    expect(progressRecord).toHaveProperty('chapterId');
    expect(progressRecord).toHaveProperty('status');
    expect(progressRecord).toHaveProperty('timeSpent');
    expect(progressRecord).toHaveProperty('updatedAt');
    
    // Verify values match what we sent
    expect(progressRecord.studentId).toBe(studentId);
    expect(progressRecord.chapterId).toBe(chapterId);
    expect(progressRecord.status).toBe('completed');
    expect(progressRecord.timeSpent).toBe(3600);
  });

  test('returns proper error structure for invalid requests', async () => {
    // Test with invalid exercise ID
    const response = await apiContext.get('/exercises/invalid_exercise_id_that_does_not_exist');

    // Could be 404 or 400 depending on implementation
    expect([400, 404]).toContain(response.status());

    const responseBody = await response.json();
    
    // Verify error response structure according to assessment-api.yaml
    expect(responseBody).toHaveProperty('error');
    expect(responseBody.error).toHaveProperty('code');
    expect(responseBody.error).toHaveProperty('message');
    // details might be optional
  });

  test('respects CORS policy for allowed origins', async () => {
    const response = await apiContext.get('/exercises/ex_123', {
      headers: {
        'Origin': 'https://textbook.physical-ai-textbook.com'
      }
    });

    // Check if CORS headers are set correctly (implementation-dependent)
    const corsHeader = response.headers()['access-control-allow-origin'];
    expect(corsHeader).toBe('https://textbook.physical-ai-textbook.com');
  });
});