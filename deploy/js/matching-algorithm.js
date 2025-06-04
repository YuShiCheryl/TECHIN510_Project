/**
 * StudySync Matching Algorithm
 * Machine Learning-based student matching system
 * Priority: 1. Availability (40%) 2. Academic Info (35%) 3. Study Preferences (25%)
 */

// Mock user database
const MOCK_USERS = [
  {
    id: 'user001',
    name: 'Sarah Chen',
    email: 'sarah.chen@university.edu',
    avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"%3E%3Ccircle cx="25" cy="25" r="25" fill="%23e0f2fe"/%3E%3Ccircle cx="25" cy="20" r="8" fill="%230ea5e9"/%3E%3Cpath d="M25,50 C34,50 40,42 40,33 C40,33 37,28 25,28 C13,28 10,33 10,33 C10,42 16,50 25,50 Z" fill="%230ea5e9"/%3E%3C/svg%3E',
    academic: {
      major: 'computer-science',
      year: '3',
      courses: 'CS301, CS315, MATH240',
      gpa: '3.8',
      goals: 'Machine learning and AI research'
    },
    preferences: {
      learningStyles: ['visual', 'kinesthetic'],
      environments: ['library', 'study-room'],
      methods: ['discussion', 'practice-problems'],
      personality: ['organized', 'collaborative'],
      sessionDuration: '90-120'
    },
    availability: {
      timeSlots: [
        { day: 'mon', time: '14:00' },
        { day: 'tue', time: '10:00' },
        { day: 'wed', time: '14:00' },
        { day: 'thu', time: '16:00' },
        { day: 'fri', time: '10:00' }
      ],
      location: 'on-campus',
      notes: 'Prefer morning/afternoon sessions'
    }
  },
  {
    id: 'user002',
    name: 'Marcus Johnson',
    email: 'marcus.j@university.edu',
    avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"%3E%3Ccircle cx="25" cy="25" r="25" fill="%23f3e8ff"/%3E%3Ccircle cx="25" cy="20" r="8" fill="%23a855f7"/%3E%3Cpath d="M25,50 C34,50 40,42 40,33 C40,33 37,28 25,28 C13,28 10,33 10,33 C10,42 16,50 25,50 Z" fill="%23a855f7"/%3E%3C/svg%3E',
    academic: {
      major: 'mathematics',
      year: '2',
      courses: 'MATH240, MATH301, STAT200',
      gpa: '3.9',
      goals: 'Data science and statistics'
    },
    preferences: {
      learningStyles: ['visual', 'reading'],
      environments: ['library', 'cafe'],
      methods: ['note-taking', 'practice-problems'],
      personality: ['organized', 'introvert'],
      sessionDuration: '60-90'
    },
    availability: {
      timeSlots: [
        { day: 'mon', time: '16:00' },
        { day: 'tue', time: '14:00' },
        { day: 'wed', time: '16:00' },
        { day: 'thu', time: '10:00' },
        { day: 'sat', time: '10:00' }
      ],
      location: 'library',
      notes: 'Quiet study environments preferred'
    }
  },
  {
    id: 'user003',
    name: 'Emma Rodriguez',
    email: 'emma.r@university.edu',
    avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"%3E%3Ccircle cx="25" cy="25" r="25" fill="%23fce7f3"/%3E%3Ccircle cx="25" cy="20" r="8" fill="%23ec4899"/%3E%3Cpath d="M25,50 C34,50 40,42 40,33 C40,33 37,28 25,28 C13,28 10,33 10,33 C10,42 16,50 25,50 Z" fill="%23ec4899"/%3E%3C/svg%3E',
    academic: {
      major: 'engineering',
      year: '3',
      courses: 'ENG301, MATH240, PHYS201',
      gpa: '3.7',
      goals: 'Mechanical engineering and design'
    },
    preferences: {
      learningStyles: ['kinesthetic', 'visual'],
      environments: ['study-room', 'home'],
      methods: ['practice-problems', 'teaching'],
      personality: ['collaborative', 'extrovert'],
      sessionDuration: '90-120'
    },
    availability: {
      timeSlots: [
        { day: 'mon', time: '10:00' },
        { day: 'tue', time: '16:00' },
        { day: 'wed', time: '10:00' },
        { day: 'fri', time: '14:00' },
        { day: 'sat', time: '14:00' }
      ],
      location: 'flexible',
      notes: 'Available for group projects'
    }
  },
  {
    id: 'user004',
    name: 'David Kim',
    email: 'david.kim@university.edu',
    avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"%3E%3Ccircle cx="25" cy="25" r="25" fill="%23fef9c3"/%3E%3Ccircle cx="25" cy="20" r="8" fill="%23eab308"/%3E%3Cpath d="M25,50 C34,50 40,42 40,33 C40,33 37,28 25,28 C13,28 10,33 10,33 C10,42 16,50 25,50 Z" fill="%23eab308"/%3E%3C/svg%3E',
    academic: {
      major: 'computer-science',
      year: '4',
      courses: 'CS401, CS315, CS350',
      gpa: '3.6',
      goals: 'Software development and web technologies'
    },
    preferences: {
      learningStyles: ['auditory', 'kinesthetic'],
      environments: ['cafe', 'study-room'],
      methods: ['discussion', 'teaching'],
      personality: ['extrovert', 'flexible'],
      sessionDuration: '60-90'
    },
    availability: {
      timeSlots: [
        { day: 'tue', time: '10:00' },
        { day: 'wed', time: '14:00' },
        { day: 'thu', time: '16:00' },
        { day: 'fri', time: '10:00' },
        { day: 'sun', time: '14:00' }
      ],
      location: 'coffee-shops',
      notes: 'Prefer collaborative sessions'
    }
  },
  {
    id: 'user005',
    name: 'Lisa Zhang',
    email: 'lisa.zhang@university.edu',
    avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"%3E%3Ccircle cx="25" cy="25" r="25" fill="%23dcfce7"/%3E%3Ccircle cx="25" cy="20" r="8" fill="%2322c55e"/%3E%3Cpath d="M25,50 C34,50 40,42 40,33 C40,33 37,28 25,28 C13,28 10,33 10,33 C10,42 16,50 25,50 Z" fill="%2322c55e"/%3E%3C/svg%3E',
    academic: {
      major: 'psychology',
      year: '2',
      courses: 'PSY201, PSY240, STAT200',
      gpa: '3.9',
      goals: 'Clinical psychology and research'
    },
    preferences: {
      learningStyles: ['reading', 'auditory'],
      environments: ['library', 'home'],
      methods: ['note-taking', 'discussion'],
      personality: ['organized', 'collaborative'],
      sessionDuration: '90-120'
    },
    availability: {
      timeSlots: [
        { day: 'mon', time: '14:00' },
        { day: 'tue', time: '10:00' },
        { day: 'thu', time: '14:00' },
        { day: 'fri', time: '16:00' },
        { day: 'sat', time: '10:00' }
      ],
      location: 'library',
      notes: 'Focus on research methods and statistics'
    }
  },
  {
    id: 'user006',
    name: 'Alex Thompson',
    email: 'alex.t@university.edu',
    avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"%3E%3Ccircle cx="25" cy="25" r="25" fill="%23fee2e2"/%3E%3Ccircle cx="25" cy="20" r="8" fill="%23ef4444"/%3E%3Cpath d="M25,50 C34,50 40,42 40,33 C40,33 37,28 25,28 C13,28 10,33 10,33 C10,42 16,50 25,50 Z" fill="%23ef4444"/%3E%3C/svg%3E',
    academic: {
      major: 'business',
      year: '3',
      courses: 'BUS301, ECON200, STAT200',
      gpa: '3.5',
      goals: 'Finance and entrepreneurship'
    },
    preferences: {
      learningStyles: ['visual', 'auditory'],
      environments: ['cafe', 'study-room'],
      methods: ['discussion', 'flashcards'],
      personality: ['extrovert', 'competitive'],
      sessionDuration: '60-90'
    },
    availability: {
      timeSlots: [
        { day: 'mon', time: '16:00' },
        { day: 'wed', time: '10:00' },
        { day: 'thu', time: '14:00' },
        { day: 'fri', time: '16:00' },
        { day: 'sun', time: '10:00' }
      ],
      location: 'flexible',
      notes: 'Available for business case studies'
    }
  }
];

// Weights for different matching criteria (must sum to 1.0)
const MATCHING_WEIGHTS = {
  availability: 0.40,    // 40% - Top priority
  academic: 0.35,        // 35% - Academic compatibility
  preferences: 0.25      // 25% - Study preferences
};

/**
 * Main matching algorithm
 * @param userProfile - Current user's profile data
 * @param maxResults - Maximum number of matches to return
 * @returns Array of matches sorted by compatibility score
 */
function findStudyMatches(userProfile, maxResults = 10) {
  const matches = [];
  
  // Calculate compatibility with each mock user
  MOCK_USERS.forEach(mockUser => {
    const score = calculateCompatibilityScore(userProfile, mockUser);
    
    matches.push({
      user: mockUser,
      compatibility: score,
      reasons: generateMatchReasons(userProfile, mockUser, score)
    });
  });
  
  // Sort by compatibility score (highest first)
  matches.sort((a, b) => b.compatibility.total - a.compatibility.total);
  
  // Return top matches
  return matches.slice(0, maxResults);
}

/**
 * Calculate comprehensive compatibility score between two users
 * @param user1 - First user profile
 * @param user2 - Second user profile
 * @returns Object with detailed compatibility scores
 */
function calculateCompatibilityScore(user1, user2) {
  const availabilityScore = calculateAvailabilityCompatibility(user1.availability, user2.availability);
  const academicScore = calculateAcademicCompatibility(user1.academic, user2.academic);
  const preferencesScore = calculatePreferencesCompatibility(user1.preferences, user2.preferences);
  
  const totalScore = (
    availabilityScore * MATCHING_WEIGHTS.availability +
    academicScore * MATCHING_WEIGHTS.academic +
    preferencesScore * MATCHING_WEIGHTS.preferences
  );
  
  return {
    total: Math.round(totalScore),
    availability: Math.round(availabilityScore),
    academic: Math.round(academicScore),
    preferences: Math.round(preferencesScore)
  };
}

/**
 * Calculate availability compatibility (TOP PRIORITY)
 * Factors: overlapping time slots, location compatibility, schedule flexibility
 */
function calculateAvailabilityCompatibility(avail1, avail2) {
  if (!avail1 || !avail2) return 0;
  
  let score = 0;
  
  // 1. Time slot overlap (70% of availability score)
  const timeOverlapScore = calculateTimeOverlap(avail1.timeSlots, avail2.timeSlots);
  score += timeOverlapScore * 0.7;
  
  // 2. Location compatibility (20% of availability score)
  const locationScore = calculateLocationCompatibility(avail1.location, avail2.location);
  score += locationScore * 0.2;
  
  // 3. Schedule flexibility (10% of availability score)
  const flexibilityScore = calculateScheduleFlexibility(avail1, avail2);
  score += flexibilityScore * 0.1;
  
  return score;
}

/**
 * Calculate time slot overlap between two users
 */
function calculateTimeOverlap(slots1, slots2) {
  if (!slots1 || !slots2 || slots1.length === 0 || slots2.length === 0) return 0;
  
  const overlappingSlots = [];
  
  slots1.forEach(slot1 => {
    slots2.forEach(slot2 => {
      if (slot1.day === slot2.day) {
        // Check if times are within 2 hours of each other
        const time1 = parseInt(slot1.time.replace(':', ''));
        const time2 = parseInt(slot2.time.replace(':', ''));
        const timeDiff = Math.abs(time1 - time2);
        
        if (timeDiff <= 200) { // Within 2 hours
          overlappingSlots.push({ day: slot1.day, time1: slot1.time, time2: slot2.time });
        }
      }
    });
  });
  
  // Calculate overlap percentage
  const maxPossibleOverlaps = Math.min(slots1.length, slots2.length);
  const overlapRatio = overlappingSlots.length / maxPossibleOverlaps;
  
  return Math.min(overlapRatio * 100, 100);
}

/**
 * Calculate location compatibility
 */
function calculateLocationCompatibility(loc1, loc2) {
  if (!loc1 || !loc2) return 50;
  
  const locationCompatibility = {
    'on-campus': ['library', 'student-center', 'study-room'],
    'library': ['on-campus', 'study-room'],
    'student-center': ['on-campus', 'study-room'],
    'coffee-shops': ['cafe', 'flexible'],
    'online': ['flexible'],
    'flexible': ['on-campus', 'library', 'coffee-shops', 'cafe', 'study-room'],
    'cafe': ['coffee-shops', 'flexible'],
    'study-room': ['on-campus', 'library', 'flexible'],
    'home': ['online', 'flexible'],
    'outdoors': ['flexible']
  };
  
  if (loc1 === loc2) return 100;
  if (locationCompatibility[loc1]?.includes(loc2)) return 80;
  if (loc1 === 'flexible' || loc2 === 'flexible') return 70;
  
  return 30;
}

/**
 * Calculate schedule flexibility based on number of available slots
 */
function calculateScheduleFlexibility(avail1, avail2) {
  const slots1Count = avail1.timeSlots?.length || 0;
  const slots2Count = avail2.timeSlots?.length || 0;
  
  // More available slots = higher flexibility
  const avgSlots = (slots1Count + slots2Count) / 2;
  return Math.min(avgSlots * 15, 100); // Max 100%
}

/**
 * Calculate academic compatibility
 * Factors: major similarity, year compatibility, course overlap, GPA difference
 */
function calculateAcademicCompatibility(acad1, acad2) {
  if (!acad1 || !acad2) return 0;
  
  let score = 0;
  
  // 1. Major compatibility (40% of academic score)
  const majorScore = calculateMajorCompatibility(acad1.major, acad2.major);
  score += majorScore * 0.4;
  
  // 2. Year compatibility (20% of academic score)
  const yearScore = calculateYearCompatibility(acad1.year, acad2.year);
  score += yearScore * 0.2;
  
  // 3. Course overlap (30% of academic score)
  const courseScore = calculateCourseOverlap(acad1.courses, acad2.courses);
  score += courseScore * 0.3;
  
  // 4. GPA compatibility (10% of academic score)
  const gpaScore = calculateGPACompatibility(acad1.gpa, acad2.gpa);
  score += gpaScore * 0.1;
  
  return score;
}

/**
 * Calculate major compatibility
 */
function calculateMajorCompatibility(major1, major2) {
  if (!major1 || !major2) return 50;
  
  const majorGroups = {
    'stem': ['computer-science', 'engineering', 'mathematics', 'physics', 'chemistry'],
    'social': ['psychology', 'sociology', 'history', 'english'],
    'business': ['business', 'economics'],
    'life-sciences': ['biology', 'chemistry', 'psychology']
  };
  
  if (major1 === major2) return 100;
  
  // Check if majors are in same group
  for (const group of Object.values(majorGroups)) {
    if (group.includes(major1) && group.includes(major2)) {
      return 80;
    }
  }
  
  return 40;
}

/**
 * Calculate year compatibility (prefer same or adjacent years)
 */
function calculateYearCompatibility(year1, year2) {
  if (!year1 || !year2) return 50;
  
  const yearValues = { '1': 1, '2': 2, '3': 3, '4': 4, 'graduate': 5 };
  const y1 = yearValues[year1] || 0;
  const y2 = yearValues[year2] || 0;
  
  const yearDiff = Math.abs(y1 - y2);
  
  if (yearDiff === 0) return 100;
  if (yearDiff === 1) return 80;
  if (yearDiff === 2) return 60;
  return 30;
}

/**
 * Calculate course overlap
 */
function calculateCourseOverlap(courses1, courses2) {
  if (!courses1 || !courses2) return 0;
  
  const parseCourses = (courseStr) => {
    return courseStr.split(/[,\n]/).map(c => c.trim().toUpperCase()).filter(c => c.length > 0);
  };
  
  const c1 = parseCourses(courses1);
  const c2 = parseCourses(courses2);
  
  if (c1.length === 0 && c2.length === 0) return 50;
  if (c1.length === 0 || c2.length === 0) return 20;
  
  const overlap = c1.filter(course => c2.includes(course));
  const union = [...new Set([...c1, ...c2])];
  
  return (overlap.length / union.length) * 100;
}

/**
 * Calculate GPA compatibility (closer GPAs = better match)
 */
function calculateGPACompatibility(gpa1, gpa2) {
  if (!gpa1 || !gpa2) return 70;
  
  const g1 = parseFloat(gpa1) || 0;
  const g2 = parseFloat(gpa2) || 0;
  
  const diff = Math.abs(g1 - g2);
  
  if (diff <= 0.2) return 100;
  if (diff <= 0.5) return 80;
  if (diff <= 1.0) return 60;
  return 30;
}

/**
 * Calculate study preferences compatibility
 * Factors: learning styles, environments, methods, personality, session duration
 */
function calculatePreferencesCompatibility(pref1, pref2) {
  if (!pref1 || !pref2) return 0;
  
  let score = 0;
  
  // 1. Learning styles overlap (25%)
  const learningScore = calculateArrayOverlap(pref1.learningStyles, pref2.learningStyles);
  score += learningScore * 0.25;
  
  // 2. Environment preferences overlap (25%)
  const environmentScore = calculateArrayOverlap(pref1.environments, pref2.environments);
  score += environmentScore * 0.25;
  
  // 3. Study methods overlap (20%)
  const methodsScore = calculateArrayOverlap(pref1.methods, pref2.methods);
  score += methodsScore * 0.2;
  
  // 4. Personality compatibility (20%)
  const personalityScore = calculatePersonalityCompatibility(pref1.personality, pref2.personality);
  score += personalityScore * 0.2;
  
  // 5. Session duration compatibility (10%)
  const durationScore = calculateDurationCompatibility(pref1.sessionDuration, pref2.sessionDuration);
  score += durationScore * 0.1;
  
  return score;
}

/**
 * Calculate overlap between two arrays
 */
function calculateArrayOverlap(arr1, arr2) {
  if (!arr1 || !arr2 || arr1.length === 0 || arr2.length === 0) return 30;
  
  const overlap = arr1.filter(item => arr2.includes(item));
  const union = [...new Set([...arr1, ...arr2])];
  
  return (overlap.length / union.length) * 100;
}

/**
 * Calculate personality compatibility (extrovert-introvert balance)
 */
function calculatePersonalityCompatibility(pers1, pers2) {
  if (!pers1 || !pers2) return 50;
  
  const hasIntrovert1 = pers1.includes('introvert');
  const hasExtrovert1 = pers1.includes('extrovert');
  const hasIntrovert2 = pers2.includes('introvert');
  const hasExtrovert2 = pers2.includes('extrovert');
  
  // Base overlap score
  let score = calculateArrayOverlap(pers1, pers2);
  
  // Bonus for complementary intro/extrovert pairing
  if ((hasIntrovert1 && hasExtrovert2) || (hasExtrovert1 && hasIntrovert2)) {
    score += 10;
  }
  
  return Math.min(score, 100);
}

/**
 * Calculate session duration compatibility
 */
function calculateDurationCompatibility(dur1, dur2) {
  if (!dur1 || !dur2) return 50;
  
  const durations = {
    '30-60': 1,
    '60-90': 2,
    '90-120': 3,
    '120+': 4
  };
  
  const d1 = durations[dur1] || 2;
  const d2 = durations[dur2] || 2;
  
  const diff = Math.abs(d1 - d2);
  
  if (diff === 0) return 100;
  if (diff === 1) return 80;
  if (diff === 2) return 60;
  return 40;
}

/**
 * Generate human-readable match reasons
 */
function generateMatchReasons(user1, user2, scores) {
  const reasons = [];
  
  // Availability reasons
  if (scores.availability >= 70) {
    reasons.push('🕒 Great schedule compatibility');
  } else if (scores.availability >= 50) {
    reasons.push('🕒 Some schedule overlap');
  }
  
  // Academic reasons
  if (scores.academic >= 80) {
    if (user1.academic?.major === user2.academic?.major) {
      reasons.push('🎓 Same major');
    } else {
      reasons.push('📚 Related academic field');
    }
  }
  
  // Preferences reasons
  if (scores.preferences >= 70) {
    reasons.push('✨ Similar study preferences');
  }
  
  // Location compatibility
  if (user1.availability?.location === user2.availability?.location) {
    reasons.push('📍 Same preferred location');
  }
  
  // Course overlap
  if (user1.academic?.courses && user2.academic?.courses) {
    const overlap = calculateCourseOverlap(user1.academic.courses, user2.academic.courses);
    if (overlap >= 30) {
      reasons.push('📖 Shared courses');
    }
  }
  
  return reasons.slice(0, 3); // Max 3 reasons
}

/**
 * Get personalized match recommendations
 * This is the main function to call from the matches page
 */
function getPersonalizedMatches(userProfile) {
  if (!userProfile || !userProfile.academic || !userProfile.availability) {
    return {
      matches: [],
      message: 'Please complete your profile to find study matches.',
      completionNeeded: ['academic', 'availability', 'preferences']
    };
  }
  
  const matches = findStudyMatches(userProfile, 6);
  
  return {
    matches: matches,
    message: `Found ${matches.length} potential study partners based on your profile.`,
    algorithm: {
      weights: MATCHING_WEIGHTS,
      factors: 'Availability (40%), Academic Info (35%), Study Preferences (25%)'
    }
  };
}

// Export functions for use in other files
if (typeof window !== 'undefined') {
  window.MatchingAlgorithm = {
    getPersonalizedMatches,
    findStudyMatches,
    calculateCompatibilityScore,
    MOCK_USERS,
    MATCHING_WEIGHTS
  };
} 