import { User, UserRole, Event, Job } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Sarah Chen',
    role: UserRole.ALUMNI,
    email: 'sarah.c@techcorp.com',
    avatar: 'https://picsum.photos/seed/sarah/200/200',
    graduationYear: 2018,
    department: 'Computer Science',
    company: 'Google',
    jobTitle: 'Senior Software Engineer',
    location: 'San Francisco, CA',
    skills: ['React', 'TypeScript', 'System Design', 'Cloud Architecture'],
    bio: 'Passionate about scalable systems and mentoring junior devs.',
    interests: ['AI/ML', 'Women in Tech', 'Startups'],
    mentorshipTopics: ['Technical Interview Prep', 'System Design', 'Career Growth'],
    socialLinks: {
      linkedin: 'linkedin.com/in/sarahchen',
      github: 'github.com/sarahc'
    },
    privacySettings: {
      showEmail: false,
      showCompany: true,
      showSocials: true
    }
  },
  {
    id: 'u2',
    name: 'James Wilson',
    role: UserRole.ALUMNI,
    email: 'j.wilson@finance.ny',
    avatar: 'https://picsum.photos/seed/james/200/200',
    graduationYear: 2015,
    department: 'Business Administration',
    company: 'Goldman Sachs',
    jobTitle: 'Investment Banker',
    location: 'New York, NY',
    skills: ['Financial Modeling', 'Mergers & Acquisitions', 'Leadership'],
    bio: 'Experienced in high-stakes finance and corporate strategy.',
    interests: ['Fintech', 'Angel Investing', 'Economics'],
    mentorshipTopics: ['Breaking into Finance', 'MBA Advice', 'Networking'],
    socialLinks: {
      linkedin: 'linkedin.com/in/jwilson'
    },
    privacySettings: {
      showEmail: true,
      showCompany: true,
      showSocials: true
    }
  },
  {
    id: 'u3',
    name: 'Elena Rodriguez',
    role: UserRole.ALUMNI,
    email: 'elena.r@design.co',
    avatar: 'https://picsum.photos/seed/elena/200/200',
    graduationYear: 2020,
    department: 'Graphic Design',
    company: 'Adobe',
    jobTitle: 'Product Designer',
    location: 'Remote',
    skills: ['UI/UX', 'Figma', 'User Research', 'Prototyping'],
    bio: 'Creating user-centric digital experiences.',
    interests: ['Design Systems', 'Accessibility', 'Digital Art'],
    mentorshipTopics: ['Portfolio Review', 'UX Research', 'Remote Work'],
    privacySettings: {
      showEmail: true,
      showCompany: true,
      showSocials: true
    }
  },
  {
    id: 'u4',
    name: 'Michael Chang',
    role: UserRole.ALUMNI,
    email: 'm.chang@biotech.io',
    avatar: 'https://picsum.photos/seed/michael/200/200',
    graduationYear: 2012,
    department: 'Biomedical Engineering',
    company: 'Genentech',
    jobTitle: 'Research Scientist',
    location: 'Boston, MA',
    skills: ['Data Analysis', 'Clinical Trials', 'Python', 'Bioinformatics'],
    bio: 'Working on the next generation of cancer therapies.',
    interests: ['Healthcare', 'Running', 'Science Communication'],
    mentorshipTopics: ['PhD vs Industry', 'Biotech Trends', 'Grant Writing'],
    privacySettings: {
      showEmail: false,
      showCompany: true,
      showSocials: false
    }
  },
  {
    id: 'u5',
    name: 'David Kim',
    role: UserRole.STUDENT,
    email: 'david.kim@university.edu',
    avatar: 'https://picsum.photos/seed/david/200/200',
    department: 'Computer Science',
    graduationYear: 2025,
    skills: ['JavaScript', 'Python', 'Basic React'],
    bio: 'Junior CS student looking for internship opportunities in Big Tech.',
    interests: ['Web Development', 'Hackathons', 'Career Growth'],
    socialLinks: {
      github: 'github.com/davidkim-dev',
      linkedin: 'linkedin.com/in/davidkim'
    },
    privacySettings: {
      showEmail: true,
      showCompany: true,
      showSocials: true
    }
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Global Alumni Summit 2024',
    date: 'Oct 15, 2024',
    location: 'Grand Hall & Virtual',
    type: 'Reunion',
    attendees: 450,
    image: 'https://picsum.photos/seed/summit/400/200',
    description: 'Join us for the biggest annual gathering of alumni from across the globe.',
    attendeeIds: []
  },
  {
    id: 'e2',
    title: 'Tech Trends: AI in 2025',
    date: 'Nov 02, 2024',
    location: 'Virtual Zoom',
    type: 'Webinar',
    attendees: 120,
    image: 'https://picsum.photos/seed/tech/400/200',
    description: 'A deep dive into the future of Artificial Intelligence with industry leaders.',
    attendeeIds: ['u5']
  },
  {
    id: 'e3',
    title: 'Spring Career Fair',
    date: 'Nov 10, 2024',
    location: 'Campus Center',
    type: 'Networking',
    attendees: 300,
    image: 'https://picsum.photos/seed/career/400/200',
    description: 'Connect with top employers looking for fresh talent.',
    attendeeIds: []
  }
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Frontend Engineer Intern',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    type: 'Internship',
    postedDate: '2 days ago',
    description: 'We are looking for a passionate frontend intern to join our product team.',
    requirements: ['React', 'JavaScript', 'HTML/CSS'],
    postedByAlumniId: 'u1'
  },
  {
    id: 'j2',
    title: 'Associate Product Designer',
    company: 'Creative Studios',
    location: 'Remote',
    type: 'Full-time',
    postedDate: '1 week ago',
    description: 'Join our award-winning design team to build next-gen mobile apps.',
    requirements: ['Figma', 'UI Design', 'Communication'],
    postedByAlumniId: 'u3'
  },
  {
    id: 'j3',
    title: 'Junior Data Analyst',
    company: 'FinData',
    location: 'New York, NY',
    type: 'Full-time',
    postedDate: '3 days ago',
    description: 'Analyze market trends and help drive business decisions.',
    requirements: ['SQL', 'Excel', 'Python'],
    postedByAlumniId: 'u2'
  },
  {
    id: 'j4',
    title: 'Software Engineering Resident',
    company: 'Google',
    location: 'Mountain View, CA',
    type: 'Full-time',
    postedDate: 'Just now',
    description: 'A residency program designed to bridge the gap between academia and industry.',
    requirements: ['Computer Science Degree', 'Java or C++', 'Algorithms'],
  }
];