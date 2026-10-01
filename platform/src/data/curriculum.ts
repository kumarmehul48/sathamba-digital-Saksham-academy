// 26-week curriculum - fallback data (identical to supabase/seed.sql).
// At runtime the app prefers the database (admin-editable); this file keeps
// the public site working before the database is connected.
export interface WeekData { week: number; module: number; title: string; topics: string[]; }
export const MODULES = [
  { module: 1, title: 'Digital Foundation', start: 1, end: 4 },
  { module: 2, title: 'Internet & Digital Safety', start: 5, end: 7 },
  { module: 3, title: 'Office Productivity', start: 8, end: 14 },
  { module: 4, title: 'Cloud & Online Productivity', start: 15, end: 16 },
  { module: 5, title: 'AI Skills', start: 17, end: 20 },
  { module: 6, title: 'Practical Project Development', start: 21, end: 23 },
  { module: 7, title: 'Portfolio & Course Completion', start: 24, end: 26 },
] as const;

export const WEEKS: WeekData[] = [
  { week: 1, module: 1, title: 'Orientation & Digital Foundation', topics: ['Academy orientation', 'Course introduction', 'Learning journey overview', 'Introduction to digital world', 'Basic digital awareness', 'Learning rules and expectations'] },
  { week: 2, module: 1, title: 'Computer Fundamentals', topics: ['Introduction to computers', 'Hardware basics', 'Software basics', 'Input/output devices', 'Basic computer components', 'Files/folders introduction'] },
  { week: 3, module: 1, title: 'Operating System Skills', topics: ['Understanding operating system', 'Desktop/icons', 'Basic system navigation', 'Opening/closing applications', 'Files/folders management', 'Basic system settings'] },
  { week: 4, module: 1, title: 'Keyboard & Typing Skills', topics: ['Keyboard layout', 'Basic typing techniques', 'Finger positioning', 'Typing practice', 'Accuracy improvement', 'Typing speed development'] },
  { week: 5, module: 2, title: 'Internet Fundamentals', topics: ['What is internet', 'Web browsers', 'Websites/webpages', 'Search engines', 'Searching for information', 'Understanding online information'] },
  { week: 6, module: 2, title: 'Digital Communication', topics: ['Introduction to digital communication', 'Email basics', 'Sending/receiving emails', 'Online communication practices', 'Responsible communication', 'Digital communication etiquette'] },
  { week: 7, module: 2, title: 'Digital Safety', topics: ['Strong passwords', 'Privacy basics', 'Safe internet browsing', 'Online scams awareness', 'Responsible online behavior', 'Personal data protection'] },
  { week: 8, module: 3, title: 'Word Processing I', topics: ['Introduction to word processing', 'Creating documents', 'Editing text', 'Basic formatting', 'Fonts/paragraphs', 'Saving documents'] },
  { week: 9, module: 3, title: 'Word Processing II', topics: ['Advanced document formatting', 'Page layout', 'Professional document preparation', 'Tables/structured content', 'Practical document tasks', 'Document improvement'] },
  { week: 10, module: 3, title: 'Spreadsheets I', topics: ['Introduction to spreadsheets', 'Rows/columns', 'Cells/worksheets', 'Data entry', 'Basic formatting', 'Organizing information'] },
  { week: 11, module: 3, title: 'Spreadsheets II', topics: ['Introduction to formulas', 'Basic calculations', 'Functions', 'Practical data work', 'Using spreadsheet formulas', 'Improving productivity'] },
  { week: 12, module: 3, title: 'Spreadsheets III', topics: ['Tables/data organization', 'Data analysis basics', 'Practical spreadsheet tasks', 'Structured data', 'Productivity applications', 'Real-world spreadsheet practice'] },
  { week: 13, module: 3, title: 'Presentations I', topics: ['Introduction to presentations', 'Creating slides', 'Slide layouts', 'Adding text/images', 'Basic presentation design', 'Organizing presentation content'] },
  { week: 14, module: 3, title: 'Presentations II', topics: ['Improving slide design', 'Professional presentations', 'Presentation structure', 'Visual communication', 'Presentation project', 'Independent practical work'] },
  { week: 15, module: 4, title: 'Cloud & File Management', topics: ['Introduction to cloud storage', 'Uploading files', 'Organizing cloud files', 'File sharing', 'Access/permissions basics', 'Digital file management'] },
  { week: 16, module: 4, title: 'Online Productivity', topics: ['Introduction to online productivity tools', 'Online collaboration', 'Digital work practices', 'Using online tools', 'Everyday productivity', 'Practical online tasks'] },
  { week: 17, module: 5, title: 'Introduction to AI', topics: ['What is AI', 'Basic AI concepts', 'Examples of AI', 'AI in everyday life', 'Understanding AI tools', 'Responsible awareness of AI'] },
  { week: 18, module: 5, title: 'AI Tools for Productivity', topics: ['Introduction to practical AI tools', 'AI for everyday tasks', 'AI-assisted productivity', 'Writing/planning support', 'Using prompts', 'Practical AI activities'] },
  { week: 19, module: 5, title: 'AI for Content & Learning', topics: ['AI for learning', 'AI for research support', 'AI-assisted writing', 'Content creation support', 'AI as learning assistant', 'Reviewing AI-generated information'] },
  { week: 20, module: 5, title: 'Responsible AI & Verification', topics: ['AI accuracy', 'Verifying AI output', 'AI ethics basics', 'Privacy and AI', 'Responsible AI use', 'Safe use of AI tools'] },
  { week: 21, module: 6, title: 'Digital Project Planning', topics: ['Understanding digital projects', 'Selecting project idea', 'Defining project goals', 'Planning project tasks', 'Creating project roadmap', 'Preparing for development'] },
  { week: 22, module: 6, title: 'Project Development I', topics: ['Starting practical project work', 'Applying learned digital skills', 'Creating first project version', 'Practical implementation', 'Testing initial work', 'Receiving feedback'] },
  { week: 23, module: 6, title: 'Project Development II', topics: ['Improving project', 'Solving problems', 'Finalizing project work', 'Project documentation', 'Reviewing completed work', 'Preparing final output'] },
  { week: 24, module: 7, title: 'Portfolio & Career Readiness', topics: ['Understanding digital portfolio', 'Collecting project evidence', 'Organizing completed work', 'Presenting skills', 'Career readiness', 'Preparing student portfolio'] },
  { week: 25, module: 7, title: 'Final Assessment Preparation', topics: ['Course revision', 'Reviewing key computer skills', 'Office productivity review', 'AI skills review', 'Practical exercises', 'Final assessment preparation'] },
  { week: 26, module: 7, title: 'Final Assessment & Course Completion', topics: ['Final practical assessment', 'Skills demonstration', 'Final project review', 'Overall course evaluation', 'Course completion review', 'Certificate/completion process'] },
];

// Fetch weeks from DB (admin-editable); fall back to local data if DB unavailable.
export async function fetchWeeks(): Promise<WeekData[]> {
  try {
    const { supabase } = await import('../lib/supabaseClient');
    const { data, error } = await supabase
      .from('weeks')
      .select('week_number, title, topics, modules(module_number)')
      .eq('is_published', true)
      .order('week_number');
    if (!error && data && data.length > 0) {
      return data.map((w: any) => ({
        week: w.week_number, title: w.title, topics: w.topics ?? [],
        module: w.modules?.module_number ?? 1,
      }));
    }
  } catch { /* DB not configured - use fallback */ }
  return WEEKS;
}
