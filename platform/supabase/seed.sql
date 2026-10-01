-- ============================================================
-- SDSA SEED DATA: Course + 7 Modules + 26-Week Curriculum
-- Run AFTER schema.sql in the Supabase SQL Editor
-- ============================================================
insert into public.courses (code, title, tagline, description, duration_weeks)
values ('SDSA-26', '26-Week Digital Skills Program',
        'Learn • Practice • Apply • Grow',
        'A complete practical digital skills journey: computer fundamentals, internet and digital safety, office productivity, cloud tools, AI skills, real projects, portfolio and career readiness.',
        26)
on conflict (code) do nothing;

-- MODULES
with c as (select id from public.courses where code = 'SDSA-26')
insert into public.modules (course_id, module_number, title, weeks_start, weeks_end)
select c.id, m.mn, m.t, m.ws, m.we from c, (values
  (1, 'Digital Foundation', 1, 4),
  (2, 'Internet & Digital Safety', 5, 7),
  (3, 'Office Productivity', 8, 14),
  (4, 'Cloud & Online Productivity', 15, 16),
  (5, 'AI Skills', 17, 20),
  (6, 'Practical Project Development', 21, 23),
  (7, 'Portfolio & Course Completion', 24, 26)
) as m(mn, t, ws, we)
on conflict (course_id, module_number) do nothing;

-- WEEKS (topics; objectives/activities filled by admin later via dashboard)
with c as (select id from public.courses where code = 'SDSA-26')
insert into public.weeks (course_id, module_id, week_number, title, topics)
select c.id,
       (select id from public.modules where course_id = c.id and module_number = w.mod),
       w.wn, w.title, w.topics::jsonb
from c, (values
 (1, 1, 'Orientation & Digital Foundation', '["Academy orientation","Course introduction","Learning journey overview","Introduction to digital world","Basic digital awareness","Learning rules and expectations"]'),
 (2, 1, 'Computer Fundamentals', '["Introduction to computers","Hardware basics","Software basics","Input/output devices","Basic computer components","Files/folders introduction"]'),
 (3, 1, 'Operating System Skills', '["Understanding operating system","Desktop/icons","Basic system navigation","Opening/closing applications","Files/folders management","Basic system settings"]'),
 (4, 1, 'Keyboard & Typing Skills', '["Keyboard layout","Basic typing techniques","Finger positioning","Typing practice","Accuracy improvement","Typing speed development"]'),
 (5, 2, 'Internet Fundamentals', '["What is internet","Web browsers","Websites/webpages","Search engines","Searching for information","Understanding online information"]'),
 (6, 2, 'Digital Communication', '["Introduction to digital communication","Email basics","Sending/receiving emails","Online communication practices","Responsible communication","Digital communication etiquette"]'),
 (7, 2, 'Digital Safety', '["Strong passwords","Privacy basics","Safe internet browsing","Online scams awareness","Responsible online behavior","Personal data protection"]'),
 (8, 3, 'Word Processing I', '["Introduction to word processing","Creating documents","Editing text","Basic formatting","Fonts/paragraphs","Saving documents"]'),
 (9, 3, 'Word Processing II', '["Advanced document formatting","Page layout","Professional document preparation","Tables/structured content","Practical document tasks","Document improvement"]'),
 (10, 3, 'Spreadsheets I', '["Introduction to spreadsheets","Rows/columns","Cells/worksheets","Data entry","Basic formatting","Organizing information"]'),
 (11, 3, 'Spreadsheets II', '["Introduction to formulas","Basic calculations","Functions","Practical data work","Using spreadsheet formulas","Improving productivity"]'),
 (12, 3, 'Spreadsheets III', '["Tables/data organization","Data analysis basics","Practical spreadsheet tasks","Structured data","Productivity applications","Real-world spreadsheet practice"]'),
 (13, 3, 'Presentations I', '["Introduction to presentations","Creating slides","Slide layouts","Adding text/images","Basic presentation design","Organizing presentation content"]'),
 (14, 3, 'Presentations II', '["Improving slide design","Professional presentations","Presentation structure","Visual communication","Presentation project","Independent practical work"]'),
 (15, 4, 'Cloud & File Management', '["Introduction to cloud storage","Uploading files","Organizing cloud files","File sharing","Access/permissions basics","Digital file management"]'),
 (16, 4, 'Online Productivity', '["Introduction to online productivity tools","Online collaboration","Digital work practices","Using online tools","Everyday productivity","Practical online tasks"]'),
 (17, 5, 'Introduction to AI', '["What is AI","Basic AI concepts","Examples of AI","AI in everyday life","Understanding AI tools","Responsible awareness of AI"]'),
 (18, 5, 'AI Tools for Productivity', '["Introduction to practical AI tools","AI for everyday tasks","AI-assisted productivity","Writing/planning support","Using prompts","Practical AI activities"]'),
 (19, 5, 'AI for Content & Learning', '["AI for learning","AI for research support","AI-assisted writing","Content creation support","AI as learning assistant","Reviewing AI-generated information"]'),
 (20, 5, 'Responsible AI & Verification', '["AI accuracy","Verifying AI output","AI ethics basics","Privacy and AI","Responsible AI use","Safe use of AI tools"]'),
 (21, 6, 'Digital Project Planning', '["Understanding digital projects","Selecting project idea","Defining project goals","Planning project tasks","Creating project roadmap","Preparing for development"]'),
 (22, 6, 'Project Development I', '["Starting practical project work","Applying learned digital skills","Creating first project version","Practical implementation","Testing initial work","Receiving feedback"]'),
 (23, 6, 'Project Development II', '["Improving project","Solving problems","Finalizing project work","Project documentation","Reviewing completed work","Preparing final output"]'),
 (24, 7, 'Portfolio & Career Readiness', '["Understanding digital portfolio","Collecting project evidence","Organizing completed work","Presenting skills","Career readiness","Preparing student portfolio"]'),
 (25, 7, 'Final Assessment Preparation', '["Course revision","Reviewing key computer skills","Office productivity review","AI skills review","Practical exercises","Final assessment preparation"]'),
 (26, 7, 'Final Assessment & Course Completion', '["Final practical assessment","Skills demonstration","Final project review","Overall course evaluation","Course completion review","Certificate/completion process"]')
) as w(wn, mod, title, topics)
on conflict (course_id, week_number) do nothing;

-- Create topics rows for every week from the topics array (structure ready for workbook content later)
insert into public.topics (week_id, position, title)
select w.id, ord, t
from public.weeks w,
     jsonb_array_elements_text(w.topics) with ordinality as x(t, ord)
where not exists (select 1 from public.topics tp where tp.week_id = w.id);

-- Default website content keys (admin-editable, no code changes needed)
insert into public.website_content (key, content) values
 ('home.hero', '{"heading":"Sathamba Digital Saksham Academy","gujarati":"શીખીએ • પ્રેક્ટિસ કરીએ • આગળ વધીએ","sub":"Learn • Practice • Apply • Grow","message":"Digital Skills • Computer Education • AI Skills • Practical Learning • Career Development"}'),
 ('about.vision', '{"text":"A digitally skilled Sathamba - where every student, parent and professional can confidently use technology for learning, work and growth."}'),
 ('about.mission', '{"text":"To provide practical, affordable, hands-on digital education - from computer fundamentals to AI skills - with real projects, portfolios and career readiness."}'),
 ('contact.info', '{"address":"Sathamba, Aravalli District, Gujarat","phone":"+91 70437 95279","email":"kumarmehul48@gmail.com","timings":"Mon-Sat, 8:00 AM - 8:00 PM"}'),
 ('faq.list', '{"items":[{"q":"Who can join SDSA?","a":"Anyone - students, job-seekers, women, business owners. No prior computer knowledge needed. We start from zero."},{"q":"What is the course duration?","a":"A structured 26-week (about 6 months) practical learning journey, in 7 modules."},{"q":"Will I get a certificate?","a":"Yes - students who complete the course, practical project and final assessment receive an SDSA completion certificate, publicly verifiable on this website."},{"q":"Do I need my own computer?","a":"No. Every student trains on academy computers in the lab."}]}')
on conflict (key) do nothing;
