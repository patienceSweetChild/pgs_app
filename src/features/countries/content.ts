export type CountrySlug =
  | 'usa'
  | 'uk'
  | 'aus'
  | 'germany'
  | 'nz'
  | 'europe'
  | 'france'
  | 'canada'
  | 'mauritius'
  | 'others';

export const COUNTRY_SLUGS: readonly CountrySlug[] = [
  'usa',
  'uk',
  'aus',
  'germany',
  'nz',
  'europe',
  'france',
  'canada',
  'mauritius',
  'others',
] as const;

export function isCountrySlug(value: string): value is CountrySlug {
  return (COUNTRY_SLUGS as readonly string[]).includes(value);
}

export type SidebarLink = {
  id: string;
  label: string;
};

export type StatValue = {
  value: string;
  label: string;
};

export type StatBlock = {
  values: StatValue[];
  caption: string;
  sourceNote: string;
};

export type OverviewRow = {
  label: string;
  value: string;
};

export type VisaType = {
  name: string;
  description: string;
};

export type DocGroup = {
  title: string;
  items: string[];
};

export type VisaStep = {
  title: string;
  detail: string;
};

export type DosDontsRow = {
  criteria: string;
  dos: string;
  donts: string;
};

export type ShortTermCourse = {
  tag: string;
  title: string;
  blurb: string;
  metric?: string;
};

export type ScholarshipRow = {
  name: string;
  type: string;
  providedBy: string;
};

export type TrackRow = {
  track: string;
  field: string;
  idealFor: string;
};

export type TrackSection = {
  title: string;
  rows: TrackRow[];
};

export type Study101Reasons = {
  research: string;
  universities: string;
  alumni: string;
  famousUnis: string;
  startup: string;
  tagline: string;
  quote: string;
};

export type Study101Tab = {
  id: 'study101';
  label: string;
  sidebarLinks: SidebarLink[];
  stats: StatBlock;
  whyParagraphs: string[];
  overviewRows: OverviewRow[];
  reasons: Study101Reasons;
  stemBlurb: string;
  usmleBlurb: string;
  nonStemBlurb: string;
};

export type CostTab = {
  id: 'cost';
  label: string;
  sidebarLinks: SidebarLink[];
  stats: StatBlock;
  budgetQs: string[];
  spendItems: string[];
  premiumCta: {
    title: string;
    body: string;
  };
};

export type VisaTab = {
  id: 'visa';
  label: string;
  sidebarLinks: SidebarLink[];
  fundingStats: StatBlock;
  visaTypes: VisaType[];
  docGroups: DocGroup[];
  steps: VisaStep[];
  dosDonts: DosDontsRow[];
  helpCta: {
    title: string;
    body: string;
    ctaLabel: string;
  };
};

export type ShortTermTab = {
  id: 'shortTerm';
  label: string;
  stats: StatBlock;
  intro: string[];
  mentorBlurb: string;
  courses: ShortTermCourse[];
};

export type ScholarshipsTab = {
  id: 'scholarships';
  label: string;
  stats: StatBlock;
  intro: string[];
  rows: ScholarshipRow[];
  guide: {
    title: string;
    body: string;
  };
};

export type TracksTab = {
  id: 'tracks';
  label: string;
  stats: StatBlock;
  intro: string[];
  sections: TrackSection[];
  headsUp: string[];
  punchline: string;
};

export type CountryTab =
  | Study101Tab
  | CostTab
  | VisaTab
  | ShortTermTab
  | ScholarshipsTab
  | TracksTab;

export type CountryPageContent = {
  slug: CountrySlug;
  name: string;
  study101Label: string;
  flagCode: string;
  hero: {
    flagImage: string;
    desktopImage: string;
    mobileImage: string;
  };
  intro: {
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    tagline: string;
    ctaLabel: string;
    ctaHref: string;
  };
  tabs: CountryTab[];
};

const OPEN_DOORS_NOTE = '*Data from Open Doors';

export const USA_CONTENT: CountryPageContent = {
  slug: 'usa',
  name: 'USA',
  study101Label: 'USA Study 101',
  flagCode: 'us',
  hero: {
    flagImage: '/assets/img/Frameusa.jpeg',
    desktopImage: '/assets/img/countriesUSA3.png',
    mobileImage: '/assets/img/county-mobile.png',
  },
  intro: {
    titleLine1: 'Comprehensive Guide to',
    titleLine2: 'Studying in the USA',
    subtitle:
      'Best Universities, Programs, Costs & Admission Criteria for International Students',
    tagline: 'For Medical, STEM, and More—We’ve Got You Covered',
    ctaLabel: 'Got Questions? Talk to Us',
    ctaHref: '/contact',
  },
  tabs: [
    {
      id: 'study101',
      label: 'USA Study 101',
      sidebarLinks: [
        {
          id: 'Study_USA_1',
          label: 'Why Study in USA as an Indian Student?',
        },
        {
          id: 'Study_USA_2',
          label: 'USA as a Study Destination: A quick overview',
        },
        {
          id: 'Study_USA_3',
          label: 'Why Students Choose the USA for Higher Studies',
        },
        { id: 'Study_USA_4', label: 'For STEM Candidates:' },
        { id: 'Study_USA_5', label: 'For USMLE Candidates:' },
        { id: 'Study_USA_6', label: 'For All Other Fields (Non-STEM):' },
      ],
      stats: {
        values: [
          { value: '28', label: 'of top 100' },
          { value: '5', label: 'of top 10' },
        ],
        caption: 'Universities are from the US',
        sourceNote: OPEN_DOORS_NOTE,
      },
      whyParagraphs: [
        'With over 1.1 million international students, the USA has emerged as the number one study destination over the years. One of the major reasons for students flocking to study in USA is the excellent reputation that US universities and degrees hold.',
        'Diversity is another distinguishing factor that attracts students to pursue higher studies in USA. The country also provides ample work opportunities to the students during and after completion of their academic courses.',
        'Overall, USA is one of the most favorable places in the world for those who wish to turn their study abroad dream into reality.',
      ],
      overviewRows: [
        {
          label: 'Language You’ll Study In',
          value: 'English – No surprises here.',
        },
        {
          label: 'What IT students can expect',
          value: 'Strong programs in STEM, research & internships',
        },
        {
          label: 'Living costs range',
          value: '$10,000–$20,000 per year (varies by state)',
        },
        {
          label: 'Scholarships',
          value: 'Merit-based, need-based, country-specific',
        },
        {
          label: 'Major US Courses',
          value: 'STEM, Business, Medicine, Arts, Social Sciences',
        },
        {
          label: 'Visa',
          value: 'F1 Student Visa required',
        },
      ],
      reasons: {
        research: 'Strong Research & Tech Support',
        universities: 'Well-known Universities',
        alumni: 'To be part of a strong alumni network',
        famousUnis:
          'The U.S. is home to world-famous universities like MIT, Harvard, Stanford, and many more.',
        startup: 'Good startup & VC Culture',
        tagline: 'Learn. Do. Succeed.',
        quote:
          'Studying in the U.S. means more than just classes — you get real-world experience, STEM OPT extensions, scholarships, internships, and a chance to build your future while you study. It’s where top education meets real opportunity. ❤️',
      },
      stemBlurb:
        "The U.S. is a global leader when it comes to cutting-edge research and innovation in STEM fields. If you're an F-1 visa holder, you get 12 months of Optional Practical Training (OPT) after graduation—and if you're in a STEM field, you can apply for a 24-month STEM OPT extension, giving you up to 36 months of valuable work experience. That’s a huge boost for landing long-term job opportunities and increasing your chances of securing H-1B sponsorship.",
      usmleBlurb:
        'International Medical Graduates (IMGs) play a vital role in the healthcare system, especially by helping fill physician shortages in primary care. In the 2025 Match, 9,761 IMGs landed first-year residency positions, making up over 25% of all matched applicants. For non-U.S. citizen IMGs, the match rate was around 58%—a solid figure considering the level of competition. Whether they choose to build a life and career in the States or use their experience to practice elsewhere, it’s a powerful credential that’s respected worldwide.',
      nonStemBlurb:
        'Studying in the U.S. as an international student in non-STEM fields like business, humanities, arts, or social sciences offers high-value education, global perspectives, and real-world skills—like critical thinking, communication, and adaptability—that are highly valued in today’s international job market. The vibrant campus life and diverse learning environment help you grow personally and professionally. With the right mindset and networking, you can turn your U.S. experience into a strong career launchpad.',
    },
    {
      id: 'cost',
      label: 'Study Cost',
      sidebarLinks: [
        { id: 'cost_budgeting', label: 'U.S. College Budgeting 101' },
        {
          id: 'cost_spend',
          label: 'What Students Really Spend the Most On',
        },
      ],
      stats: {
        values: [
          { value: '1,126,690', label: 'Worldwide' },
          { value: '331,602', label: 'from INDIA' },
        ],
        caption: 'Universities are from the US',
        sourceNote: OPEN_DOORS_NOTE,
      },
      budgetQs: [
        '“Can I actually afford this?”',
        '“Will I be able to pay back my student loan later?”',
        '“What’s the actual budget I need to be prepared for?”',
      ],
      spendItems: [
        'Tuition Fees — This is almost always the largest single cost.',
        'Day-to-day living costs',
        'Health insurance',
        'Visa fees',
        'Emergency funds',
      ],
      premiumCta: {
        title: 'JOIN #PURPLEPREMIUM',
        body: 'Streamlined Support for USA Medical & Non-Medical study Paths.',
      },
    },
    {
      id: 'visa',
      label: 'Visa 101',
      sidebarLinks: [
        { id: 'visa_sticky_1', label: 'Intro to USA Student Visa' },
        {
          id: 'visa_sticky_2',
          label: 'Essential Documents for US Student Visa',
        },
        { id: 'visa_sticky_3', label: 'Step-by-Step Guide: Applying 101' },
        {
          id: 'visa_sticky_4',
          label: "Key Do's and Don'ts for US Student Visa Application/Interview",
        },
        { id: 'visa_sticky_5', label: 'How #PGS Helps' },
      ],
      fundingStats: {
        values: [
          { value: '54.5%', label: 'Personal & Family' },
          { value: '19.0%', label: 'U.S College or UNI' },
          { value: '26.5%', label: 'Other Sources' },
        ],
        caption: 'Top Funding Sources for International Students',
        sourceNote: OPEN_DOORS_NOTE,
      },
      visaTypes: [
        {
          name: 'F-1 Visa',
          description:
            "For full-time academic courses like bachelor's master's or PhD programs",
        },
        {
          name: 'J-1 Visa',
          description:
            'For exchange programs, research, or short term academic training.',
        },
        {
          name: 'M-1 Visa',
          description: 'For vocational or technical training.',
        },
      ],
      docGroups: [
        {
          title: 'Primary Documents',
          items: [
            'Valid Passport',
            'Form I-20 (issued by your school)',
            'DS-160 confirmation page',
            'SEVIS fee receipt',
            'Visa appointment receipt',
            'Recent passport-size photographs',
          ],
        },
        {
          title: 'Academic Documents',
          items: [
            'Admission/Acceptance letter',
            'Official academic transcripts',
            'Test scores (IELTS, TOEFL, GRE, GMAT)',
            'Statement of Purpose (SOP)',
            'Recommendation letters (2–3)',
          ],
        },
        {
          title: 'Financial Documents',
          items: [
            'Bank statements (last 6 months)',
            'Affidavit of support (if sponsored)',
            'Income tax returns of sponsor',
            'Scholarship or loan approval letter',
            'Proof of assets/liabilities',
          ],
        },
        {
          title: 'Notes',
          items: [
            'Ensure all documents are current and meet U.S. embassy/consulate requirements.',
            'Make sure to check the official U.S. Department of State website (travel.state.gov) or follow your local embassy’s official social media account for the latest 2025 updates.',
          ],
        },
      ],
      steps: [
        {
          title: 'Step 1 — Secure Institution Admission',
          detail: 'Get accepted to a SEVP-certified US institution',
        },
        {
          title: 'Step 2 — Obtain Form I-20 Pay SEVIS Fee',
          detail: 'Receive Form I-20 from your school and pay the SEVIS fee',
        },
        {
          title: 'Step 3 — Complete DS-160 Application Form',
          detail: 'Fill out and submit the DS-160 online application',
        },
        {
          title: 'Step 4 — Pay Visa Application Fee',
          detail: 'Schedule Biometrics and appointment',
        },
        {
          title: 'Step 5 — Required Documents',
          detail:
            'Go thru all required documents and make sure they are checked before interview',
        },
        {
          title: 'Step 6 — Visa Interview',
          detail:
            "Prepare for and attend in-person interview. Be Confident. Believe in the process. Don't over-prepare.",
        },
      ],
      dosDonts: [
        {
          criteria: 'Interview',
          dos: 'Arrive early and dress formally',
          donts: 'Avoid rudeness or disorganization',
        },
        {
          criteria: 'Answering Questions',
          dos: 'Be truthful and confident',
          donts: 'Avoid jokes or casual responses',
        },
        {
          criteria: 'Documentation',
          dos: 'Keep all documents organized and complete',
          donts: 'Never miss or falsify documents',
        },
        {
          criteria: 'Financials',
          dos: 'Ensure timely payment, ready and keep all receipts',
          donts: 'Don’t apply without finance support and proof',
        },
      ],
      helpCta: {
        title: 'How #PGS Helps',
        body: 'At PupilGuides, we understand the intricacies involved in applying for a US student visa. We’ll provide end-to-end personalized support at every stage — from application to interview — to increase your chances of success.',
        ctaLabel: 'Talk to our expert today and get started',
      },
    },
    {
      id: 'shortTerm',
      label: 'Short-Term-Profile Courses',
      stats: {
        values: [
          { value: '1,126,690', label: 'studied in person' },
          { value: '18,129', label: 'studied online from abroad' },
        ],
        caption:
          'These numbers are updated every few years. When the next update is out, you’ll see it live right here.',
        sourceNote: OPEN_DOORS_NOTE,
      },
      intro: [
        'As part of our profile-building program, we bring you a range of exclusive internship opportunities, certificate courses, and short-term programs designed to give your CV that extra edge. These are not your typical courses—they’re curated based on what actually helps students get noticed, whether it’s for university admissions, competitive jobs, or global exposure.',
        'From clinical rotations and internships to summer schools and online certifications from top institutes—we’ve got you covered. These experiences also help you build a stronger network, meet mentors in your field, and add real value to your journey.',
        'Not sure which course fits your goals? Wondering if you’re eligible or if this adds real weight to your application?',
        'Talk to our expert today and get clarity. We’ll help you choose the right add-ons based on your career path and guide you through the process step by step.',
      ],
      mentorBlurb:
        'Our mentors are better suited to guide you based on your background, goals, and where you want to land. Reach out to them.',
      courses: [
        {
          tag: '#inCampus',
          title: 'Harvard Internship',
          blurb:
            'Harvard Internship Harvard Harvard Internship Harvard Harvard Internship Harvard.',
          metric: '650 students enrolled',
        },
        {
          tag: '#inCampus',
          title: 'Harvard Internship',
          blurb:
            'Harvard Internship Harvard Harvard Internship Harvard Harvard Internship Harvard.',
          metric: 'Our 3rd Batch',
        },
        {
          tag: '#inCampus',
          title: 'Harvard Internship',
          blurb:
            'Harvard Internship Harvard Harvard Internship Harvard Harvard Internship Harvard.',
          metric: '650 students enrolled',
        },
      ],
    },
    {
      id: 'scholarships',
      label: 'Scholarships',
      stats: {
        values: [
          { value: '88%', label: 'special-focus institutions' },
          { value: '78%', label: 'baccalaureate colleges' },
          { value: '65%', label: 'doctoral universities' },
        ],
        caption:
          'Institutions have Boosted or Maintained Financial Support Since 2020',
        sourceNote: OPEN_DOORS_NOTE,
      },
      intro: [
        'One of the main reasons students are attracted to studying in the USA is the availability of scholarships, research funding, and a solid post-study job environment.',
        'But scholarships aren’t automatic. Most universities have a separate division that reviews each student’s eligibility—looking at financial need, academic background, and overall fit before awarding any grant.',
        'In addition to scholarships, there are also RA/TA positions, research grants, and exchange program funds that students can apply for.',
        'We’ve listed a few of the key ones below.',
      ],
      rows: [
        {
          name: 'Fulbright Foreign Student Program',
          type: 'Fully Funded',
          providedBy: 'U.S. Govt',
        },
        {
          name: 'Hubert H. Humphrey Fellowship',
          type: 'Full (non-degree)',
          providedBy: 'U.S. Govt',
        },
        {
          name: 'AAUW International Fellowships',
          type: 'Women-focused',
          providedBy: 'AAUW',
        },
        {
          name: 'Aga Khan Foundation Scholarship',
          type: 'Need-based + Loan',
          providedBy: 'Aga Khan Foundation',
        },
        {
          name: 'Rotary Foundation Global Grants',
          type: 'Project/Research',
          providedBy: 'Rotary International',
        },
        {
          name: 'Knight-Hennessy Scholars',
          type: 'Fully Funded',
          providedBy: 'Stanford University',
        },
        {
          name: 'Yale Need-Based Aid',
          type: '100% Need Met',
          providedBy: 'Yale University',
        },
        {
          name: 'Harvard Financial Aid',
          type: 'Need-Based',
          providedBy: 'Harvard University',
        },
        {
          name: 'On-Campus Graduate Assistantships',
          type: 'Tuition + Stipend',
          providedBy: 'Most U.S. Universities',
        },
        {
          name: 'Research Assistantships (RA/TA)',
          type: 'Paid Positions',
          providedBy: 'STEM/Research Programs',
        },
        {
          name: 'Emerging Global Leader Scholarship',
          type: 'Fully Funded',
          providedBy: 'American University',
        },
      ],
      guide: {
        title: '#PGS | Scholarship Apply Guide',
        body: "Most students miss scholarships, not because they're not eligible, but because no one tells them how to actually apply the right way. For international students, the scholarship journey is often confusing. Every university or scholarship body has its own rules. Some want essays. Some ask for income proof. Deadlines are to be followed. And most of the time, you're just applying randomly hoping it works. By the time you figure it all out—you’ve either missed the deadline or applied with zero strategy. That’s where most students lose out. At #PGS, we don’t let that happen. We help you find scholarships that actually match your course and profile, break down what each one really needs—essays, docs, formats, all of it—and apply with a clear plan, without last-minute chaos. And if you’re part of #PurplePremium? This whole process is already included.",
      },
    },
    {
      id: 'tracks',
      label: 'Popular Study Tracks',
      stats: {
        values: [
          { value: '3.2%', label: 'Health Professions' },
          {
            value: '43.6%',
            label: 'Math, Engineering & Computer Science',
          },
          { value: '14.2%', label: 'Business & Management' },
        ],
        caption: 'Study Tracks Picked by International Students',
        sourceNote: OPEN_DOORS_NOTE,
      },
      intro: [
        'Every year, international students apply to study in the U.S. and a majority of them end up choosing from a few key programs. According to data from Open Doors and SEVIS, over 60% of students pick STEM, business, or health-related degrees.',
        'For a quick overview: we’ve divided them into Non-Medical and Medical sections.',
        'Below is a list of Master’s and UG tracks. Our mentors can guide you based on what best fits your profile.',
      ],
      sections: [
        {
          title: 'Section 1: Masters, STEM, UG, MBA & Others',
          rows: [
            {
              track: 'Computer Science',
              field: 'STEM',
              idealFor: 'CS, IT, or math background',
            },
            {
              track: 'Data Science & AI',
              field: 'STEM',
              idealFor: 'CS, stats, math grads',
            },
            {
              track: 'Cybersecurity',
              field: 'STEM',
              idealFor: 'Tech background or CS grads',
            },
            {
              track: 'Business Analytics',
              field: 'STEM',
              idealFor: 'Business + basic coding',
            },
            {
              track: 'MBA (General / Finance / Marketing)',
              field: 'Business',
              idealFor: 'Working professionals, any UG',
            },
            {
              track: 'Mechanical Engineering',
              field: 'STEM',
              idealFor: 'Engineering UG (Mech/Auto)',
            },
            {
              track: 'Electrical Engineering',
              field: 'STEM',
              idealFor: 'EE/EC/Instrumentation grads',
            },
            {
              track: 'Architecture',
              field: 'Design',
              idealFor: 'B.Arch holders or design UG',
            },
            {
              track: 'Film & Media',
              field: 'Creative',
              idealFor: 'Media, design, or creators',
            },
            {
              track: 'Law (LLM)',
              field: 'Legal',
              idealFor: 'LLB grads',
            },
            {
              track: 'Psychology',
              field: 'Social Sciences',
              idealFor: 'Psychology or related UG',
            },
          ],
        },
        {
          title: 'Section 2: Medical, Health, and Life Sciences',
          rows: [
            {
              track: 'USMLE Pathway',
              field: 'Medicine',
              idealFor: 'MBBS graduates / Doctors only',
            },
            {
              track: 'Clinical Embryology',
              field: 'Life Sciences + Medicine',
              idealFor: 'Life sci, biotech, BSc, BPharm',
            },
            {
              track: 'Public Health (MPH)',
              field: 'Health',
              idealFor: 'Any health/life sci grads',
            },
            {
              track: 'Nursing (BSN / MSN)',
              field: 'Healthcare',
              idealFor: '12th (for BSN) / RN / BSc',
            },
            {
              track: 'Health Administration',
              field: 'Management',
              idealFor: 'Medical, dental, or health UG',
            },
            {
              track: 'Occupational Therapy',
              field: 'Rehab Sciences',
              idealFor: 'Allied health / BPT grads',
            },
            {
              track: 'Nutrition & Dietetics',
              field: 'Allied Health',
              idealFor: 'BSc Life Sci / Dietetics UG',
            },
          ],
        },
      ],
      headsUp: [
        'The list above is just a course highlight, these aren’t the only options, just the ones most students usually go for. What really works for you depends on your profile.',
        "At #PGS, we don’t suggest random courses at you. We start with where you want to end up ‘your career goal’ and exclusively prioritize reverse engineering your study path from there. It’s not a shortcut. It’s a smarter way. We’re admission counselors, sure. But first, we’re mentors.",
        'Because at PGS, we believe one thing:',
      ],
      punchline: 'Skill > Everything Else',
    },
  ],
};

type CountryMeta = {
  name: string;
  flagCode: string;
};

const COUNTRY_META: Record<Exclude<CountrySlug, 'usa'>, CountryMeta> = {
  uk: { name: 'UK', flagCode: 'gb' },
  aus: { name: 'Australia', flagCode: 'au' },
  germany: { name: 'Germany', flagCode: 'de' },
  nz: { name: 'New Zealand', flagCode: 'nz' },
  europe: { name: 'Europe', flagCode: 'eu' },
  france: { name: 'France', flagCode: 'fr' },
  canada: { name: 'Canada', flagCode: 'ca' },
  mauritius: { name: 'Mauritius', flagCode: 'mu' },
  others: { name: 'Studying Abroad', flagCode: 'un' },
};

function study101LabelFor(name: string, slug: CountrySlug): string {
  if (slug === 'others') {
    return 'Study Abroad Study 101';
  }
  return `${name} Study 101`;
}

function titleLine2For(name: string, slug: CountrySlug): string {
  if (slug === 'others') {
    return 'Studying Abroad';
  }
  return `Studying in the ${name}`;
}

function withCountryOverrides(
  slug: Exclude<CountrySlug, 'usa'>,
): CountryPageContent {
  const { name, flagCode } = COUNTRY_META[slug];
  const study101Label = study101LabelFor(name, slug);
  const titleLine2 = titleLine2For(name, slug);

  const tabs = USA_CONTENT.tabs.map((tab): CountryTab => {
    if (tab.id === 'study101') {
      return {
        ...tab,
        label: study101Label,
      };
    }
    return tab;
  });

  return {
    ...USA_CONTENT,
    slug,
    name,
    study101Label,
    flagCode,
    intro: {
      ...USA_CONTENT.intro,
      titleLine2,
    },
    tabs,
  };
}

export function getCountryContent(slug: string): CountryPageContent | null {
  if (!isCountrySlug(slug)) {
    return null;
  }

  if (slug === 'usa') {
    return USA_CONTENT;
  }

  return withCountryOverrides(slug);
}
