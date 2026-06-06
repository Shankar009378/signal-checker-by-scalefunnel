/* ==============================================
   Signal Checker by Scale Funnel — Popup Script
   ============================================== */

(() => {
  'use strict';

  // ─── Heading Analysis ────────────────────────
  const TARGET_ROLE_KEYWORDS = [
    'developer', 'software engineer', 'frontend developer', 'backend developer',
    'data analyst', 'data scientist', 'product manager', 'designer',
    'marketing', 'sales', 'consultant', 'intern'
  ];

  const TOOL_KEYWORDS = [
    'python', 'java', 'javascript', 'react', 'node', 'sql',
    'excel', 'power bi', 'figma', 'aws', 'docker'
  ];

  const INTENT_KEYWORDS = [
    'open to work', 'seeking opportunities', 'looking for internship',
    'looking for opportunities', 'aspiring', 'open to internship',
    'available', 'hiring', 'open to roles', 'fresher', 'entry level'
  ];

  /**
   * Calculate headline score out of 20.
   * +10 for target role keywords, +5 for tools, +5 for intent.
   */
  function calculateHeadlineScore(headline) {
    if (!headline || typeof headline !== 'string') return 0;

    const lower = headline.toLowerCase();
    let score = 0;

    const hasTargetRole = TARGET_ROLE_KEYWORDS.some(kw => lower.includes(kw));
    if (hasTargetRole) score += 10;

    const hasTool = TOOL_KEYWORDS.some(kw => lower.includes(kw));
    if (hasTool) score += 5;

    const hasIntent = INTENT_KEYWORDS.some(kw => lower.includes(kw));
    if (hasIntent) score += 5;

    return Math.min(score, 20);
  }

  // ─── Photo Score ──────────────────────────────
  function calculatePhotoScore(hasPhoto) {
    return hasPhoto ? 10 : 0;
  }

  // ─── Featured Score ──────────────────────────
  function calculateFeaturedScore(hasFeatured) {
    return hasFeatured ? 20 : 0;
  }

  // ─── About Score ──────────────────────────────
  function calculateAboutScore(aboutText) {
    if (!aboutText || typeof aboutText !== 'string') return 0;
    const wordCount = aboutText.trim().split(/\s+/).length;
    if (wordCount >= 100) return 15;
    return Math.round((wordCount / 100) * 15);
  }

  // ─── Experience Score ────────────────────────
  function calculateExperienceScore(experiences) {
    if (!Array.isArray(experiences) || experiences.length === 0) return 0;

    // Detect metrics: numbers followed by unit words OR currency symbols followed by numbers
    const metricRegex = /\b\d+[\d,.]*\s*(%|users|projects|clients|revenue|growth|x|fold|people|customers|sales|leads|conversions|traffic)\b|(?:₹|\$)\s*[\d,]+|\d{2,}%|\d+x\s*growth/i;

    const hasMetrics = experiences.some(exp => {
      if (!exp.description) return false;
      return metricRegex.test(exp.description);
    });

    // Split 20 points across all experience entries
    const basePerEntry = experiences.length > 0 ? Math.min(10, Math.floor(20 / experiences.length)) : 0;
    const metricBonus = hasMetrics ? 10 : 0;

    return Math.min(basePerEntry + metricBonus, 20);
  }

  // ─── Projects Score ──────────────────────────
  function calculateProjectScore(hasProjects) {
    return hasProjects ? 15 : 0;
  }

  // ─── Total Score ─────────────────────────────
  function calculateTotalScore(data) {
    const headlineScore = calculateHeadlineScore(data.headline);
    const photoScore = calculatePhotoScore(data.hasPhoto);
    const featuredScore = calculateFeaturedScore(data.hasFeatured);
    const aboutScore = calculateAboutScore(data.about);
    const experienceScore = calculateExperienceScore(data.experiences);
    const projectScore = calculateProjectScore(data.hasProjects);

    const total = headlineScore + photoScore + featuredScore + aboutScore + experienceScore + projectScore;

    return {
      total: Math.min(total, 100),
      breakdown: {
        headline: headlineScore,
        photo: photoScore,
        featured: featuredScore,
        about: aboutScore,
        experience: experienceScore,
        projects: projectScore
      }
    };
  }

  // ─── Recommendations ────────────────────────
  function generateRecommendations(breakdown) {
    const strengths = [];
    const weaknesses = [];
    const recommendations = [];

    // Headline
    if (breakdown.headline >= 15) {
      strengths.push('Strong headline with role, tools, and intent keywords');
    } else if (breakdown.headline >= 10) {
      strengths.push('Headline includes target role keywords');
    } else {
      weaknesses.push('Headline missing target role keywords');
      recommendations.push('Add a target role (e.g., "Software Engineer") to your headline');
    }

    // Photo
    if (breakdown.photo === 10) {
      strengths.push('Professional profile photo present');
    } else {
      weaknesses.push('No profile photo detected');
      recommendations.push('Add a professional profile photo');
    }

    // Featured
    if (breakdown.featured === 20) {
      strengths.push('Featured section has content');
    } else {
      weaknesses.push('No Featured section content');
      recommendations.push('Add portfolio links, certifications, or projects to the Featured section');
    }

    // About
    if (breakdown.about >= 15) {
      strengths.push('Well-written About section');
    } else if (breakdown.about > 0) {
      weaknesses.push('About section could be more detailed');
      recommendations.push('Expand your About section to at least 100 words');
    } else {
      weaknesses.push('No About section detected');
      recommendations.push('Write an About section describing your background and goals');
    }

    // Experience
    if (breakdown.experience >= 15) {
      strengths.push('Experience includes measurable achievements');
    } else if (breakdown.experience > 0) {
      weaknesses.push('No measurable achievements in experience descriptions');
      recommendations.push('Add metrics and numbers to your experience descriptions (e.g., "Improved efficiency by 20%")');
    } else {
      weaknesses.push('No experience section detected');
      recommendations.push('Add your work experience with detailed descriptions');
    }

    // Projects
    if (breakdown.projects === 15) {
      strengths.push('Projects section present');
    } else {
      weaknesses.push('No Projects section');
      recommendations.push('Add a Projects section showcasing your work');
    }

    return { strengths, weaknesses, recommendations };
  }

  // ─── Score Color ─────────────────────────────
  function getScoreColor(score) {
    if (score <= 39) return 'var(--color-red)';
    if (score <= 69) return 'var(--color-orange)';
    return 'var(--color-green)';
  }

  function getScoreColorClass(score) {
    if (score <= 39) return 'bad';
    if (score <= 69) return 'warn';
    return 'good';
  }

  // ─── Render Results ─────────────────────────
  function renderResults(data) {
    const { total, breakdown } = calculateTotalScore(data);
    const { strengths, weaknesses, recommendations } = generateRecommendations(breakdown);

    // Score number
    const scoreEl = document.getElementById('scoreNumber');
    scoreEl.textContent = total;
    scoreEl.style.color = getScoreColor(total);

    // Score ring
    const ring = document.getElementById('scoreRing');
    const circumference = 2 * Math.PI * 54; // r=54
    const offset = circumference - (total / 100) * circumference;
    ring.style.strokeDasharray = circumference;
    ring.style.strokeDashoffset = offset;
    ring.style.stroke = getScoreColor(total);

    // Breakdown items
    const breakdownContainer = document.getElementById('scoreBreakdown');
    breakdownContainer.innerHTML = '';
    const labels = {
      headline: 'Headline',
      photo: 'Photo',
      featured: 'Featured',
      about: 'About',
      experience: 'Experience',
      projects: 'Projects'
    };
    const maxValues = {
      headline: 20,
      photo: 10,
      featured: 20,
      about: 15,
      experience: 20,
      projects: 15
    };
    Object.entries(breakdown).forEach(([key, value]) => {
      const maxVal = maxValues[key] || 20;
      const div = document.createElement('div');
      div.className = 'breakdown-item';
      div.innerHTML = `<span class="label">${labels[key]}</span><span class="value ${getScoreColorClass(value)}">${value}/${maxVal}</span>`;
      breakdownContainer.appendChild(div);
    });

    // Strengths
    const strengthsList = document.getElementById('strengthsList');
    strengthsList.innerHTML = '';
    if (strengths.length === 0) {
      strengthsList.innerHTML = '<li style="background:none;color:var(--color-text-muted);padding-left:0;">No strengths identified yet.</li>';
    } else {
      strengths.forEach(s => {
        const li = document.createElement('li');
        li.textContent = `✓ ${s}`;
        strengthsList.appendChild(li);
      });
    }

    // Weaknesses
    const weaknessesList = document.getElementById('weaknessesList');
    weaknessesList.innerHTML = '';
    if (weaknesses.length === 0) {
      weaknessesList.innerHTML = '<li style="background:none;color:var(--color-text-muted);padding-left:0;">No weaknesses found — great profile!</li>';
    } else {
      weaknesses.forEach(w => {
        const li = document.createElement('li');
        li.textContent = `✗ ${w}`;
        weaknessesList.appendChild(li);
      });
    }

    // Recommendations
    const recsList = document.getElementById('recommendationsList');
    recsList.innerHTML = '';
    if (recommendations.length === 0) {
      recsList.innerHTML = '<li style="background:none;color:var(--color-text-muted);padding-left:0;">Your profile is in great shape!</li>';
    } else {
      recommendations.forEach(r => {
        const li = document.createElement('li');
        li.textContent = r;
        recsList.appendChild(li);
      });
    }

    // CTA for low scores
    const ctaSection = document.getElementById('ctaSection');
    if (total < 80) {
      ctaSection.classList.remove('hidden');
    } else {
      ctaSection.classList.add('hidden');
    }

    // Store for export
    currentReportData = data;
    currentRecommendations = { strengths, weaknesses, recommendations };

    // Show export buttons
    document.getElementById('exportSection').classList.remove('hidden');

    // Wire up export buttons
    const dlBtn = document.getElementById('downloadReport');
    const shareBtn = document.getElementById('shareReport');

    if (dlBtn) {
      dlBtn.onclick = () => {
        const reportText = generateReportText(data, { total, breakdown }, currentRecommendations);
        downloadReport(reportText, data.name);
      };
    }

    if (shareBtn) {
      shareBtn.onclick = () => {
        const reportText = generateReportText(data, { total, breakdown }, currentRecommendations);
        shareReport(reportText, total);
      };
    }

    // Show results
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('notLinkedInState').classList.add('hidden');
    document.getElementById('extractionErrorState').classList.add('hidden');
    document.getElementById('resultsState').classList.remove('hidden');
  }

  // ─── Show Error State ────────────────────────
  function showError(stateId) {
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('notLinkedInState').classList.add('hidden');
    document.getElementById('extractionErrorState').classList.add('hidden');
    document.getElementById('resultsState').classList.add('hidden');
    document.getElementById(stateId).classList.remove('hidden');
  }

  // ─── Main ────────────────────────────────────
  async function main() {
    try {
      // Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab || !tab.url) {
        showError('notLinkedInState');
        return;
      }

      // Check if we're on a LinkedIn page
      if (!tab.url.includes('linkedin.com')) {
        showError('notLinkedInState');
        return;
      }

      // Check if it's a profile page
      if (!tab.url.includes('/in/')) {
        showError('notLinkedInState');
        return;
      }

      // Try to send a message to the content script
      const response = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('timeout')), 5000);

        chrome.tabs.sendMessage(tab.id, { action: 'extractProfile' }, (result) => {
          clearTimeout(timeout);
          const err = chrome.runtime.lastError;
          if (err) {
            reject(new Error(err.message));
            return;
          }
          resolve(result);
        });
      });

      if (!response || !response.success) {
        showError('extractionErrorState');
        return;
      }

      renderResults(response.data);
    } catch (err) {
      console.error('Signal Checker: Failed to analyze profile', err);
      showError('extractionErrorState');
    }
  }

  // ─── Initialize ──────────────────────────────
  document.addEventListener('DOMContentLoaded', main);

  // ─── Export Report ───────────────────────────
  function generateReportText(data, scoreResult, recommendations) {
    const { total, breakdown } = scoreResult;
    const date = new Date().toLocaleDateString('en-IN');

    return `
SIGNAL CHECKER REPORT — by Scale Funnel
Generated: ${date}
Profile: ${data.name || 'LinkedIn Profile'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SIGNAL SCORE: ${total}/100
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SCORE BREAKDOWN:
- Headline:   ${breakdown.headline}/20
- Photo:      ${breakdown.photo}/10
- Featured:   ${breakdown.featured}/20
- About:      ${breakdown.about}/15
- Experience: ${breakdown.experience}/20
- Projects:   ${breakdown.projects}/15

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STRENGTHS:
${recommendations.strengths.length > 0
        ? recommendations.strengths.map(s => `✓ ${s}`).join('\n')
        : 'None identified yet'}

WEAKNESSES:
${recommendations.weaknesses.length > 0
        ? recommendations.weaknesses.map(w => `✗ ${w}`).join('\n')
        : 'No weaknesses found'}

RECOMMENDATIONS:
${recommendations.recommendations.length > 0
        ? recommendations.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')
        : 'Your profile is in great shape'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Want to fix these gaps fast?

Book a 60-min Profile Fix Session — ₹999
scalefunnel.in

Free gap report: DM @shankar.scalefunnel
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Signal Checker by Scale Funnel
`.trim();
  }

  function downloadReport(reportText, name) {
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SignalChecker-${(name || 'Report').replace(/\s+/g, '-')}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function shareReport(reportText, score) {
    const shareText = `My LinkedIn Signal Score: ${score}/100 🎯\n\nChecked with Signal Checker by Scale Funnel\n\nFree tool: scalefunnel.in/signal-checker\n\n#LinkedInTips #Placement #Internship #ScaleFunnel`;

    if (navigator.share) {
      navigator.share({
        title: `My LinkedIn Signal Score: ${score}/100`,
        text: shareText,
      }).catch(() => {
        copyToClipboard(shareText);
      });
    } else {
      copyToClipboard(shareText);
      showCopiedFeedback();
    }
  }

  function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  function showCopiedFeedback() {
    const shareBtn = document.getElementById('shareReport');
    if (shareBtn) {
      shareBtn.textContent = '✓ Copied to clipboard';
      setTimeout(() => {
        shareBtn.textContent = '↗ Share Score';
      }, 2000);
    }
  }

  // Store report data globally for export
  let currentReportData = null;
  let currentScoreResult = null;
  let currentRecommendations = null;
})();
