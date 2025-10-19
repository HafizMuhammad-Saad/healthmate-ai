import {
    Search,
    Users,
    FileText,
    MessageSquare,
    BarChart3,
    Shield,
    Clock,
    Award,
    Briefcase,
    Building2,
    LayoutDashboard,
    Plus,
} from "lucide-react"

export const jobSeekerFeatures = [
    {
        Icon: Search,
        title: "Smart Job Matching",
        description: "Get matched with the right job opportunities based on your skills and preferences.",
    },
    {
        Icon: Users,
        title: "Profile Management",
        description: "Easily manage your profile and showcase your skills to potential employers.", 
    },
    {
        Icon: FileText,
        title: "Job Application Tracking",
        description: "Keep track of your job applications and their statuses in one place.",
    },
    {
        Icon: MessageSquare,
        title: "Interview Scheduling",
        description: "Easily schedule and manage your interviews with potential employers.",
    }

]

export const employerFeatures = [
    {
        Icon: BarChart3,
        title: "Smart Job Matching",
        description: "Get matched with the right job opportunities based on your skills and preferences.",
    },
    {
        Icon: Shield,
        title: "Employer Profile Management",
        description: "Manage your company profile and showcase your job listings to potential candidates.",
    },
    {
        Icon: Clock,
        title: "Job Posting Management",
        description: "Easily create, edit, and manage your job postings in one place.",
    },
    {
        Icon: Award,
        title: "Interview Scheduling",
        description: "Easily schedule and manage your interviews with potential candidates.",
    }

]

export const NAVIGATION_MENU = [
    {id: "employer-dashboard", name: "Dashboard", icon: LayoutDashboard},
    {id: "post-job", name: "Post Jobs", icon: Plus},
    {id: "manage-jobs", name: "Manage Jobs", icon: Briefcase},
    {id: "company-profile", name: "Company Profile", icon: Building2},

]

export const CATEGORIES = [
    {value: "Engineering", label: "Engineering"},
    {value: "Marketing", label: "Marketing"},
    {value: "Sales", label: "Sales"},
    {value: "Design", label: "Design"},
    {value: "Finance", label: "Finance"},
    {value: "Human Resources", label: "Human Resources"},
    {value: "Customer Support", label: "Customer Support"},
    {value: "IT", label: "IT"},
    {value: "Other", label: "Other"}

]

export const JOB_TYPES = [
    {value: "Full-Time", label: "Full-Time"},
    {value: "Part-Time", label: "Part-Time"},
    {value: "Contract", label: "Contract"},
    {value: "Internship", label: "Internship"},
    {value: "Remote", label: "Remote"},
]

export const SALARY_RANGES = [
    "Less than 25k",
    "25k - 50k",
    "50k - 75k",
    "75k - 100k",
    "100k+"
]