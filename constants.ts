
import { User, UserRole, Event, Job, Feedback } from './types';

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
    certifications: ['AWS Certified Solutions Architect', 'Google Cloud Professional Cloud Architect'],
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
    certifications: ['CFA Level III', 'Financial Risk Manager (FRM)'],
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
    certifications: ['Google UX Design Certificate'],
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
    certifications: [],
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
    certifications: ['Meta Front-End Developer Certificate'],
    bio: 'Junior CS student looking for internship opportunities in Big Tech.',
    projects: [
        {
            id: 'p1',
            title: 'Campus Marketplace App',
            description: 'A React Native mobile app for students to buy and sell textbooks locally.',
            technologies: ['React Native', 'Firebase', 'Redux'],
            link: 'github.com/davidkim/market',
            imageUrl: 'https://picsum.photos/seed/p1/300/200'
        },
        {
            id: 'p2',
            title: 'Algorithm Visualizer',
            description: 'Interactive web app to visualize sorting and pathfinding algorithms.',
            technologies: ['JavaScript', 'HTML5 Canvas', 'CSS'],
            link: 'davidkim.dev/algo',
            imageUrl: 'https://picsum.photos/seed/p2/300/200'
        }
    ],
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
  },
  {
    id: 'u6',
    name: 'Emily Davis',
    role: UserRole.STUDENT,
    email: 'emily.d@university.edu',
    avatar: 'https://picsum.photos/seed/emily/200/200',
    department: 'Business Administration',
    graduationYear: 2024,
    skills: ['Marketing', 'Public Speaking', 'Excel'],
    certifications: ['Google Digital Garage'],
    bio: 'Business student passionate about social entrepreneurship.',
    projects: [
        {
            id: 'p3',
            title: 'Eco-Friendly Campus Initiative',
            description: 'Led a team of 10 to implement recycling programs in 5 dorms.',
            technologies: ['Project Management', 'Sustainability'],
            imageUrl: 'https://picsum.photos/seed/p3/300/200'
        }
    ],
    interests: ['Marketing', 'Social Impact', 'Startups'],
    privacySettings: {
      showEmail: true,
      showCompany: false,
      showSocials: true
    }
  },
  {
    id: 'admin1',
    name: 'Admin User',
    role: UserRole.ADMIN,
    email: 'admin@alumnexus.edu',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff',
    department: 'Administration',
    graduationYear: 0,
    skills: ['Management', 'Platform Admin'],
    certifications: [],
    bio: 'System Administrator.',
    interests: [],
    privacySettings: {
      showEmail: true,
      showCompany: true,
      showSocials: true
    }
  },
  // THE CREATOR
  {
    id: 'creator1',
    name: 'Project Creator',
    role: UserRole.CREATOR,
    email: 'creater@alumni.com', // As requested
    avatar: 'https://ui-avatars.com/api/?name=Project+Creator&background=000&color=fff',
    department: 'Product',
    graduationYear: 0,
    skills: ['Full Stack', 'Product Vision', 'AI'],
    bio: 'I build things.',
    interests: [],
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
    companyLogo: 'https://logo.clearbit.com/techcorp.com',
    location: 'San Francisco, CA',
    type: 'Internship',
    postedDate: '2 days ago',
    description: '<p>We are looking for a <strong>passionate frontend intern</strong> to join our product team.</p><p>You will be working on:</p><ul><li>Building reusable components</li><li>Optimizing web performance</li><li>Collaborating with designers</li></ul>',
    requirements: ['React', 'JavaScript', 'HTML/CSS'],
    postedByAlumniId: 'u1',
    applicationUrl: 'https://www.linkedin.com/jobs/view/123456789'
  },
  {
    id: 'j2',
    title: 'Associate Product Designer',
    company: 'Creative Studios',
    companyLogo: 'https://logo.clearbit.com/adobe.com',
    location: 'Remote',
    type: 'Full-time',
    postedDate: '1 week ago',
    description: '<p>Join our <em>award-winning</em> design team to build next-gen mobile apps.</p><p>We value creativity and user-centric design.</p>',
    requirements: ['Figma', 'UI Design', 'Communication'],
    postedByAlumniId: 'u3',
    applicationUrl: 'https://www.linkedin.com/jobs'
  },
  {
    id: 'j3',
    title: 'Junior Data Analyst',
    company: 'FinData',
    companyLogo: 'https://logo.clearbit.com/goldmansachs.com',
    location: 'New York, NY',
    type: 'Full-time',
    postedDate: '3 days ago',
    description: 'Analyze market trends and help drive business decisions. <br/><br/><strong>Key Responsibilities:</strong><br/>- Data mining<br/>- Reporting<br/>- Visualization',
    requirements: ['SQL', 'Excel', 'Python'],
    postedByAlumniId: 'u2',
    applicationUrl: 'https://www.linkedin.com/jobs'
  },
  {
    id: 'j4',
    title: 'Software Engineering Resident',
    company: 'Google',
    companyLogo: 'https://logo.clearbit.com/google.com',
    location: 'Mountain View, CA',
    type: 'Full-time',
    postedDate: 'Just now',
    description: '<p>A residency program designed to bridge the gap between academia and industry. You will receive <b>mentorship</b> and training.</p>',
    requirements: ['Computer Science Degree', 'Java or C++', 'Algorithms'],
    applicationUrl: 'https://careers.google.com'
  }
];

export const MOCK_FEEDBACK: Feedback[] = [
    {
        id: 'f1',
        userId: 'u5',
        userName: 'David Kim',
        userRole: UserRole.STUDENT,
        rating: 5,
        category: 'Feature',
        comment: 'The mentorship matching AI is incredible! Found a mentor in 2 days.',
        date: '2024-05-10'
    },
    {
        id: 'f2',
        userId: 'u1',
        userName: 'Sarah Chen',
        userRole: UserRole.ALUMNI,
        rating: 4,
        category: 'Content',
        comment: 'Great platform. Would love to see more events in the Bay Area.',
        date: '2024-05-12'
    },
    {
        id: 'f3',
        userId: 'u6',
        userName: 'Emily Davis',
        userRole: UserRole.STUDENT,
        rating: 3,
        category: 'Bug',
        comment: 'Mobile menu sometimes closes when I scroll too fast.',
        date: '2024-05-15'
    },
    {
        id: 'f4',
        userId: 'u2',
        userName: 'James Wilson',
        userRole: UserRole.ALUMNI,
        rating: 5,
        category: 'Feature',
        comment: 'Posting jobs is very seamless. The analytics on who viewed it would be nice.',
        date: '2024-05-18'
    }
];
